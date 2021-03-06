import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'

import { swapClients } from '../apollo/client'
import {
  FILTERED_TRANSACTIONS,
  HOURLY_PAIR_RATES,
  PAIR_CHART,
  PAIR_DATA,
  PAIRS_BULK,
  PAIRS_CURRENT,
  PAIRS_HISTORICAL_BULK,
} from '../apollo/queries'

import { useEthPrice } from './GlobalData'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import {
  get2DayPercentChange,
  getBlocksFromTimestamps,
  getPercentChange,
  getTimestampsForChanges,
  isAddress,
  splitQuery,
} from '../utils'
import { chainId, timeframeOptions, TRACKED_OVERRIDES } from '../constants'
import { updateNameData } from '../utils/data'
import useBlockNumber from '../hooks/useBlockNumber'

const UPDATE = 'UPDATE'
const UPDATE_PAIR_TXNS = 'UPDATE_PAIR_TXNS'
const UPDATE_CHART_DATA = 'UPDATE_CHART_DATA'
const UPDATE_TOP_PAIRS = 'UPDATE_TOP_PAIRS'
const UPDATE_HOURLY_DATA = 'UPDATE_HOURLY_DATA'

dayjs.extend(utc)

export function safeAccess(object, path) {
  return object
    ? path.reduce(
        (accumulator, currentValue) => (accumulator && accumulator[currentValue] ? accumulator[currentValue] : null),
        object
      )
    : null
}

const PairDataContext = createContext()

function usePairDataContext() {
  return useContext(PairDataContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { pairAddress, data } = payload
      return {
        ...state,
        [pairAddress]: {
          ...state?.[pairAddress],
          ...data,
        },
      }
    }

    case UPDATE_TOP_PAIRS: {
      const { topPairs } = payload
      let added = {}
      topPairs.map((pair) => {
        return (added[pair.id] = pair)
      })
      return {
        ...state,
        ...added,
      }
    }

    case UPDATE_PAIR_TXNS: {
      const { address, transactions } = payload
      return {
        ...state,
        [address]: {
          ...(safeAccess(state, [address]) || {}),
          txns: transactions,
        },
      }
    }
    case UPDATE_CHART_DATA: {
      const { address, chartData } = payload
      return {
        ...state,
        [address]: {
          ...(safeAccess(state, [address]) || {}),
          chartData,
        },
      }
    }

    case UPDATE_HOURLY_DATA: {
      const { address, hourlyData, timeWindow } = payload
      return {
        ...state,
        [address]: {
          ...state?.[address],
          hourlyData: {
            ...state?.[address]?.hourlyData,
            [timeWindow]: hourlyData,
          },
        },
      }
    }

    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {})

  // update pair specific data
  const update = useCallback((pairAddress, data) => {
    dispatch({
      type: UPDATE,
      payload: {
        pairAddress,
        data,
      },
    })
  }, [])

  const updateTopPairs = useCallback((topPairs) => {
    dispatch({
      type: UPDATE_TOP_PAIRS,
      payload: {
        topPairs,
      },
    })
  }, [])

  const updatePairTxns = useCallback((address, transactions) => {
    dispatch({
      type: UPDATE_PAIR_TXNS,
      payload: { address, transactions },
    })
  }, [])

  const updateChartData = useCallback((address, chartData) => {
    dispatch({
      type: UPDATE_CHART_DATA,
      payload: { address, chartData },
    })
  }, [])

  const updateHourlyData = useCallback((address, hourlyData, timeWindow) => {
    dispatch({
      type: UPDATE_HOURLY_DATA,
      payload: { address, hourlyData, timeWindow },
    })
  }, [])

  return (
    <PairDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updatePairTxns,
            updateChartData,
            updateTopPairs,
            updateHourlyData,
          },
        ],
        [state, update, updatePairTxns, updateChartData, updateTopPairs, updateHourlyData]
      )}
    >
      {children}
    </PairDataContext.Provider>
  )
}

