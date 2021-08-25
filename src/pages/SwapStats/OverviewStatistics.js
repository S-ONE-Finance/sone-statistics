import React, { useContext, useEffect, useState } from 'react'
import { Grid, makeStyles, Box, Typography } from '@material-ui/core'
import CardItem from '../../components/CardItem'
import styled, { ThemeContext } from 'styled-components'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { reduceFractionDigit } from '../../utils/number'
import useDashboardData from '../../hooks/useDashboardData'
import Panel from '../../components/Panel'
import GlobalChart from '../../components/GlobalChart'
import { AutoRow, RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import { CustomLink } from '../../components/Link'
import TopTokenList from '../../components/TokenList'
import { useAllTokenData, useTokenTransactions } from '../../contexts/TokenData'
import { useMedia } from 'react-use'
import { AutoColumn } from '../../components/Column'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import { useAllPairData } from '../../contexts/PairData'
import PairList from '../../components/PairList'
import LPList from '../../components/LPList'
import TxnList from '../../components/TxnList'
import { useGlobalData, useGlobalTransactions, useTopLps } from '../../contexts/GlobalData'
import { useTranslation } from 'react-i18next'
// import { useTokenData, , useTokenPairs } from '../contexts/TokenData'
import { useMediaQuery } from 'react-responsive'

OverviewStatistics.propTypes = {}

const useStyles = makeStyles((theme) => ({
  cardPreview: {
    marginRight: 30,
    width: 128,
    height: 116,
    borderRadius: 25,
    overflow: 'hidden',
  },
  cardValue: {
    marginRight: 10,
    fontWeight: 700,
  },
  cardPercent: {
    fontSize: 16,
  },
  positive: {
    color: '#7AC51B',
  },
  negative: {
    color: '#F05359',
  },
  primaryBg: {
    backgroundColor: theme.palette.primary.main,
  },
  boxCardItems: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  boxItem: {
    flexBasis: 'calc(100% / 4 - 20px)',
    '@media (max-width: 800px)': {
      flexBasis: 'calc(100%)',
    },
  },
  boxMainContentOverview: {
    marginTop: 0,
    '@media (max-width: 800px)': {
      marginTop: 15,
    },
  },
}))

const StyledGrid = styled(Grid)`
  max-width: 100%;
  margin: 0 auto !important;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 100%;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    max-width: 100%;
    width: 100%;
  `}
