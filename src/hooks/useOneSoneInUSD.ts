import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { CHAIN_ID, SONE_ADDRESS, SONE_PRICE_MINIMUM } from '../constants'
import { tokenQuery } from '../apollo/queries'
import { reduceFractionDigit } from '../utils/number'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/s-one-system/sone-swap-ropsten',
  }),
  cache: new InMemoryCache()
})

/**
 * 1 SONE === `useSoneInUSD()` USDT.
 */
export default function useOneSoneInUSD(): number {
  const { data: sonePrice } = useQuery<number>(
    'useOneSoneInUSD',
    async () => {
      const data = await client.query({
        query: tokenQuery(SONE_ADDRESS[CHAIN_ID].toLowerCase())
      })

      const ethPrice = +data.data.bundle.ethPrice
      const derivedETH = +data.data.token.derivedETH

      if (isNaN(ethPrice) || isNaN(derivedETH)) {
        throw new Error('Error when fetch data in useOneSoneInUSD')
      }

      return ethPrice * derivedETH
    }
  )

  return useMemo(() => sonePrice ?? SONE_PRICE_MINIMUM, [sonePrice])
}

export function useSoneInUSD(numberOfSone?: number): number | undefined {
  const oneSoneInUSD = useOneSoneInUSD()

  return useMemo(() => (numberOfSone === undefined || isNaN(numberOfSone) ? undefined : numberOfSone * oneSoneInUSD), [
    numberOfSone,
    oneSoneInUSD
  ])
}

export function useFormattedSoneInUSD(numberOfSone?: number): string {
  const soneInUSD = useSoneInUSD(numberOfSone)

  return useMemo(() => soneInUSD === undefined ? '--' : reduceFractionDigit(soneInUSD.toString(), 6), [soneInUSD])
}