async function getBulkPairData(pairList, ethPrice) {
  const [t1, t2, tWeek] = getTimestampsForChanges()
  let [{ number: b1 }, { number: b2 }, { number: bWeek }] = (await getBlocksFromTimestamps([t1, t2, tWeek])) || {}

  // Kh???c ph???c khi subgraph ko sync ???????c block m???i.
  if (bWeek === undefined) {
    alert('Cannot fetch last week block number.')
    return []
  }
  if (b2 === undefined) b2 = bWeek
  if (b1 === undefined) b1 = b2

  try {
    let current = await swapClients[chainId].query({
      query: PAIRS_BULK,
      variables: {
        allPairs: pairList,
      },
      fetchPolicy: 'network-only',
    })
    let [oneDayResult, twoDayResult, oneWeekResult] = await Promise.all(
      [b1, b2, bWeek].map(async (block) => {
        let result = swapClients[chainId].query({
          query: PAIRS_HISTORICAL_BULK(block, pairList),
          fetchPolicy: 'network-only',
        })
        return result
      })
    )
    let oneDayData = oneDayResult?.data?.pairs.reduce((obj, cur, i) => {
      return { ...obj, [cur.id]: cur }
    }, {})

    let twoDayData = twoDayResult?.data?.pairs.reduce((obj, cur, i) => {
      return { ...obj, [cur.id]: cur }
    }, {})

    let oneWeekData = oneWeekResult?.data?.pairs.reduce((obj, cur, i) => {
      return { ...obj, [cur.id]: cur }
    }, {})

    let pairData = await Promise.all(
      current &&
        current.data.pairs.map(async (pair) => {
          let data = { ...pair }
          let oneDayHistory = oneDayData?.[pair.id]
          if (!oneDayHistory) {
            let newData = await swapClients[chainId].query({
              query: PAIR_DATA(pair.id, b1),
              fetchPolicy: 'network-only',
            })
            oneDayHistory = newData.data.pairs[0]
          }
          let twoDayHistory = twoDayData?.[pair.id]
          if (!twoDayHistory) {
            let newData = await swapClients[chainId].query({
              query: PAIR_DATA(pair.id, b2),
              fetchPolicy: 'network-only',
            })
            twoDayHistory = newData.data.pairs[0]
          }
          let oneWeekHistory = oneWeekData?.[pair.id]
          if (!oneWeekHistory) {
            let newData = await swapClients[chainId].query({
              query: PAIR_DATA(pair.id, bWeek),
              fetchPolicy: 'network-only',
            })
            oneWeekHistory = newData.data.pairs[0]
          }
          data = parseData(data, oneDayHistory, twoDayHistory, oneWeekHistory, ethPrice, b1)
          return data
        })
    )
    return pairData
  } catch (e) {
    console.log(e)
  }
}

/**
 * Get m???t ?????ng data trong "hi???n t???i", "1 day ago", "2 days ago",
 * "1 week ago", "2 week ago" ????? parse ra data m?? UI c???n.
 * @param pairList
 */
