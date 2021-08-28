import { useMemo } from 'react'
import _ from 'lodash'
import { calculateAPY, Farm } from '@s-one-finance/sdk-core'
import { useQuery } from 'react-query'

import { liquidityPositionSubsetQuery, pairSubsetQuery, poolsQuery } from '../apollo/queries'
import { stakingClient } from '../apollo/client'
import useBlockNumber from './useBlockNumber'
import useAverageBlockTime from './useAverageBlockTime'
import useOneSoneInUSD from './useOneSoneInUSD'
import { CHAIN_ID, CONFIG_MASTER_FARMER, SONE_MASTER_FARMER, SONE_PRICE_MINIMUM } from '../constants'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/s-one-system/sone-swap-ropsten',
  }),
  cache: new InMemoryCache()
})

export default function useFarms(): Farm[] {
  const sonePrice = useOneSoneInUSD()
  const block = useBlockNumber()
  const averageBlockTime = useAverageBlockTime()

  const { data: pools } = useQuery(
    'useFarms_poolsQuery',
    async () => {
      const data = await stakingClient.query({
        query: poolsQuery
      })
      return data?.data.pools
    }
  )
  const { data: liquidityPositions } = useQuery(
    ['useFarms_liquidityPositionSubsetQuery', SONE_MASTER_FARMER[CHAIN_ID]],
    async () => {
      const data = await client.query({
        query: liquidityPositionSubsetQuery,
        variables: { user: SONE_MASTER_FARMER[CHAIN_ID].toLowerCase() }
      })
      return data?.data.liquidityPositions
    }
  )

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

  const { data: pairs } = useQuery(
    ['useFarms_pairSubsetQuery', pairAddresses],
    async () => {
      const data = await client.query({
        query: pairSubsetQuery,
        variables: { pairAddresses }
      })
      return data?.data.pairs
    },
    { enabled: Boolean(pairAddresses) }
  )

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
        const multiplierYear = calculateAPY(
          averageBlockTime,
          block || 0,
          CONFIG_MASTER_FARMER[CHAIN_ID]
        )
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
          secondsPerBlock: Number(averageBlockTime)
        }
      })
      .filter((item: Farm | false) => {
        return item !== false
      })
    const sorted = _.orderBy(farms, ['pid'], ['desc'])
    const unique = _.uniq(sorted)
    return unique
  }, [averageBlockTime, block, liquidityPositions, pairs, pools, sonePrice])
}
