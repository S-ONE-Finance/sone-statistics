## 1. Create `.env`


```sh
# Example
REACT_APP_GOOGLE_ANALYTICS_ID="UA-128182339-5"
```

## 2. Config at `src/constants/index.js`

- FACTORY_ADDRESS - line 1

```js
//  Example
export const FACTORY_ADDRESS = '0xB6EF230f01008e04b83E61807ed710F5BABc8Ddd'
```

## 3. Config graphql client at `src/apollo/client.js`

- client - line 5
- blockClients - line 39

```js
//  Example
export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/s-one-system/sone-swap-ropsten',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})
// .
// .
export const v1Client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/s-one-system/sone-swap-ropsten',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})
// .
// .
export const blockClients = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ropsten-blocks',
  }),
  cache: new InMemoryCache(),
})

```

## 4. Config graphRoute at `src/services/index.js`

- baseURL - line 12

```js
//  Example
const graphRoute = axios.create({
  baseURL: 'https://api.thegraph.com/subgraphs/name/s-one-system/sone-swap-ropsten',
})
```