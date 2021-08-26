import { getUnixTime, startOfHour, startOfMinute, startOfSecond, subHours } from 'date-fns'
import { useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'
import { blockClient } from '../apollo/client'
import { blocksQuery } from '../apollo/queries'

type BlocksResponse = {
  id: string
  number: string
  timestamp: string
}

export default function useAverageBlockTime(): number {
  // Course timestamps used to make better use of the cache (startOfHour + startOfMinuite + startOfSecond)
  const now = startOfSecond(startOfMinute(startOfHour(Date.now())))
  const start = getUnixTime(subHours(now, 6))
  const end = getUnixTime(now)

  const queryFn = useCallback(async () => {
    const data = await blockClient.query({
      query: blocksQuery,
      variables: {
        start,
        end
      }
    })
    return data.data.blocks
  }, [start, end])

  const { data: blocks, isSuccess }: { data: BlocksResponse[] | undefined; isSuccess: boolean } = useQuery(
    ['useAverageBlockTime', start, end],
    queryFn,
    {
      enabled: Boolean(start && end)
    }
  )

  // If request failed then make average block time is 15 seconds by default
  return useMemo(
    () =>
      isSuccess && Array.isArray(blocks) && blocks.length
        ? blocks.reduce(
        (previousValue: any, currentValue: any, currentIndex: number) => {
          if (previousValue.timestamp) {
            const difference = previousValue.timestamp - currentValue.timestamp
            previousValue.difference = previousValue.difference + difference
          }
          previousValue.timestamp = currentValue.timestamp
          if (currentIndex === blocks.length - 1) {
            return previousValue.difference / blocks.length
          }
          return previousValue
        },
        { timestamp: null, difference: 0 }
        )
        : 15,
    [blocks, isSuccess]
  )
}