export async function getBulkPairDataForFooter(pairList) {
  const [t1] = getTimestampsForChanges()
  const [{ number: b1 }] = (await getBlocksFromTimestamps([t1])) || {}

  if (b1 === undefined) return []

  try {
    // L???y data current.
    const current = await swapClients[chainId].query({
      query: PAIRS_BULK,
      variables: {
        allPairs: pairList,
      },
      fetchPolicy: 'network-only',
    })

    // L???y data qu?? kh???.
    const [oneDayResult] = await Promise.all(
      [b1].map(async (block) => {
        return swapClients[chainId].query({
          query: PAIRS_HISTORICAL_BULK(block, pairList),
          fetchPolicy: 'network-only',
        })
      })
    )

    // L??m ?????p data qu?? kh???.
    const oneDayData = oneDayResult?.data?.pairs.reduce((obj, cur) => {
      return { ...obj, [cur.id]: cur }
    }, {})

    // So s??nh data hi???n t???i v?? qu?? kh??? v?? tr??? v??? gi?? tr??? mong mu???n:
    // V???i m???i pair ??? hi???n t???i, t??m data c???a n?? trong qu?? kh??? r???i map s??? thay ?????i.
    const pairs = await Promise.all(
      current &&
        current.data.pairs.map(async (pair) => {
          let data = pair

          async function getHistoryFromData(data, blockNumber) {
            let history = data?.[pair.id]
            if (!history) {
              const newData = await swapClients[chainId].query({
                query: PAIR_DATA(pair.id, blockNumber),
                fetchPolicy: 'network-only',
              })
              history = newData.data.pairs[0]
            }
            return history
          }

          const oneDayHistory = await getHistoryFromData(oneDayData, b1)

          // N???u kh??ng c?? data qu?? kh??? th?? tr??? v??? null.
          if (oneDayHistory) {
            data = parseDataForFooter(data, oneDayHistory)
            return data
          } else {
            return null
          }
        })
    )
    // L???c nh???ng pair n??o b??? null.
    return pairs.filter((pair) => pair !== null)
  } catch (e) {
    console.error(e)
    return []
  }
}

function parseData(data, oneDayData, twoDayData, oneWeekData, ethPrice, oneDayBlock) {
  const pairAddress = data.id

  // get volume changes
  const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
    data?.volumeUSD,
    oneDayData?.volumeUSD ? oneDayData.volumeUSD : 0,
    twoDayData?.volumeUSD ? twoDayData.volumeUSD : 0
  )
  const [oneDayVolumeUntracked, volumeChangeUntracked] = get2DayPercentChange(
    data?.untrackedVolumeUSD,
    oneDayData?.untrackedVolumeUSD ? parseFloat(oneDayData?.untrackedVolumeUSD) : 0,
    twoDayData?.untrackedVolumeUSD ? twoDayData?.untrackedVolumeUSD : 0
  )

  const oneWeekVolumeUSD = parseFloat(oneWeekData ? data?.volumeUSD - oneWeekData?.volumeUSD : data.volumeUSD)

  const oneWeekVolumeUntracked = parseFloat(
    oneWeekData ? data?.untrackedVolumeUSD - oneWeekData?.untrackedVolumeUSD : data.untrackedVolumeUSD
  )

  // set volume properties
  data.oneDayVolumeUSD = parseFloat(oneDayVolumeUSD)
  data.oneWeekVolumeUSD = oneWeekVolumeUSD
  data.volumeChangeUSD = volumeChangeUSD
  data.oneDayVolumeUntracked = oneDayVolumeUntracked
  data.oneWeekVolumeUntracked = oneWeekVolumeUntracked
  data.volumeChangeUntracked = volumeChangeUntracked

  // set liquidity properties
  data.trackedReserveUSD = data.trackedReserveETH * ethPrice
  data.liquidityChangeUSD = getPercentChange(data.reserveUSD, oneDayData?.reserveUSD)

  // format if pair hasnt existed for a day or a week
  if (!oneDayData && data && data.createdAtBlockNumber > oneDayBlock) {
    data.oneDayVolumeUSD = parseFloat(data.volumeUSD)
  }
  if (!oneDayData && data) {
    data.oneDayVolumeUSD = parseFloat(data.volumeUSD)
  }
  if (!oneWeekData && data) {
    data.oneWeekVolumeUSD = parseFloat(data.volumeUSD)
  }

  if (TRACKED_OVERRIDES.includes(pairAddress)) {
    data.oneDayVolumeUSD = oneDayVolumeUntracked
    data.oneWeekVolumeUSD = oneWeekVolumeUntracked
    data.volumeChangeUSD = volumeChangeUntracked
    data.trackedReserveUSD = data.reserveUSD
  }

  // format incorrect names
  updateNameData(data)

  return data
}

