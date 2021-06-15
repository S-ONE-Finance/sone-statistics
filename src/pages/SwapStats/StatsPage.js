import React, { useContext, useState } from 'react'
import { Grid, makeStyles, Box, Tab, Tabs, withStyles } from '@material-ui/core'
import BoxSearch from '../../components/Search'
import styled, { ThemeContext } from 'styled-components'
import { PageWrapper, ContentWrapper } from '../../components'
import OverviewStatistics from './OverviewStatistics'
import TokensStatistics from './TokensStatistics'
import './styles.css'
import { ReactComponent as CircleImage } from '../../assets/circle-dot.svg'
import { ReactComponent as IconLink } from '../../assets/link.svg'
import { ReactComponent as IconUser } from '../../assets/user.svg'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import PairsStatistics from './PairsStatistics'
import AccountStatics from './AccountStatics'
import TransactionStatics from './TransactionStatics'

const Title = styled.div`
  color: ${({ theme }) => theme.text6Sone};
  font-size: 40px;
  font-weight: 500;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 20px;
    font-weight: 700;
    text-align: left;
  `}
`

const MainWrapper = styled.div`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
   padding-bottom: 10%
  `}
`

const StyledGrid = styled(Grid)`
  max-width: 100%;
  margin: 0 auto !important;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 90%;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    max-width: 400px;
     width: 100% !important;;
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
function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }
}

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
      margin: '15px auto 0',
      width: '100%',
    },
    '@media (min-width: 576px) and (max-width: 800px)': {
      // margin-left: auto;
    },
  },
}))

const TabCustom = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    justifyContent: 'space-between',
    minWidth: 220,
    marginBottom: 30,
    borderRadius: 30,
    marginTop: 35,
    backgroundColor: useContext(ThemeContext).gray,
    color: useContext(ThemeContext).colorModeButton,
    '&:hover': {
      color: '',
      opacity: 1,
    },
    '&$selected': {
      color: '#fff',
      backgroundColor: useContext(ThemeContext).red1Sone,
      borderRadius: 30,
      fontWeight: theme.typography.fontWeightMedium,
      justifyContent: 'space-between',
    },
  },
  selected: {
    backgroundColor: 'red',
  },
}))((props) => <Tab disableRipple {...props} />)

function StatsPage() {
  const classes = customStyleTabbar()
  const [indexTabMain, setIndexTabMain] = useState(0)
  const [isDarkMode] = useDarkModeManager()
  const handleChange = (event, newValue) => {
    setIndexTabMain(newValue)
  }

  return (
    <MainWrapper>
      <PageWrapper>
        <ContentWrapper style={{ zIndex: 1 }}>
          <Grid container spacing={0} className="box-first-main">
            <Grid item lg={4} md={12} mb={0.5} px={0}>
              <Title>Swap Statistics</Title>
            </Grid>
            <Grid className={classes.boxSearchLeft} item lg={4} md={12} mb={0.5} px={2} mt={2}>
              <BoxSearch />
            </Grid>
          </Grid>

          {/* tab switch */}
          <StyledGrid container spacing={0}>
            <Grid item xs={12}>
              <Tabs
                value={indexTabMain}
                onChange={handleChange}
                indicatorColor=""
                textColor="primary"
                variant="fullWidth"
                scrollButtons="off"
              >
                <TabCustom
                  classes={{
                    wrapper: classes.iconLabelWrapper,
                    labelContainer: classes.labelContainer,
                  }}
                  icon={<CircleImage className={isDarkMode ? 'iconDarkMode' : 'iconLightMode'} />}
                  // className={classes.btnMain + ` btn-tab-custom`}
                  className={isDarkMode ? 'btn-tab-custom btn-dark-mode' : 'btn-tab-custom btn-light-mode'}
                  label="Overview"
                  {...a11yProps(0)}
                />
                <TabCustom
                  classes={{
                    wrapper: classes.iconLabelWrapper,
                    labelContainer: classes.labelContainer,
                  }}
                  icon={<CircleImage className={isDarkMode ? 'iconDarkMode' : 'iconLightMode'} />}
                  className={isDarkMode ? 'btn-tab-custom btn-dark-mode' : 'btn-tab-custom btn-light-mode'}
                  label="Tokens "
                  {...a11yProps(1)}
                />
                <TabCustom
                  classes={{
                    wrapper: classes.iconLabelWrapper,
                    labelContainer: classes.labelContainer,
                  }}
                  icon={<IconLink className={isDarkMode ? 'iconDarkMode' : 'iconLightMode'} />}
                  className={isDarkMode ? 'btn-tab-custom btn-dark-mode' : 'btn-tab-custom btn-light-mode'}
                  label="Pairs"
                  {...a11yProps(2)}
                />
                <TabCustom
                  classes={{
                    wrapper: classes.iconLabelWrapper,
                    labelContainer: classes.labelContainer,
                  }}
                  icon={<IconUser fontSize="small" className={isDarkMode ? 'iconDarkMode' : 'iconLightMode'} />}
                  className={isDarkMode ? 'btn-tab-custom btn-dark-mode' : 'btn-tab-custom btn-light-mode'}
                  label="Accounts"
                  {...a11yProps(3)}
                />
                <TabCustom
                  classes={{
                    wrapper: classes.iconLabelWrapper,
                    labelContainer: classes.labelContainer,
                  }}
                  icon={
                    <IconUser
                      style={{ width: 20, height: 20 }}
                      className={isDarkMode ? 'iconDarkMode' : 'iconLightMode'}
                    />
                  }
                  className={isDarkMode ? 'btn-tab-custom btn-dark-mode' : 'btn-tab-custom btn-light-mode'}
                  label="Transactions"
                  {...a11yProps(4)}
                />
              </Tabs>
            </Grid>
          </StyledGrid>
          <TabPanel value={indexTabMain} index={0}>
            <OverviewStatistics />
          </TabPanel>
          <TabPanel value={indexTabMain} index={1}>
            <TokensStatistics />
          </TabPanel>
          <TabPanel value={indexTabMain} index={2}>
            <PairsStatistics />
          </TabPanel>
          <TabPanel value={indexTabMain} index={3}>
            <AccountStatics />
          </TabPanel>
          <TabPanel value={indexTabMain} index={4}>
            <TransactionStatics />
          </TabPanel>
          <TabPanel value={indexTabMain} index={5}>
            Item Six
          </TabPanel>
          <TabPanel value={indexTabMain} index={6}>
            Item Seven
          </TabPanel>
        </ContentWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}

export default StatsPage
