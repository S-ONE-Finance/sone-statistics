import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { liquidityOfAllPair } from '../apollo/queries'
import { client } from '../apollo/client'

export default function useTotalLiquidity(): number {
  const { data: totalLiquidity } = useQuery<number>(
    'useTotalLiquidity',
    async () => {
      const data = await client.query({
        query: liquidityOfAllPair
      })

      if (!Array.isArray(data?.data?.pairs)) throw new Error("Error in useTotalLiquidity.")

      return data.data.pairs.reduce((sum, item) => sum + (+item.reserveUSD || 0), 0)
    }
  )

  return useMemo(() => totalLiquidity || 0, [totalLiquidity])
}