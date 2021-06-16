import React, { useEffect } from 'react'
import 'feather-icons'
import { withRouter } from 'react-router-dom'
import { TYPE } from '../theme'
import { PageWrapper, FullWrapper } from '../components'
import Panel from '../components/Panel'
import LPList from '../components/LPList'
import styled from 'styled-components'
import AccountSearch from '../components/AccountSearch'
import { useTopLps } from '../contexts/GlobalData'
import LocalLoader from '../components/LocalLoader'
import { RowBetween } from '../components/Row'
import { useMedia } from 'react-use'
import Search from '../components/Search'

const AccountWrapper = styled.div`
  @media screen and (max-width: 600px) {
    width: 100%;
  }
`

const StylePanel = styled(Panel)`
  margin-top: 1.5rem;
  padding: 0;
  border: 0;
  background-color: transparent;
  box-shadow: none;
`

function AccountLookup() {
  // scroll to top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const topLps = useTopLps()

  const below600 = useMedia('(max-width: 600px)')

  return (
    <PageWrapper>
      <FullWrapper style={{ zIndex: 1 }}>
        <RowBetween>
          <TYPE.largeHeader style={{ fontSize: '2.125rem' }}>Wallet analytics</TYPE.largeHeader>
          {!below600 && <Search small={true} />}
        </RowBetween>
        <AccountWrapper>
          <AccountSearch />
        </AccountWrapper>
        <TYPE.main fontSize={'2.125rem'} style={{ marginTop: '2rem' }}>
          Top Liquidity Positions
        </TYPE.main>
        <Panel
          style={{
            marginTop: '1.5rem',
            padding: 0,
            border: 0,
            backgroundColor: 'transparent',
            boxShadow: 'none',
          }}
        >
          {' '}
          <LPList lps={topLps} maxItems={100} />
        </Panel>
      </FullWrapper>
    </PageWrapper>
  )
}

export default withRouter(AccountLookup)
