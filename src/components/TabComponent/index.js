import React, { useContext, useState } from 'react'
import { Tab, Tabs, withStyles, makeStyles } from '@material-ui/core'
import { ReactComponent as CircleImage } from '../../assets/circle-dot.svg'
import { ReactComponent as IconLink } from '../../assets/link.svg'
import { ReactComponent as IconUser } from '../../assets/user.svg'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'

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

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }
}

function TabComponent(_props) {
  const [isDarkMode] = useDarkModeManager()
  const { indexTabMain, handleChange } = _props
  const classes = customStyleTabbar()
  const { t, i18n } = useTranslation()

  return (
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
        label={t('Overview')}
        {...a11yProps(0)}
      />
      <TabCustom
        classes={{
          wrapper: classes.iconLabelWrapper,
          labelContainer: classes.labelContainer,
        }}
        icon={<CircleImage className={isDarkMode ? 'iconDarkMode' : 'iconLightMode'} />}
        className={isDarkMode ? 'btn-tab-custom btn-dark-mode' : 'btn-tab-custom btn-light-mode'}
        label={t('Tokens')}
        {...a11yProps(1)}
      />
      <TabCustom
        classes={{
          wrapper: classes.iconLabelWrapper,
          labelContainer: classes.labelContainer,
        }}
        icon={<IconLink className={isDarkMode ? 'iconDarkMode' : 'iconLightMode'} />}
        className={isDarkMode ? 'btn-tab-custom btn-dark-mode' : 'btn-tab-custom btn-light-mode'}
        label={t('Pairs')}
        {...a11yProps(2)}
      />
      <TabCustom
        classes={{
          wrapper: classes.iconLabelWrapper,
          labelContainer: classes.labelContainer,
        }}
        icon={<IconUser fontSize="small" className={isDarkMode ? 'iconDarkMode' : 'iconLightMode'} />}
        className={isDarkMode ? 'btn-tab-custom btn-dark-mode' : 'btn-tab-custom btn-light-mode'}
        label={t('Accounts')}
        {...a11yProps(3)}
      />
      <TabCustom
        classes={{
          wrapper: classes.iconLabelWrapper,
          labelContainer: classes.labelContainer,
        }}
        icon={<IconUser style={{ width: 20, height: 20 }} className={isDarkMode ? 'iconDarkMode' : 'iconLightMode'} />}
        style={{ marginRight: 0 }}
        className={isDarkMode ? 'btn-tab-custom btn-dark-mode' : 'btn-tab-custom btn-light-mode'}
        label={t('Transactions')}
        {...a11yProps(4)}
        TabComponent
      />
    </Tabs>
  )
}

export default TabComponent