`

const GridRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  column-gap: 19px;
  align-items: start;
  justify-content: space-between;
`

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;

  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`
const TitleOverView = styled.div`
    font-weight: 'bold',
    font-size: 40px,
  `

function OverviewStatistics(props) {
  const classes = useStyles()
  const theme = useContext(ThemeContext)
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const { commonData } = useDashboardData()
  const allTokens = useAllTokenData()
  const [isDarkMode] = useDarkModeManager()
  const allPairs = useAllPairData()
  const { t, i18n } = useTranslation()
  const [totalTransaction, setTotalTranSaction] = useState(0)
  const [totalFee24h, setTotalFee24h] = useState(0)
  // all transactions with this token
  // const transactions = useTokenTransactions()

  //accounts
  const topLps = useTopLps()
  //Transactions
  const transactions = useGlobalTransactions()
  // breakpoints
  const below800 = useMedia('min-width: 800px')
  // const below600 = useMediaQuery('max-width: 600px')
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })

  useEffect(() => {
    if (!transactions) {
      return
    }
    totalTransactionAPI()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions])

  useEffect(() => {
    if (!allPairs) {
      return
    }
    totalFee24hAPI()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPairs])

  const PanelHight = styled(Panel)`
    height: 100%;
    min-height: 300px;
    z-index: 0;
    background-color: ${isDarkMode ? '#0E2B4A' : '#fff'};
    border: 0;
    box-shadow: 0px 8px 17px rgba(0, 0, 0, 0.18);
  `

  const PanelLow = styled(Panel)`
    height: 100%;
    z-index: 0;
    background-color: ${isDarkMode ? '#0E2B4A' : '#fff'};
    border: 0;
    box-shadow: 0px 8px 17px rgba(0, 0, 0, 0.18);
  `
  const totalTransactionAPI = () => {
    const total = transactions?.mints.length + transactions?.burns.length + transactions?.swaps.length
    setTotalTranSaction(total)
  }

  const totalFee24hAPI = () => {
    var totalFees = 0
    var totalOneDayVolumeUSD = 0
    var totalOneDayVolumeUntracked = 0
    Object.values(allPairs).map((item) => {
      if (item.oneDayVolumeUSD) {
        totalOneDayVolumeUSD += item.oneDayVolumeUSD
      } else {
        return
      }
    })
    totalFees = totalOneDayVolumeUSD + totalOneDayVolumeUntracked
    setTotalFee24h(totalFees)
  }

  return (
    <div className={classes.boxMainContentOverview}>
      <div style={isMobile ? { display: 'none' } : { display: 'block' }}>
        <p
          style={{ fontSize: 40, margin: '10px 0', color: isDarkMode ? '#fff' : '#333333' }}
          className="font-weight-bold"
        >
          {t('Overview')}
        </p>
      </div>
      <StyledGrid className={classes.boxCardItems} container spacing={0}>
        <Grid item md={6} lg={3} className={classes.boxItem}>
          <CardItem
            title={t('ETH Price')}
            colorTextRatioValue="#F05359"
            valueContainer={
              <Box display="flex" alignItems="center">
                <Typography
                  className={classes.cardValue}
                  style={{ color: theme.text6Sone, fontSize: isUpToExtraSmall ? 20 : 28 }}
                >
                  {reduceFractionDigit(commonData?.totalLiquidity)}
                </Typography>
              </Box>
            }
            ratioValue={<p style={{ marginRight: 5, fontSize: isUpToExtraSmall ? 13 : 16 }}>{`-0.03%`}</p>}
          />
        </Grid>
        <Grid item md={6} lg={3} className={classes.boxItem}>
          <CardItem
            title={t('No. Transactions (24h)')}
            colorTextRatioValue="#7AC51B"
            valueContainer={
              <Box display="flex" alignItems="center">
                <Typography
                  className={classes.cardValue}
                  style={{ color: theme.text6Sone, fontSize: isUpToExtraSmall ? 20 : 28 }}
                >
                  {totalTransaction}
                </Typography>
              </Box>
            }
            ratioValue={<p style={{ marginRight: 5, fontSize: isUpToExtraSmall ? 13 : 16 }}>{`+0.03%`}</p>}
          />
        </Grid>
        <Grid item md={12} lg={3} className={classes.boxItem}>
          <CardItem
            title={t('No. Pools')}
            colorTextRatioValue="#F05359"
            valueContainer={
              <Box display="flex" alignItems="center">
                <Typography
                  className={classes.cardValue}
                  style={{ color: theme.text6Sone, fontSize: isUpToExtraSmall ? 20 : 28 }}
                >
                  {Object.keys(allPairs).length}
                </Typography>
              </Box>
            }
            ratioValue={<p style={{ marginRight: 5, fontSize: isUpToExtraSmall ? 13 : 16 }}>{`-0.03%`}</p>}
          />
        </Grid>
        <Grid item md={12} lg={3} className={classes.boxItem}>
          <CardItem
            title={t('Total Fees (24h)')}
            colorTextRatioValue="#7AC51B"
            valueContainer={
              <Box display="flex" alignItems="center">
                <Typography
                  className={classes.cardValue}
                  style={{ color: theme.text6Sone, fontSize: isUpToExtraSmall ? 20 : 28 }}
                >
                  {Math.round(totalFee24h)}
                </Typography>
              </Box>
            }
            ratioValue={<p style={{ marginRight: 5, fontSize: isUpToExtraSmall ? 13 : 16 }}>{`+0.03%`}</p>}
          />
        </Grid>
      </StyledGrid>
      <div className="box-chart">
        {!isMobile && (
          <GridRow>
            <PanelHight>
              <GlobalChart display="liquidity" />
            </PanelHight>
            <PanelLow>
              <GlobalChart display="volume" />
            </PanelLow>
          </GridRow>
        )}
        {isMobile && (
          // <GridRow>
          <AutoColumn style={{ marginTop: '6px' }} gap="24px">
            <PanelHight>
              <GlobalChart display="liquidity" />
            </PanelHight>
          </AutoColumn>
          // </GridRow>
        )}
      </div>
      <div>
        <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
          <RowBetween>
            <TYPE.main
              fontSize={isMobile ? '20px' : '40px'}
              style={{ whiteSpace: 'nowrap', marginBottom: '1rem', fontWeight: 'bold' }}
            >
              {t('Top Tokens')}
            </TYPE.main>
            <CustomLink className="btnLink" to="/swap/tokens">
              {t('See more')}
            </CustomLink>
          </RowBetween>
        </ListOptions>
        <TopTokenList tokens={allTokens} />
      </div>
      <div>
        <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
          <RowBetween>
            <TYPE.main
              fontSize={isMobile ? '20px' : '40px'}
              style={{ whiteSpace: 'nowrap', marginBottom: '1rem', fontWeight: 'bold' }}
            >
              {t('Top Pairs')}
            </TYPE.main>
            <CustomLink className="btnLink" to="/swap/pairs">
              {t('See more')}
            </CustomLink>
          </RowBetween>
        </ListOptions>
        <PairList pairs={allPairs} />
      </div>
      <div>
        <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
          <RowBetween>
            <TYPE.main
              fontSize={isMobile ? '20px' : '40px'}
              style={{ whiteSpace: 'nowrap', marginBottom: '1rem', fontWeight: 'bold' }}
            >
              {t('Top Accounts')}
            </TYPE.main>
            <CustomLink className="btnLink" to="/swap/accounts">
              {t('See more')}
            </CustomLink>
          </RowBetween>
        </ListOptions>
        <LPList lps={topLps} />
      </div>
      <div>
        <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
          <RowBetween>
            <TYPE.main
              fontSize={isMobile ? '20px' : '40px'}
              style={{ whiteSpace: 'nowrap', marginBottom: '1rem', fontWeight: 'bold' }}
            >
              {t('Transactions')}
            </TYPE.main>
          </RowBetween>
        </ListOptions>
        <TxnList transactions={transactions} />
      </div>
    </div>
  )
}

export default OverviewStatistics