function parseDataForFooter(data, oneDayData) {
  if (!data) {
    throw new Error('Pass the empty data current')
  }

  const oneDayToken1PriceChange = getPercentChange(data.token1Price, oneDayData.token1Price)

  data.oneDayToken1PriceChange = oneDayToken1PriceChange

  updateNameData(data)

  return data
}

const getPairTransactions = async (pairAddress) => {
  const transactions = {}

  try {
    let result = await swapClients[chainId].query({
      query: FILTERED_TRANSACTIONS,
      variables: {
        allPairs: [pairAddress],
      },
      fetchPolicy: 'no-cache',
    })
    transactions.mints = result.data.mints
    transactions.burns = result.data.burns
    transactions.swaps = result.data.swaps
  } catch (e) {
    console.log(e)
  }

  return transactions
}

const getPairChartData = async (pairAddress) => {
  let data = []
  const utcEndTime = dayjs.utc()
  let utcStartTime = utcEndTime.subtract(1, 'year').startOf('minute')
  let startTime = utcStartTime.unix() - 1

  try {
    let allFound = false
    let skip = 0
    while (!allFound) {
      let result = await swapClients[chainId].query({
        query: PAIR_CHART,
        variables: {
          pairAddress: pairAddress,
          skip,
        },
        fetchPolicy: 'network-only',
      })
      skip += 1000
      data = data.concat(result.data.pairDayDatas)
      if (result.data.pairDayDatas.length < 1000) {
        allFound = true
      }
    }

    let dayIndexSet = new Set()
    let dayIndexArray = []
    const oneDay = 24 * 60 * 60
    data.forEach((dayData, i) => {
      // add the day index to the set of days
      dayIndexSet.add((data[i].date / oneDay).toFixed(0))
      dayIndexArray.push(data[i])
      dayData.dailyVolumeUSD = parseFloat(dayData.dailyVolumeUSD)
      dayData.reserveUSD = parseFloat(dayData.reserveUSD)
    })

    if (data[0]) {
      // fill in empty days
      let timestamp = data[0].date ? data[0].date : startTime
      let latestLiquidityUSD = data[0].reserveUSD
      let index = 1
      while (timestamp < utcEndTime.unix() - oneDay) {
        const nextDay = timestamp + oneDay
        let currentDayIndex = (nextDay / oneDay).toFixed(0)
        if (!dayIndexSet.has(currentDayIndex)) {
          data.push({
            date: nextDay,
            dayString: nextDay,
            dailyVolumeUSD: 0,
            reserveUSD: latestLiquidityUSD,
          })
        } else {
          latestLiquidityUSD = dayIndexArray[index].reserveUSD
          index = index + 1
        }
        timestamp = nextDay
      }
    }

    data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1))
  } catch (e) {
    console.log(e)
  }

  return data
}

const getHourlyRateData = async (pairAddress, startTime, latestBlock) => {
  try {
    const utcEndTime = dayjs.utc()
    let time = startTime

    // create an array of hour start times until we reach current hour
    const timestamps = []
    while (time <= utcEndTime.unix() - 3600) {
      timestamps.push(time)
      time += 3600
    }

    // backout if invalid timestamp format
    if (timestamps.length === 0) {
      return []
    }

    // once you have all the timestamps, get the blocks for each timestamp in a bulk query
    let blocks

    blocks = await getBlocksFromTimestamps(timestamps, 100)

    // catch failing case
    if (!blocks || blocks?.length === 0) {
      return []
    }

    if (latestBlock) {
      blocks = blocks.filter((b) => {
        return parseFloat(b.number) <= parseFloat(latestBlock)
      })
    }

    const result = await splitQuery(HOURLY_PAIR_RATES, swapClients[chainId], [pairAddress], blocks, 100)

    // format token ETH price results
    let values = []
    for (var row in result) {
      let timestamp = row.split('t')[1]
      if (timestamp) {
        values.push({
          timestamp,
          rate0: parseFloat(result[row]?.token0Price),
          rate1: parseFloat(result[row]?.token1Price),
        })
      }
    }

    let formattedHistoryRate0 = []
    let formattedHistoryRate1 = []

    // for each hour, construct the open and close price
    for (let i = 0; i < values.length - 1; i++) {
      formattedHistoryRate0.push({
        timestamp: values[i].timestamp,
        open: parseFloat(values[i].rate0),
        close: parseFloat(values[i + 1].rate0),
      })
      formattedHistoryRate1.push({
        timestamp: values[i].timestamp,
        open: parseFloat(values[i].rate1),
        close: parseFloat(values[i + 1].rate1),
      })
    }

    return [formattedHistoryRate0, formattedHistoryRate1]
  } catch (e) {
    console.log(e)
    return [[], []]
  }
}

