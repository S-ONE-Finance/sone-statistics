import React, { useContext, useState } from 'react'
import { Grid, makeStyles, Box, Tab, Tabs, withStyles } from '@material-ui/core'
import BoxSearch from '../../components/Search'
import styled, { ThemeContext } from 'styled-components'
import { PageWrapper, ContentWrapper } from '../../components'
import { AutoRow } from '../../components/Row'
import OverviewStatistics from './OverviewStatistics'
import './styles.css'
import circleImage from '../../assets/circle-dot.svg'

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

const StyledGrid = styled(Grid)`
  max-width: 100%;
  margin: 0 auto !important;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 90%;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    max-width: 400px;
  `}
`

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {<Box>{children}</Box>}
    </div>
  )
}
function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  }
}

const customStyleTabbar = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    // backgroundColor: 'red',
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
}))

const TabCustom = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    justifyContent: 'space-between',
    minWidth: 250,
    marginBottom: 30,
    borderRadius: 30,
    backgroundColor: useContext(ThemeContext).gray,
    '&:hover': {
      color: useContext(ThemeContext).red1Sone,
      opacity: 1,
    },
    '&$selected': {
      color: useContext(ThemeContext).text1Sone,
      backgroundColor: useContext(ThemeContext).red1Sone,
      borderRadius: 30,
      fontWeight: theme.typography.fontWeightMedium,
      justifyContent: 'space-between',
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />)

function StatsPage() {
  const classes = customStyleTabbar()
  const theme = useContext(ThemeContext)
  const [indexTabMain, setIndexTabMain] = useState(0)

  const handleChange = (event, newValue) => {
    setIndexTabMain(newValue)
  }

  return (
    <>
      <PageWrapper>
        <ContentWrapper>
          <StyledGrid container spacing={3}>
            <Box mb={0.5} px={2}>
              <Title>Swap Statistics</Title>
            </Box>
            <Box mb={0.5} px={2} ml="auto" style={{ width: 400 }}>
              <BoxSearch />
            </Box>
          </StyledGrid>

          {/* tab switch */}
          <div className={classes.root}>
            <Tabs
              value={indexTabMain}
              onChange={handleChange}
              indicatorColor=""
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <TabCustom
                classes={{
                  wrapper: classes.iconLabelWrapper,
                  labelContainer: classes.labelContainer,
                }}
                icon={<circleImage className={classes.iconPaddingRight} />}
                className={classes.btnMain}
                label="Overview"
                {...a11yProps(0)}
              />
              <TabCustom className={classes.btnMain} label="Tokens " {...a11yProps(1)} />
              <TabCustom className={classes.btnMain} label="Pairs" {...a11yProps(2)} />
              <TabCustom className={classes.btnMain} label="Accounts" {...a11yProps(3)} />
              <TabCustom className={classes.btnMain} label="Transactions" {...a11yProps(4)} />
            </Tabs>
            <TabPanel value={indexTabMain} index={0}>
              <OverviewStatistics />
            </TabPanel>
            <TabPanel value={indexTabMain} index={1}>
              Item Two
            </TabPanel>
            <TabPanel value={indexTabMain} index={2}>
              Item Three
            </TabPanel>
            <TabPanel value={indexTabMain} index={3}>
              Item Four
            </TabPanel>
            <TabPanel value={indexTabMain} index={4}>
              Item Five
            </TabPanel>
            <TabPanel value={indexTabMain} index={5}>
              Item Six
            </TabPanel>
            <TabPanel value={indexTabMain} index={6}>
              Item Seven
            </TabPanel>
          </div>
        </ContentWrapper>
      </PageWrapper>
    </>
  )
}

export default StatsPage
