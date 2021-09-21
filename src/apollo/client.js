import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { BLOCK_CLIENT_URL, STAKING_CLIENT_URL, SWAP_CLIENT_URL } from '../constants/urls'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: SWAP_CLIENT_URL,
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

export const stakingClient = new ApolloClient({
  link: new HttpLink({
    uri: STAKING_CLIENT_URL,
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

export const blockClient = new ApolloClient({
  link: new HttpLink({
    uri: BLOCK_CLIENT_URL,
  }),
  cache: new InMemoryCache(),
})
