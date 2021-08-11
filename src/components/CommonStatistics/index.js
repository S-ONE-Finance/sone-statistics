import React, { useState, useEffect, useContext } from 'react'
import { Grid, Paper, makeStyles, Box, Typography } from '@material-ui/core'
import { reduceFractionDigit, reduceLongNumber } from '../../utils/number'
import useDashboardData from '../../hooks/useDashboardData'
import totalLiquidityIcon from '../../assets/total-liquidity.svg'
import totalStakedIcon from '../../assets/total-staked.svg'
import soneWhiteIcon from '../../assets/sone_white.svg'
import styled, { ThemeContext } from 'styled-components'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { S_ONE_APP_URL } from '../../constants/urls'
import { useTranslation } from 'react-i18next'

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
    max-width: 300px;
  `}
`

const CardItem = ({ displayPreview, title, valueContainer, descriptionContainer }) => {
  const classes = useStyles()
  const theme = useContext(ThemeContext)
  const isUpToExtraSmall = useIsUpToExtraSmall()

  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Paper
        elevation={2}
        style={{ background: theme.bg1Sone, color: '#767676', borderRadius: isUpToExtraSmall ? 20 : 25 }}
      >
        <Box display="flex" alignItems="center">
          <Box
            className={classes.cardPreview}
            style={isUpToExtraSmall ? { marginRight: 10, width: 76, height: 76, borderRadius: 20 } : null}
          >
            {displayPreview}
          </Box>
          <Grid container direction="column" spacing={isUpToExtraSmall ? 0 : 1} style={{ width: 'auto' }}>
            <Grid item style={{ fontSize: isUpToExtraSmall ? 13 : 16, fontWeight: 400, color: theme.text4Sone }}>
              {title}
            </Grid>
            <Grid item>{valueContainer}</Grid>
            <Grid item style={{ color: theme.text10Sone, fontSize: isUpToExtraSmall ? 13 : 16 }}>
              {descriptionContainer}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  )
}

export default function CommonStatistics() {
  const { commonData, pools } = useDashboardData()
  const [totalStaked, setTotalStaked] = useState(0)
  const classes = useStyles()
  const theme = useContext(ThemeContext)
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const { t, i18n } = useTranslation()
  console.log('i18ni18ni18n', i18n.language)
  const handleCalculateStakeRate = (staked, liquidity) => {
    return `${reduceFractionDigit((staked / liquidity) * 100 || 0, 1)}%`
  }

  useEffect(() => {
    if (pools && pools.length > 0) {
      let _totalStaked = 0

      pools.forEach((item) => {
        _totalStaked += item.usdValue
      })

      setTotalStaked(_totalStaked)
    }
  }, [pools])

  return (
    <StyledGrid container spacing={3}>
      <CardItem
        displayPreview={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
            style={{ background: theme.red1Sone }}
          >
            <img
              alt=""
              src={totalLiquidityIcon}
              style={isUpToExtraSmall ? { width: 40, height: 40 } : { width: 80, height: 80 }}
            />
          </Box>
        }
        title={t('Total Liquidity')}
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
        descriptionContainer={
          <Box display="flex" alignItems="center">
            <a
              rel="noopener noreferrer"
              href={S_ONE_APP_URL + '/#/add'}
              target="_blank"
              style={{ marginRight: 5, color: theme.text10Sone, fontSize: isUpToExtraSmall ? 13 : 16 }}
            >
              {t('Add Liquidity')}
            </a>
          </Box>
        }
      />
      <CardItem
        displayPreview={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
            style={{ background: theme.red1Sone }}
          >
            <img
              alt=""
              src={totalStakedIcon}
              style={isUpToExtraSmall ? { width: 40, height: 40 } : { width: 80, height: 80 }}
            />
          </Box>
        }
        title={t('Total Value Staked')}
        valueContainer={
          <Box display="flex" alignItems="center">
            <Typography className={classes.cardValue} style={{ color: theme.text6Sone }}>{`$${reduceFractionDigit(
              totalStaked
            )}`}</Typography>
          </Box>
        }
        descriptionContainer={
          i18n.language === 'jp'
            ? `${t('of Total Liquidity')} ${handleCalculateStakeRate(totalStaked, commonData?.totalLiquidity)}`
            : `${handleCalculateStakeRate(totalStaked, commonData?.totalLiquidity)} ${t('of Total Liquidity')}`
        }
      />
      <CardItem
        displayPreview={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
            style={{ background: theme.red1Sone }}
          >
            <img
              alt=""
              src={soneWhiteIcon}
              style={isUpToExtraSmall ? { width: 40, height: 40 } : { width: 80, height: 80 }}
            />
          </Box>
        }
        title={t('SONE Token Price')}
        valueContainer={
          <Box display="flex" alignItems="center">
            <Typography className={classes.cardValue} style={{ color: theme.text6Sone }}>{`$${reduceFractionDigit(
              commonData?.luaPrice,
              3
            )}`}</Typography>
          </Box>
        }
        descriptionContainer={`${t('Total Supply')}: ${reduceLongNumber(commonData?.totalSupply)} SONE`}
      />
    </StyledGrid>
  )
}
