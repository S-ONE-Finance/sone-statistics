import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { chainId, SONE, SONE_PRICE_MINIMUM } from '../constants'
import { tokenQuery } from '../apollo/queries'
import { reduceFractionDigit } from '../utils/number'
import { swapClients } from '../apollo/client'
import useBlockNumber from './useBlockNumber'
import { useLastTruthy } from './useLast'

/**
 * 1 SONE === `useSoneInUSD()` USDT.
 */
export default function useOneSoneInUSD(): number {
  const block = useBlockNumber()

  const { data: sonePriceQueryResult } = useQuery<number>(['useOneSoneInUSD', block], async () => {
    const data = await swapClients[chainId].query({
      query: tokenQuery(SONE[chainId].toLowerCase()),
      fetchPolicy: 'network-only',
    })

    const ethPrice = +data.data.bundle.ethPrice
    const derivedETH = +data.data.token.derivedETH

    if (isNaN(ethPrice) || isNaN(derivedETH)) {
      throw new Error('Error when fetch data in useOneSoneInUSD')
    }

    return ethPrice * derivedETH
  })

  const sonePrice = useLastTruthy(sonePriceQueryResult) ?? undefined

  return useMemo(() => sonePrice ?? SONE_PRICE_MINIMUM, [sonePrice])
}

export function useSoneInUSD(numberOfSone?: number): number | undefined {
  const oneSoneInUSD = useOneSoneInUSD()

  return useMemo(
    () => (numberOfSone === undefined || isNaN(numberOfSone) ? undefined : numberOfSone * oneSoneInUSD),
    [numberOfSone, oneSoneInUSD]
  )
}

export function useFormattedSoneInUSD(numberOfSone?: number): string {
  const soneInUSD = useSoneInUSD(numberOfSone)

  return useMemo(() => (soneInUSD === undefined ? '--' : reduceFractionDigit(soneInUSD.toString(), 6)), [soneInUSD])
}
