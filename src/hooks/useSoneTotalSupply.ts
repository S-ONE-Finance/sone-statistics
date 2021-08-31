import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { CHAIN_ID, SONE_ADDRESS } from '../constants'
import { tokenQuery } from '../apollo/queries'
import { client } from '../apollo/client'

export default function useSoneTotalSupply(): number {
  const { data: totalSupply } = useQuery<number>(
    'useSoneTotalSupply',
    async () => {
      const data = await client.query({
        query: tokenQuery(SONE_ADDRESS[CHAIN_ID].toLowerCase())
      })

      const totalSupply = +data.data.token.totalSupply

      if (isNaN(totalSupply)) {
        throw new Error('Error when fetch data in useSoneTotalSupply')
      }

      return totalSupply
    }
  )

  return useMemo(() => totalSupply ?? 0, [totalSupply])
}