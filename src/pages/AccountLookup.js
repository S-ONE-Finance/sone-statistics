import React, { useEffect } from 'react'
import 'feather-icons'
import { withRouter } from 'react-router-dom'
import { TYPE } from '../theme'
import { FullWrapper, PageWrapper } from '../components'
import Panel from '../components/Panel'
import LPList from '../components/LPList'
import styled from 'styled-components'
import AccountSearch from '../components/AccountSearch'
import { useTopLps } from '../contexts/GlobalData'

const AccountWrapper = styled.div`
  @media screen and (max-width: 600px) {
    width: 100%;
  }
`

function AccountLookup() {
  // scroll to top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const topLps = useTopLps()

  return (
    <PageWrapper>
      <FullWrapper style={{ zIndex: 1 }}>
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
          <LPList lps={topLps} maxItems={5} />
        </Panel>
      </FullWrapper>
    </PageWrapper>
  )
}

export default withRouter(AccountLookup)
