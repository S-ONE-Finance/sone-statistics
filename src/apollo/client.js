import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ChainId } from '@s-one-finance/sdk-core'

export const swapClients = {
  [ChainId.MAINNET]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://graph-node.s-one.finance/subgraphs/name/s-one-finance/soneswap',
    }),
    cache: new InMemoryCache(),
  }),
  [ChainId.RINKEBY]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://graph-node-2.s-one.finance/subgraphs/name/s-one-finance/soneswap',
    }),
    cache: new InMemoryCache(),
  }),
  [ChainId.ROPSTEN]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/s-one-system/sone-swap-ropsten',
    }),
    cache: new InMemoryCache(),
  }),
}

export const stakingClients = {
  [ChainId.MAINNET]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://graph-node.s-one.finance/subgraphs/name/s-one-finance/master-farmer',
    }),
    cache: new InMemoryCache(),
  }),
  [ChainId.RINKEBY]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://graph-node-2.s-one.finance/subgraphs/name/s-one-finance/master-farmer',
    }),
    cache: new InMemoryCache(),
  }),
  [ChainId.ROPSTEN]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/thanhnv25/farmer07091',
    }),
    cache: new InMemoryCache(),
  }),
}

export const blockClients = {
  [ChainId.MAINNET]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
    }),
    cache: new InMemoryCache(),
  }),
  [ChainId.RINKEBY]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/rinkeby-blocks',
    }),
    cache: new InMemoryCache(),
  }),
  [ChainId.ROPSTEN]: new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ropsten-blocks',
    }),
    cache: new InMemoryCache(),
  }),
}
