import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { BLOCK_CLIENT_URL, CLIENT_URL, HEALTH_CLIENT_URL, STAKING_CLIENT_URL } from '../constants/urls'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: CLIENT_URL,
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

export const healthClient = new ApolloClient({
  link: new HttpLink({
    uri: HEALTH_CLIENT_URL,
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

export const v1Client = new ApolloClient({
  link: new HttpLink({
    uri: CLIENT_URL,
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