export function Updater() {
  const [, { updateTopPairs }] = usePairDataContext()
  const [ethPrice] = useEthPrice()
  useEffect(() => {
    async function getData() {
      // get top pairs by reserves
      let {
        data: { pairs },
      } = await swapClients[chainId].query({
        query: PAIRS_CURRENT,
        fetchPolicy: 'network-only',
      })

      // format as array of addresses
      const formattedPairs = pairs.map((pair) => {
        return pair.id
      })

      // get data for every pair in list
      let topPairs = await getBulkPairData(formattedPairs, ethPrice)
      topPairs && updateTopPairs(topPairs)
    }

    ethPrice && getData()
  }, [ethPrice, updateTopPairs])
  return null
}

export function useHourlyRateData(pairAddress, timeWindow) {
  const [state, { updateHourlyData }] = usePairDataContext()
  const chartData = state?.[pairAddress]?.hourlyData?.[timeWindow]
  const block = useBlockNumber()

  useEffect(() => {
    const currentTime = dayjs.utc()
    const windowSize = timeWindow === timeframeOptions.MONTH ? 'month' : 'week'
    const startTime =
      timeWindow === timeframeOptions.ALL_TIME ? 1589760000 : currentTime.subtract(1, windowSize).startOf('hour').unix()

    async function fetch() {
      let data = await getHourlyRateData(pairAddress, startTime, block)
      updateHourlyData(pairAddress, data, timeWindow)
    }

    if (!chartData) {
      fetch()
    }
  }, [chartData, timeWindow, pairAddress, updateHourlyData, block])

  return chartData
}

/**
 * @todo
 * store these updates to reduce future redundant calls
 */
export function useDataForList(pairList) {
  const [state] = usePairDataContext()
  const [ethPrice] = useEthPrice()

  const [stale, setStale] = useState(false)
  const [fetched, setFetched] = useState([])

  // reset
  useEffect(() => {
    if (pairList) {
      setStale(false)
      setFetched()
    }
  }, [pairList])

  useEffect(() => {
    async function fetchNewPairData() {
      let newFetched = []
      let unfetched = []

      pairList.map(async (pair) => {
        let currentData = state?.[pair.id]
        if (!currentData) {
          unfetched.push(pair.id)
        } else {
          newFetched.push(currentData)
        }
      })

      let newPairData = await getBulkPairData(
        unfetched.map((pair) => {
          return pair
        }),
        ethPrice
      )
      setFetched(newFetched.concat(newPairData))
    }

    if (ethPrice && pairList && pairList.length > 0 && !fetched && !stale) {
      setStale(true)
      fetchNewPairData()
    }
  }, [ethPrice, state, pairList, stale, fetched])

  let formattedFetch =
    fetched &&
    fetched.reduce((obj, cur) => {
      return { ...obj, [cur?.id]: cur }
    }, {})

  return formattedFetch
}

/**
 * Get all the current and 24hr changes for a pair
 */
