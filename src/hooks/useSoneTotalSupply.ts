import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { chainId, SONE } from '../constants'
import { tokenQuery } from '../apollo/queries'
import { swapClients } from '../apollo/client'
import useBlockNumber from './useBlockNumber'
import { useLastTruthy } from './useLast'

export default function useSoneTotalSupply(): number {
  const block = useBlockNumber()

  const { data: totalSupplyQueryResult } = useQuery<number>(['useSoneTotalSupply', block], async () => {
    const data = await swapClients[chainId].query({
      query: tokenQuery(SONE[chainId].toLowerCase()),
      fetchPolicy: 'network-only',
    })

    const totalSupply = +data.data.token.totalSupply

    if (isNaN(totalSupply)) {
      throw new Error('Error when fetch data in useSoneTotalSupply')
    }

    return totalSupply
  })

  const totalSupply = useLastTruthy(totalSupplyQueryResult) ?? undefined

  return useMemo(() => totalSupply ?? 0, [totalSupply])
}
