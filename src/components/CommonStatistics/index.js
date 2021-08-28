import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Grid, makeStyles, Paper, Typography } from '@material-ui/core'
import { reduceFractionDigit, reduceLongNumber } from '../../utils/number'
import totalLiquidityIcon from '../../assets/total-liquidity.svg'
import totalStakedIcon from '../../assets/total-staked.svg'
import soneWhiteIcon from '../../assets/sone_white.svg'
import styled, { ThemeContext } from 'styled-components'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { S_ONE_APP_URL } from '../../constants/urls'
import useFarms from '../../hooks/useFarms'
import useOneSoneInUSD from '../../hooks/useOneSoneInUSD'

const useStyles = makeStyles((theme) => ({
  cardPreview: {
    marginRight: 30,
    width: 128,
    height: 116,
    borderRadius: 25,
    overflow: 'hidden'
  },
  cardValue: {
    marginRight: 10,
    fontWeight: 700
  },
  cardPercent: {
    fontSize: 16
  },
  positive: {
    color: '#7AC51B'
  },
  negative: {
    color: '#F05359'
  },
  primaryBg: {
    backgroundColor: theme.palette.primary.main
  }
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
        <Box display='flex' alignItems='center'>
          <Box
            className={classes.cardPreview}
            style={isUpToExtraSmall ? { marginRight: 10, width: 76, height: 76, borderRadius: 20 } : null}
          >
            {displayPreview}
          </Box>
          <Grid container direction='column' spacing={isUpToExtraSmall ? 0 : 1} style={{ width: 'auto' }}>
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
  const classes = useStyles()
  const theme = useContext(ThemeContext)
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const { t, i18n } = useTranslation()


  const farms = useFarms()
  const totalSupplyOfAllFarms = farms.reduce((res, item) => res + (Number(item.soneHarvestedUSD) ?? 0), 0)
  // const totalSupplyOfAllFarmsInUSD =
  const totalValueStaked = farms.reduce((res, item) => res + (Number(item.balanceUSD) ?? 0), 0)
  const sonePriceInUSD = useOneSoneInUSD()

  const handleCalculateStakeRate = (staked, liquidity) => {
    return `${reduceFractionDigit((staked / liquidity) * 100 || 0, 1)}%`
  }

  const commonData = {}

  return (
    <StyledGrid container spacing={3}>
      <CardItem
        displayPreview={
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            width='100%'
            height='100%'
            style={{ background: theme.red1Sone }}
          >
            <img
              alt=''
              src={totalLiquidityIcon}
              style={isUpToExtraSmall ? { width: 40, height: 40 } : { width: 80, height: 80 }}
            />
          </Box>
        }
        title={t('Total Supply')}
        valueContainer={
          <Box display='flex' alignItems='center'>
            <Typography
              className={classes.cardValue}
              style={{ color: theme.text6Sone, fontSize: isUpToExtraSmall ? 20 : 28 }}
            >
              {`$${reduceFractionDigit(totalSupplyOfAllFarms, 6)}`}
            </Typography>
          </Box>
        }
        descriptionContainer={
          <Box display='flex' alignItems='center'>
            <a
              rel='noopener noreferrer'
              href={S_ONE_APP_URL + '/#/add'}
              target='_blank'
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
            display='flex'
            justifyContent='center'
            alignItems='center'
            width='100%'
            height='100%'
            style={{ background: theme.red1Sone }}
          >
            <img
              alt=''
              src={totalStakedIcon}
              style={isUpToExtraSmall ? { width: 40, height: 40 } : { width: 80, height: 80 }}
            />
          </Box>
        }
        title={t('Total Value Staked')}
        valueContainer={
          <Box display='flex' alignItems='center'>
            <Typography className={classes.cardValue}
                        style={{ color: theme.text6Sone }}>{`$${reduceFractionDigit(totalValueStaked, 6)}`}</Typography>
          </Box>
        }
        descriptionContainer={
          i18n.language === 'jp'
            ? `${t('of Total Liquidity')} ${handleCalculateStakeRate(totalValueStaked, commonData?.totalLiquidity)}`
            : `${handleCalculateStakeRate(totalValueStaked, commonData?.totalLiquidity)} ${t('of Total Liquidity')}`
        }
      />
      <CardItem
        displayPreview={
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            width='100%'
            height='100%'
            style={{ background: theme.red1Sone }}
          >
            <img
              alt=''
              src={soneWhiteIcon}
              style={isUpToExtraSmall ? { width: 40, height: 40 } : { width: 80, height: 80 }}
            />
          </Box>
        }
        title={t('SONE Token Price')}
        valueContainer={
          <Box display='flex' alignItems='center'>
            <Typography className={classes.cardValue} style={{ color: theme.text6Sone }}>{`$${reduceFractionDigit(sonePriceInUSD, 6)}`}</Typography>
          </Box>
        }
        descriptionContainer={`${t('Total Supply')}: ${reduceLongNumber(commonData?.totalSupply)} SONE`}
      />
    </StyledGrid>
  )
}