export function usePairData(pairAddress) {
  const [state, { update }] = usePairDataContext()
  const [ethPrice] = useEthPrice()
  const pairData = state?.[pairAddress]

  useEffect(() => {
    async function fetchData() {
      if (!pairData && pairAddress) {
        let data = await getBulkPairData([pairAddress], ethPrice)
        data && update(pairAddress, data[0])
      }
    }

    if (!pairData && pairAddress && ethPrice && isAddress(pairAddress)) {
      fetchData()
    }
  }, [pairAddress, pairData, update, ethPrice])

  return pairData || {}
}

/**
 * Get most recent txns for a pair
 */
export function usePairTransactions(pairAddress) {
  const [state, { updatePairTxns }] = usePairDataContext()
  const pairTxns = state?.[pairAddress]?.txns
  useEffect(() => {
    async function checkForTxns() {
      if (!pairTxns) {
        let transactions = await getPairTransactions(pairAddress)
        updatePairTxns(pairAddress, transactions)
      }
    }

    checkForTxns()
  }, [pairTxns, pairAddress, updatePairTxns])
  return pairTxns
}

export function usePairChartData(pairAddress) {
  const [state, { updateChartData }] = usePairDataContext()
  const chartData = state?.[pairAddress]?.chartData

  useEffect(() => {
    async function checkForChartData() {
      if (!chartData) {
        let data = await getPairChartData(pairAddress)
        updateChartData(pairAddress, data)
      }
    }

    checkForChartData()
  }, [chartData, pairAddress, updateChartData])
  return chartData
}

/**
 * Get list of all pairs in Uniswap
 */
export function useAllPairData() {
  const [state] = usePairDataContext()
  return state || {}
}

/**
 * Use Subgraph to query data for footer.
 */
function useFooterData() {
  const blockNumber = useBlockNumber()
  const [subgraphData, setSubgraphData] = useState({})

  // region Callback functions.
  const getData = useCallback(async () => {
    const {
      data: { pairs },
    } = await swapClients[chainId].query({
      query: PAIRS_CURRENT,
      fetchPolicy: 'network-only',
    })

    // Format as array of addresses.
    const pairIds = pairs.map((pair) => pair.id)

    // Get data for every pair in list.
    const data = await getBulkPairDataForFooter(pairIds)
    if (data?.length > 0) {
      setSubgraphData(data)
    }

    // Log out to track query results.
    if (data?.length > 0) {
      console.log('Array tr??? v??? c?? ' + data.length + ' items.')
    } else {
      console.error('Array tr??? v??? l???i', data)
    }
  }, [])

  // Wait 5s for TheGraph mapping data.
  const getDataAfter5Seconds = useCallback(() => {
    setTimeout(() => {
      getData()
    }, 5000)
  }, [getData])
  // endregion

  // region Effects.
  // Query data the first time.
  useEffect(() => {
    getData()
  }, [getData])

  // When new block created, run the getDataAfter5Seconds callback function.
  useEffect(() => {
    getDataAfter5Seconds()
  }, [blockNumber, getDataAfter5Seconds])
  // endregion

  return subgraphData
}

/**
 * L???y ra gi?? token0 so v???i token1 ??? th???i ??i???m hi???n t???i = (s??? l?????ng token1) / (s??? l?????ng token0),
 * v?? so s??nh gi?? tr??? n??y v???i ch??nh n?? ??? th???i ??i???m 24h tr?????c.
 * Ta c?? 2 k???t qu???: "token1Price v?? token1PriceChange"
 *
 * PS: Ch??? n??y t???i sao ko ph???i l?? "token0Price v?? token0PriceChange"?? do data trong subgraph l?? nh?? th???, maybe
 * bug do token1 b??? swap v???i token0, source: uniswap-info).
 */
export function useOneDayPairPriceChange() {
  const data = useFooterData()

  return useMemo(
    () =>
      data &&
      Object.values(data).map((item) => {
        return {
          id: item.id,
          token0Symbol: item.token0.symbol,
          token1Symbol: item.token1.symbol,
          token1Price: item.token1Price,
          oneDayToken1PriceChange: item.oneDayToken1PriceChange,
        }
      }),
    [data]
  )
}
