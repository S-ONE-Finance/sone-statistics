import React, { useEffect } from 'react'
import { ReactComponent as CircleImage } from '../../assets/icon_overview.svg'
import { ReactComponent as IconCoin } from '../../assets/icon_coin.svg'
import { ReactComponent as IconTransactionCoin } from '../../assets/icon-transaction-coin.svg'
import { ReactComponent as IconPairs } from '../../assets/icon-coin-pair.svg'
import { ReactComponent as IconAccount } from '../../assets/account.svg'
import { useDarkModeManager, useIndexTabManager } from '../../contexts/LocalStorage'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { ContentWrapper } from '../index'
import { Grid, makeStyles, Tab, Tabs, withStyles } from '@material-ui/core'
import BoxSearch from '../Search'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

// icon-transaction-coin.svg

const customStyleTabbar = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
  btnMain: {
    background: theme.red1Sone,
    borderRadius: 30,
  },
  iconLabelWrapper: {
    flexDirection: 'row',
  },
  iconPaddingRight: {
    paddingRight: 7,
    marginBottom: '0px !important',
  },
  boxSearchLeft: {
    marginLeft: 'auto',
    '@media (max-width: 576px)': {
      margin: '19px auto 15px',
      width: '100%',
    },
    '@media (min-width: 576px) and (max-width: 800px)': {
      // margin-left: auto;
      marginBottom: '15px !important',
    },
  },
}))

const Title = styled.div`
  color: ${({ theme }) => theme.text6Sone};
  font-size: 40px;
  font-weight: 500;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 20px;
    font-weight: 700;
    text-align: center;
  `}
`

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }
}

function TabComponent(_props) {
  const [isDarkMode] = useDarkModeManager()
  // const { indexTabMain, handleChange } = _props
  const classes = customStyleTabbar()
  const { t, i18n } = useTranslation()
  const [indexTab, setIndex] = useIndexTabManager()
  const history = useHistory()
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })

  const pathTabIndex = {
    '/swap/tokens': 1,
    '/swap/pairs': 2,
    '/swap/accounts': 3,
  }
  useEffect(() => {
    const url = history.location.pathname
    if (pathTabIndex.hasOwnProperty(url)) {
      setIndex(pathTabIndex[url])
    }
  }, [history.location.pathname])

  const TabCustom = withStyles((theme) => {
    return {
      root: {
        textTransform: 'none',
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: theme.spacing(4),
        justifyContent: 'space-between',
        minWidth: 220,
        marginBottom: 30,
        borderRadius: 30,
        marginTop: 35,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        color: isDarkMode ? '#AAAAAA' : '#333333',
        '&$selected': {
          color: '#fff',
          borderRadius: 30,
          fontWeight: theme.typography.fontWeightMedium,
          justifyContent: 'space-between',
        },
      },
      selected: {
        // backgroundColor: '#F05359',
        // color: '#fff',
      },
    }
  })((props) => <Tab disableRipple {...props} />)

  return (
    <ContentWrapper style={{ zIndex: 1 }}>
      <Grid container spacing={0} className="box-first-main">
        <Grid
          item
          lg={4}
          md={12}
          mb={0.5}
          px={0}
          style={{ textAlign: isMobile ? 'center' : 'left', width: isMobile ? '100%' : 'auto' }}
        >
          <Title>{t('Swap Statistic')}</Title>
        </Grid>
        <Grid className={classes.boxSearchLeft} item lg={5} md={12} mb={0.5} px={2} mt={2}>
          <BoxSearch />
        </Grid>
      </Grid>
      <Tabs
        value={indexTab}
        onChange={(value, index) => {
          history.push('/swap')
          setIndex(index)
        }}
        indicatorColor=""
        textColor="primary"
        variant="fullWidth"
        scrollButtons="off"
      >
        <TabCustom
          theme2={isDarkMode}
          classes={{
            wrapper: classes.iconLabelWrapper,
            labelContainer: classes.labelContainer,
          }}
          icon={
            <CircleImage
              style={{ width: isMobile ? 16 : 23, height: isMobile ? 16 : 23 }}
              className={isDarkMode ? 'iconDarkMode' : 'iconLightMode'}
            />
          }
          // className={classes.btnMain + ` btn-tab-custom`}
          className={isDarkMode ? 'btn-tab-custom btn-dark-mode' : 'btn-tab-custom btn-light-mode'}
          label={t('Overview')}
          {...a11yProps(0)}
        />
        <TabCustom
          theme2={isDarkMode}
          classes={{
            wrapper: classes.iconLabelWrapper,
            labelContainer: classes.labelContainer,
          }}
          icon={
            <IconCoin
              style={{ width: isMobile ? 18 : 25, height: isMobile ? 18 : 25 }}
              className={isDarkMode ? 'iconDarkMode' : 'iconLightMode'}
            />
          }
          className={isDarkMode ? 'btn-tab-custom btn-dark-mode' : 'btn-tab-custom btn-light-mode'}
          label={t('Tokens')}
          {...a11yProps(1)}
        />
        <TabCustom
          theme2={isDarkMode}
          classes={{
            wrapper: classes.iconLabelWrapper,
            labelContainer: classes.labelContainer,
          }}
          icon={
            <IconPairs
              style={{ width: isMobile ? 18 : 25, height: isMobile ? 18 : 25 }}
              className={isDarkMode ? 'iconDarkMode' : 'iconLightMode'}
            />
          }
          className={isDarkMode ? 'btn-tab-custom btn-dark-mode' : 'btn-tab-custom btn-light-mode'}
          style={{ minWidth: i18n.language === 'jp' ? 135 : 120 }}
          label={t('Pairs')}
          {...a11yProps(2)}
        />
        <TabCustom
          theme2={isDarkMode}
          classes={{
            wrapper: classes.iconLabelWrapper,
            labelContainer: classes.labelContainer,
          }}
          icon={
            <IconAccount
              style={{ width: isMobile ? 16 : 30, height: isMobile ? 16 : 30 }}
              fontSize="small"
              className={isDarkMode ? 'iconDarkMode' : 'iconLightMode'}
            />
          }
          className={isDarkMode ? 'btn-tab-custom btn-dark-mode' : 'btn-tab-custom btn-light-mode'}
          label={t('Accounts')}
          {...a11yProps(3)}
        />
        <TabCustom
          theme2={isDarkMode}
          classes={{
            wrapper: classes.iconLabelWrapper,
            labelContainer: classes.labelContainer,
          }}
          icon={
            <IconTransactionCoin
              style={{ width: 30, height: 30 }}
              className={isDarkMode ? 'iconDarkMode' : 'iconLightMode'}
            />
          }
          style={{ marginRight: 0 }}
          className={isDarkMode ? 'btn-tab-custom btn-dark-mode' : 'btn-tab-custom btn-light-mode'}
          label={t('Transactions')}
          {...a11yProps(4)}
          TabComponent
        />
      </Tabs>
    </ContentWrapper>
  )
}

export default TabComponent
