import { useMemo } from 'react'
import _ from 'lodash'
import { calculateAPY, Farm } from '@s-one-finance/sdk-core'
import { useQuery } from 'react-query'

import { liquidityPositionSubsetQuery, pairSubsetQuery, poolsQuery } from '../apollo/queries'
import { stakingClients, swapClients } from '../apollo/client'
import useBlockNumber from './useBlockNumber'
import useAverageBlockTime from './useAverageBlockTime'
import useOneSoneInUSD from './useOneSoneInUSD'
import { chainId, CONFIG_MASTER_FARMER, SONE_MASTER_FARMER, SONE_PRICE_MINIMUM } from '../constants'
import { useLastTruthy } from './useLast'

export default function useFarms(): [boolean, Farm[]] {
  const sonePrice = useOneSoneInUSD()
  const block = useBlockNumber()
  const averageBlockTime = useAverageBlockTime()

  const { data: poolsQueryResult, isSuccess: isQueryPoolsSuccess } = useQuery(
    ['useFarms_poolsQuery', block],
    async () => {
      const data = await stakingClients[chainId].query({
        query: poolsQuery,
        fetchPolicy: 'network-only',
      })
      return data?.data.pools
    }
  )

  const pools = useLastTruthy(poolsQueryResult) ?? undefined

  const { data: liquidityPositionsQueryResult, isSuccess: isQueryLqSuccess } = useQuery(
    ['useFarms_liquidityPositionSubsetQuery', SONE_MASTER_FARMER[chainId], block],
    async () => {
      const data = await swapClients[chainId].query({
        query: liquidityPositionSubsetQuery,
        variables: { user: SONE_MASTER_FARMER[chainId].toLowerCase() },
        fetchPolicy: 'network-only',
      })
      return data?.data.liquidityPositions
    }
  )

  const liquidityPositions = useLastTruthy(liquidityPositionsQueryResult) ?? undefined

  const pairAddresses = useMemo(
    () =>
      Array.isArray(pools) && pools.length > 0
        ? pools
            .map((pool: any) => {
              return pool.pair
            })
            .sort()
        : [],
    [pools]
  )

  const { data: pairsQueryResult, isSuccess: isQueryPairsSuccess } = useQuery(
    ['useFarms_pairSubsetQuery', pairAddresses, block],
    async () => {
      const data = await swapClients[chainId].query({
        query: pairSubsetQuery,
        variables: { pairAddresses },
        fetchPolicy: 'network-only',
      })
      return data?.data.pairs
    },
    { enabled: Boolean(pairAddresses) }
  )

  const pairs = useLastTruthy(pairsQueryResult) ?? undefined

  // The query used to succeed

  const isQueryAllUsedToSucceed = useLastTruthy(isQueryPoolsSuccess && isQueryLqSuccess && isQueryPairsSuccess)

  return useMemo(() => {
    const farms: Farm[] = (pools ?? [])
      .map((pool: any) => {
        const pair = (pairs ?? []).find((pair: any) => pair.id === pool.pair)
        if (pair === undefined) {
          return false
        }
        const liquidityPosition = (liquidityPositions ?? []).find(
          (liquidityPosition: any) => liquidityPosition.pair?.id === pair?.id
        )
        const blocksPerHour = 3600 / Number(averageBlockTime)
        const balance = Number(pool.balance / 1e18)
        const totalSupply = pair.totalSupply > 0 ? pair.totalSupply : 0.1
        const reserveUSD = pair.reserveUSD > 0 ? pair.reserveUSD : 0.1
        const balanceUSD = (balance / Number(totalSupply)) * Number(reserveUSD)
        const rewardPerBlock = ((pool.allocPoint / pool.owner.totalAllocPoint) * pool.owner.sonePerBlock) / 1e18
        const investedValue = 1000
        const LPTokenPrice = pair.reserveUSD / pair.totalSupply || SONE_PRICE_MINIMUM
        const LPTokenValue = investedValue / LPTokenPrice
        const poolShare = LPTokenValue / (LPTokenValue + Number(balance))
        const roiPerBlock = (rewardPerBlock * sonePrice * poolShare) / investedValue
        const multiplierYear = calculateAPY(averageBlockTime, block || 0, CONFIG_MASTER_FARMER[chainId])
        const roiPerYear = multiplierYear * roiPerBlock
        const rewardPerDay = rewardPerBlock * blocksPerHour * 24
        const soneHarvested = pool.soneHarvested > 0 ? pool.soneHarvested : 0
        const multiplier = (pool.owner.bonusMultiplier * pool.allocPoint) / 100
        return {
          ...pool,
          contract: 'masterchefv1',
          type: 'SLP',
          symbol: pair.token0.symbol + '-' + pair.token1.symbol,
          name: pair.token0.name + ' ' + pair.token1.name,
          pid: Number(pool.id),
          pairAddress: pair.id,
          slpBalance: pool.balance,
          soneRewardPerDay: rewardPerDay,
          liquidityPair: pair,
          rewardPerBlock,
          roiPerBlock,
          roiPerYear,
          soneHarvested,
          multiplier,
          balance,
          balanceUSD,
          tvl: liquidityPosition?.liquidityTokenBalance
            ? (pair.reserveUSD / pair.totalSupply) * liquidityPosition.liquidityTokenBalance
            : 0.1,
          sonePrice,
          LPTokenPrice,
          secondsPerBlock: Number(averageBlockTime),
        }
      })
      .filter((item: Farm | false) => {
        return item !== false
      })
    const sorted = _.orderBy(farms, ['pid'], ['desc'])
    const unique = _.uniq(sorted)
    return [isQueryAllUsedToSucceed, unique]
  }, [averageBlockTime, block, isQueryAllUsedToSucceed, liquidityPositions, pairs, pools, sonePrice])
}
