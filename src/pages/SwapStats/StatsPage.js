import React from 'react'
import { Box } from '@material-ui/core'
import styled from 'styled-components'
import { PageWrapper, ContentWrapper } from '../../components'
import OverviewStatistics from './OverviewStatistics'
import TokensStatistics from './TokensStatistics'
import './styles.css'
import { useIndexTabManager } from '../../contexts/LocalStorage'
import PairsStatistics from './PairsStatistics'
import AccountStatics from './AccountStatics'
import TransactionStatics from './TransactionStatics'

const MainWrapper = styled.div`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
   padding-bottom: 10%
  `}
`

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {<Box>{children}</Box>}
    </div>
  )
}

function StatsPage({ ...props }) {
  const [indexTab] = useIndexTabManager()

  return (
    <MainWrapper>
      <PageWrapper>
        <ContentWrapper style={{ zIndex: 1 }}>
          {/* tab switch */}
          <TabPanel value={indexTab} index={0}>
            <OverviewStatistics />
          </TabPanel>
          <div>
            <TabPanel value={indexTab} index={1}>
              <TokensStatistics />
            </TabPanel>
            <TabPanel value={indexTab} index={2}>
              <PairsStatistics />
            </TabPanel>
            <TabPanel value={indexTab} index={3}>
              <AccountStatics />
            </TabPanel>
            <TabPanel value={indexTab} index={4}>
              <TransactionStatics />
            </TabPanel>
          </div>
        </ContentWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}

export default StatsPage
