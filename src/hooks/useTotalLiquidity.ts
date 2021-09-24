import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { liquidityOfAllPair } from '../apollo/queries'
import { swapClients } from '../apollo/client'
import { chainId } from '../constants'
import useBlockNumber from './useBlockNumber'
import { useLastTruthy } from './useLast'

export default function useTotalLiquidity(): number {
  const block = useBlockNumber()

  const { data: totalLiquidityQueryResult } = useQuery<number>(['useTotalLiquidity', block], async () => {
    const data = await swapClients[chainId].query({
      query: liquidityOfAllPair,
      fetchPolicy: 'network-only',
    })

    if (!Array.isArray(data?.data?.pairs)) throw new Error('Error in useTotalLiquidity.')

    return data.data.pairs.reduce((sum, item) => sum + (+item.reserveUSD || 0), 0)
  })

  const totalLiquidity = useLastTruthy(totalLiquidityQueryResult) ?? undefined

  return useMemo(() => totalLiquidity || 0, [totalLiquidity])
}
