import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { chainId, SONE } from '../constants'
import { tokenQuery } from '../apollo/queries'
import { swapClients } from '../apollo/client'

export default function useSoneTotalSupply(): number {
  const { data: totalSupply } = useQuery<number>('useSoneTotalSupply', async () => {
    const data = await swapClients[chainId].query({
      query: tokenQuery(SONE[chainId].toLowerCase()),
    })

    const totalSupply = +data.data.token.totalSupply

    if (isNaN(totalSupply)) {
      throw new Error('Error when fetch data in useSoneTotalSupply')
    }

    return totalSupply
  })

  return useMemo(() => totalSupply ?? 0, [totalSupply])
}
