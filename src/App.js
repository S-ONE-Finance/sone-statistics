import React from 'react'
import styled from 'styled-components'
import { ApolloProvider } from 'react-apollo'
import { client } from './apollo/client'
import { Route, Switch, HashRouter, Redirect } from 'react-router-dom'
import TokenPage from './pages/TokenPage'
import PairPage from './pages/PairPage'
import { useGlobalData, useGlobalChartData } from './contexts/GlobalData'
import { isAddress } from './utils'
import AccountPage from './pages/AccountPage'
import AllTokensPage from './pages/AllTokensPage'
import AllPairsPage from './pages/AllPairsPage'
import AccountLookup from './pages/AccountLookup'
import LocalLoader from './components/LocalLoader'
import { useLatestBlocks } from './contexts/Application'
import GoogleAnalyticsReporter from './components/analytics/GoogleAnalyticsReporter'
import { PAIR_BLACKLIST, TOKEN_BLACKLIST } from './constants'
import Footer from './components/Footer'
import Header from './components/Header'
import StakingStats from './pages/StakingStats'
import Polling from './components/Polling'
import OverStats from './pages/SwapStats/StatsPage'
import { useDarkModeManager } from './contexts/LocalStorage'

const AppWrapper = styled.div`
  position: relative;
  width: 100%;
`

const HeaderWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: space-between;
  overflow: hidden;
  box-sizing: border-box;
`

const FooterWrapper = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 45px;
  background: ${({ theme }) => theme.bg4Sone};
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    bottom: 72px;
    border-radius: 12px 12px 0 0;
    padding: 0 1rem;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: fixed;
    height: 31px;
  `};
`

const Body = styled.div`
  height: 100%;
  z-index: 9999;
  transition: width 0.25s ease;
  background-color: ${({ theme }) => theme.onlyLight};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-bottom: 10%;
    padding-top: 2%;
  `};
`

const WarningWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const WarningBanner = styled.div`
  background-color: #ff6871;
  padding: 1.5rem;
  color: white;
  width: 100%;
  text-align: center;
  font-weight: 500;
`

/**
 * Wrap the component with the header and sidebar pinned tab
 */
const LayoutWrapper = ({ children }) => {
  const [isDarkMode] = useDarkModeManager()

  return (
    <>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <Body id="center" className={isDarkMode ? 'dark-mode ' : 'light-mode'}>
        {children}
      </Body>
      <Polling />
      <FooterWrapper style={{ zIndex: 9999 }}>
        <Footer />
      </FooterWrapper>
    </>
  )
}

const BLOCK_DIFFERENCE_THRESHOLD = 30

function App() {
  const globalData = useGlobalData()
  const globalChartData = useGlobalChartData()
  const [latestBlock, headBlock] = useLatestBlocks()
  // show warning
  const showWarning = headBlock && latestBlock ? headBlock - latestBlock > BLOCK_DIFFERENCE_THRESHOLD : false
  return (
    <ApolloProvider client={client}>
      <AppWrapper>
        {showWarning && (
          <WarningWrapper>
            <WarningBanner>
              {`Warning: The data on this site has only synced to Ethereum block ${latestBlock} (out of ${headBlock}). Please check back soon.`}
            </WarningBanner>
          </WarningWrapper>
        )}
        {globalData &&
        Object.keys(globalData).length > 0 &&
        globalChartData &&
        Object.keys(globalChartData).length > 0 ? (
          <HashRouter>
            <Route component={GoogleAnalyticsReporter} />
            <Switch>
              <Route
                exact
                strict
                path="/swap/token/:tokenAddress"
                render={({ match }) => {
                  if (
                    isAddress(match.params.tokenAddress.toLowerCase()) &&
                    !Object.keys(TOKEN_BLACKLIST).includes(match.params.tokenAddress.toLowerCase())
                  ) {
                    return (
                      <LayoutWrapper>
                        <TokenPage address={match.params.tokenAddress.toLowerCase()} />
                      </LayoutWrapper>
                    )
                  } else {
                    return <Redirect to="/home" />
                  }
                }}
              />
              <Route
                exact
                strict
                path="/swap/pair/:pairAddress"
                render={({ match }) => {
                  if (
                    isAddress(match.params.pairAddress.toLowerCase()) &&
                    !Object.keys(PAIR_BLACKLIST).includes(match.params.pairAddress.toLowerCase())
                  ) {
                    return (
                      <LayoutWrapper>
                        <PairPage pairAddress={match.params.pairAddress.toLowerCase()} />
                      </LayoutWrapper>
                    )
                  } else {
                    return <Redirect to="/home" />
                  }
                }}
              />
              <Route
                exact
                strict
                path="/swap/account/:accountAddress"
                render={({ match }) => {
                  if (isAddress(match.params.accountAddress.toLowerCase())) {
                    return (
                      <LayoutWrapper>
                        <AccountPage account={match.params.accountAddress.toLowerCase()} />
                      </LayoutWrapper>
                    )
                  } else {
                    return <Redirect to="/home" />
                  }
                }}
              />

              <Route exact strict path="/swap/tokens">
                <LayoutWrapper>
                  <AllTokensPage />
                </LayoutWrapper>
              </Route>

              <Route exact strict path="/swap/pairs">
                <LayoutWrapper>
                  <AllPairsPage />
                </LayoutWrapper>
              </Route>

              <Route exact strict path="/swap/accounts">
                <LayoutWrapper>
                  <AccountLookup />
                </LayoutWrapper>
              </Route>

              <Route exact strict path="/staking">
                <LayoutWrapper>
                  <StakingStats />
                </LayoutWrapper>
              </Route>
              <Route exact strict path="/swap">
                <LayoutWrapper>
                  <OverStats />
                </LayoutWrapper>
              </Route>
              <Redirect to="/swap" />
            </Switch>
          </HashRouter>
        ) : (
          <LocalLoader fill="true" />
        )}
      </AppWrapper>
    </ApolloProvider>
  )
}

export default App
