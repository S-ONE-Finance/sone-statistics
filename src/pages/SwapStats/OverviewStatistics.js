import React, { useContext } from 'react'
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
import { useAllTokenData } from '../../contexts/TokenData'
import { useMedia } from 'react-use'
import { AutoColumn } from '../../components/Column'
import { useDarkModeManager } from '../../contexts/LocalStorage'
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
    color: 'green',
  },
  negative: {
    color: 'red',
  },
  primaryBg: {
    backgroundColor: theme.palette.primary.main,
  },
}))

const StyledGrid = styled(Grid)`
  max-width: 100%;
  margin: 0 auto !important;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 90%;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    max-width: 400px;
    width: 100%;
  `}
`

const GridRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  column-gap: 6px;
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

function OverviewStatistics(props) {
  const classes = useStyles()
  const theme = useContext(ThemeContext)
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const { commonData } = useDashboardData()
  const allTokens = useAllTokenData()
  const [isDarkMode] = useDarkModeManager()
  // breakpoints
  const below800 = useMedia('(max-width: 800px)')

  return (
    <div className="box-main-content-overview">
      <StyledGrid className="box-card-items" container spacing={3}>
        <Grid item md={6} lg={3} className="card-item">
          <CardItem
            title="ETH Price"
            colorTextRatioValue="#F05359"
            className="box-item"
            valueContainer={
              <Box display="flex" alignItems="center">
                <Typography
                  className={classes.cardValue}
                  style={{ color: theme.text6Sone, fontSize: isUpToExtraSmall ? 20 : 28 }}
                >
                  {`$${reduceFractionDigit(commonData?.totalLiquidity)}`}
                </Typography>
              </Box>
            }
            ratioValue={<p style={{ marginRight: 5, fontSize: isUpToExtraSmall ? 13 : 16 }}>{`-0.03%`}</p>}
          />
        </Grid>
        <Grid item md={6} lg={3} className="card-item">
          <CardItem
            title="No. Transactions (24h)"
            colorTextRatioValue="#7AC51B"
            className="box-item"
            valueContainer={
              <Box display="flex" alignItems="center">
                <Typography
                  className={classes.cardValue}
                  style={{ color: theme.text6Sone, fontSize: isUpToExtraSmall ? 20 : 28 }}
                >
                  {`$${reduceFractionDigit(commonData?.totalLiquidity)}`}
                </Typography>
              </Box>
            }
            ratioValue={<p style={{ marginRight: 5, fontSize: isUpToExtraSmall ? 13 : 16 }}>{`-0.03%`}</p>}
          />
        </Grid>
        <Grid item md={12} lg={3} className="card-item">
          <CardItem
            title="Pools"
            colorTextRatioValue="#F05359"
            className="box-item"
            valueContainer={
              <Box display="flex" alignItems="center">
                <Typography
                  className={classes.cardValue}
                  style={{ color: theme.text6Sone, fontSize: isUpToExtraSmall ? 20 : 28 }}
                >
                  {`$${reduceFractionDigit(commonData?.totalLiquidity)}`}
                </Typography>
              </Box>
            }
            ratioValue={<p style={{ marginRight: 5, fontSize: isUpToExtraSmall ? 13 : 16 }}>{`-0.03%`}</p>}
          />
        </Grid>
        <Grid item md={12} lg={3} className="card-item">
          <CardItem
            title="Total Fees (24h)"
            colorTextRatioValue="#7AC51B"
            className="box-item"
            valueContainer={
              <Box display="flex" alignItems="center">
                <Typography
                  className={classes.cardValue}
                  style={{ color: theme.text6Sone, fontSize: isUpToExtraSmall ? 20 : 28 }}
                >
                  {`$${reduceFractionDigit(commonData?.totalLiquidity)}`}
                </Typography>
              </Box>
            }
            ratioValue={<p style={{ marginRight: 5, fontSize: isUpToExtraSmall ? 13 : 16 }}>{`-0.03%`}</p>}
          />
        </Grid>
      </StyledGrid>
      <div className="box-chart">
        {!below800 && (
          <GridRow>
            <Panel
              style={{
                height: '100%',
                minHeight: '300px',
                zIndex: 0,
                backgroundColor: isDarkMode ? '#0E2B4A' : '#fff',
                border: 0,
                boxShadow: '0px 8px 17px rgba(0, 0, 0, 0.18)',
              }}
            >
              <GlobalChart display="liquidity" />
            </Panel>
            <Panel
              style={{
                height: '100%',
                zIndex: 0,
                backgroundColor: isDarkMode ? '#0E2B4A' : '#fff',
                border: 0,
                boxShadow: '0px 8px 17px rgba(0, 0, 0, 0.18)',
              }}
            >
              <GlobalChart display="volume" />
            </Panel>
          </GridRow>
        )}
        {below800 && (
          <AutoColumn style={{ marginTop: '6px' }} gap="24px">
            <Panel
              style={{
                height: '100%',
                minHeight: '300px',
                zIndex: 0,
                backgroundColor: isDarkMode ? '#0E2B4A' : '#fff',
                border: 0,
                boxShadow: '0px 8px 17px rgba(0, 0, 0, 0.18)',
              }}
            >
              <GlobalChart display="liquidity" />
            </Panel>
          </AutoColumn>
        )}
      </div>
      <div>
        <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
          <RowBetween>
            <TYPE.main fontSize={'2.125rem'} style={{ whiteSpace: 'nowrap' }}>
              Top Tokens
            </TYPE.main>
            <CustomLink className="btnLink" to={'/tokens'}>
              See more
            </CustomLink>
          </RowBetween>
        </ListOptions>
        {/* <Panel style={{ marginTop: '6px', padding: '2.125rem 0 ' }}> */}
        <TopTokenList tokens={allTokens} />
        {/* </Panel> */}
      </div>
      <div>
        <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
          <RowBetween>
            <TYPE.main fontSize={'2.125rem'} style={{ whiteSpace: 'nowrap' }}>
              Top Pairs
            </TYPE.main>
            <CustomLink className="btnLink" to={'/tokens'}>
              See more
            </CustomLink>
          </RowBetween>
        </ListOptions>
        {/* <Panel style={{ marginTop: '6px', padding: '2.125rem 0 ' }}> */}
        <TopTokenList tokens={allTokens} />
        {/* </Panel> */}
      </div>
      <div>
        <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
          <RowBetween>
            <TYPE.main fontSize={'2.125rem'} style={{ whiteSpace: 'nowrap' }}>
              Top Accounts
            </TYPE.main>
            <CustomLink className="btnLink" to={'/tokens'}>
              See more
            </CustomLink>
          </RowBetween>
        </ListOptions>
        {/* <Panel style={{ marginTop: '6px', padding: '2.125rem 0 ' }}> */}
        <TopTokenList tokens={allTokens} />
        {/* </Panel> */}
      </div>
      <div>
        <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
          <RowBetween>
            <TYPE.main fontSize={'2.125rem'} style={{ whiteSpace: 'nowrap' }}>
              Transactions
            </TYPE.main>
            <CustomLink className="btnLink" to={'/tokens'}>
              See more
            </CustomLink>
          </RowBetween>
        </ListOptions>
        {/* <Panel style={{ marginTop: '6px', padding: '2.125rem 0 ' }}> */}
        <TopTokenList tokens={allTokens} />
        {/* </Panel> */}
      </div>
    </div>
  )
}

export default OverviewStatistics
