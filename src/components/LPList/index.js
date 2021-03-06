import React, { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import dayjs from 'dayjs'
import LocalLoader from '../LocalLoader'
import utc from 'dayjs/plugin/utc'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'

import { CustomLink } from '../Link'
import { Divider } from '..'
import { withRouter } from 'react-router-dom'
import { formattedNum } from '../../utils'
import { TYPE } from '../../theme'
import DoubleTokenLogo from '../DoubleLogo'
import { RowFixed } from '../Row'
import { Pagination } from '@material-ui/lab'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

dayjs.extend(utc)

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
  width: 100%;
  @media screen and (max-width: 600px) {
    min-height: 300px;
  }
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 0.1fr 1fr 1fr 0.35fr;
  grid-template-areas: 'number name pair value';
  padding: 0 4px;

  > * {
    justify-content: flex-end;
  }

  @media screen and (max-width: 1080px) {
    grid-template-columns: 10px 1.5fr 1fr 1fr;
    grid-template-areas: 'number name pair value';
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: 'name pair value';
  }
`

const ListWrapper = styled.div``

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  justify-content: center;
  color: ${({ theme }) => theme.text1};
  & > * {
    font-size: 16px;
  }

  @media screen and (max-width: 600px) {
    font-size: 13px;
  }
`
const useStyles = makeStyles({
  navigation: {
    marginTop: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxNavigation: {
    height: 32,
    marginLeft: 10,
    border: '1px solid #c4c4c4',
    width: 90,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    textAlign: 'center',
  },
})

function LPList({ lps, disbaleLinks, maxItems = 5 }) {
  const below600 = useMedia('(max-width: 600px)')
  const below800 = useMedia('(max-width: 800px)')

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [ITEMS_PER_PAGE, setITEMS_PER_PAGE] = useState(maxItems)
  const [isDarkMode] = useDarkModeManager()
  const { t } = useTranslation()
  const classes = useStyles()

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [lps])

  useEffect(() => {
    if (lps) {
      let extraPages = 1
      if (Object.keys(lps).length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(Object.keys(lps).length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [ITEMS_PER_PAGE, lps])

  const ListItem = ({ lp, index }) => {
    return (
      <DashGrid style={{ height: below600 ? '52px' : '48px' }} disbaleLinks={disbaleLinks} focus={true}>
        {!below600 && (
          <DataText
            area="number"
            fontWeight="500"
            style={{ justifyContent: 'center', margin: 'auto', fontWeight: 400 }}
            className={
              isDarkMode
                ? 'justify-content-center font-weight-normal color-gray2'
                : 'justify-content-center font-weight-normal color-gray'
            }
          >
            {index}
          </DataText>
        )}
        <DataText area="name" fontWeight="500" justifyContent="flex-start">
          <CustomLink
            style={{
              marginLeft: below600 ? 0 : '1rem',
              whiteSpace: 'nowrap',
              color: '#3FAAB0',
              margin: 'auto',
              fontWeight: 400,
            }}
            to={'/swap/account/' + lp.user.id}
          >
            {below800 ? lp.user.id.slice(0, 4) + '...' + lp.user.id.slice(38, 42) : lp.user.id}
          </CustomLink>
        </DataText>
        <DataText>
          <CustomLink
            style={{ color: '#3FAAB0', margin: 'auto', minWidth: '115px' }}
            area="pair"
            to={'/swap/pair/' + lp.pairAddress}
          >
            <RowFixed
              className={
                isDarkMode ? 'justify-content-center font-weight-normal' : 'justify-content-center font-weight-normal'
              }
              style={{ margin: below600 ? 'auto' : '', flexDirection: below600 ? 'column' : '' }}
            >
              <div style={{ marginBottom: below600 ? '5px' : '' }}>
                {<DoubleTokenLogo a0={lp.token0} a1={lp.token1} size={16} margin={true} />}
              </div>
              {lp.pairName}
            </RowFixed>
          </CustomLink>
        </DataText>
        <DataText
          style={{ margin: 'auto', minWidth: !below600 ? '200px' : 'auto' }}
          area="value"
          className={
            isDarkMode
              ? 'justify-content-center font-weight-normal color-gray2'
              : 'justify-content-center font-weight-normal color-gray'
          }
        >
          {formattedNum(lp.usd, true)}
        </DataText>
      </DashGrid>
    )
  }

  const lpList =
    lps &&
    lps.slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE).map((lp, index) => {
      return (
        // <div key={index}>
        <div
          key={index}
          className={
            isDarkMode
              ? index % 2
                ? 'table-row'
                : 'table-row-dark-mode'
              : index % 2
              ? 'table-row'
              : 'table-row-light-mode'
          }
        >
          <ListItem key={index} index={(page - 1) * ITEMS_PER_PAGE + index + 1} lp={lp} />
          <Divider />
        </div>
      )
    })

  const StyleFlex = styled(Flex)`
    justify-content: center;
  `
  const StyleTypeMain = styled(TYPE.main)`
    justify-content: center;
  `

  const handleChangePagePanigation = (event) => {
    setPage(1)
    setITEMS_PER_PAGE(event.target.value)
    return
  }

  return (
    <>
      <ListWrapper className={isDarkMode ? 'isBgTableDark' : 'isBgTableLight'} style={{ minHeight: '302px' }}>
        <DashGrid center={true} disbaleLinks={disbaleLinks} style={{ height: 'fit-content', padding: '1rem' }}>
          {!below600 && (
            <StyleFlex alignItems="center">
              <TYPE.main area="number" className="f-20 font-weight-bold"></TYPE.main>
            </StyleFlex>
          )}
          <StyleFlex alignItems="center">
            <TYPE.main area="name" className="f-20 font-weight-bold">
              {t('Accounts')}
            </TYPE.main>
          </StyleFlex>
          <StyleFlex alignItems="center">
            <TYPE.main area="pair" className="f-20 font-weight-bold">
              {t('Pairs')}
            </TYPE.main>
          </StyleFlex>
          <StyleFlex alignItems="center">
            <StyleTypeMain area="value" className="f-20 font-weight-bold">
              {t('Liquidity')}
            </StyleTypeMain>
          </StyleFlex>
        </DashGrid>
        <Divider />
        <List p={0}>{!lpList ? <LocalLoader /> : lpList}</List>
      </ListWrapper>
      {lpList && (
        <div className={classes.navigation}>
          <Pagination
            style={{ justifyContent: 'center', padding: 0 }}
            page={page}
            onChange={(event, newPage) => {
              setPage(newPage)
            }}
            count={maxPage}
            variant="outlined"
            shape="rounded"
            className="panigation-table"
            classes={{
              root: classes.root, // class name, e.g. `classes-nesting-root-x`
            }}
            siblingCount={below600 ? 0 : 2}
          />
          <Select
            className={classes.boxNavigation}
            style={{ color: isDarkMode ? '#fff' : '#767676', fontSize: 14 }}
            labelId="demo-customized-select-label"
            id="demo-customized-select"
            value={ITEMS_PER_PAGE}
            onChange={handleChangePagePanigation}
          >
            <MenuItem value={5}>5/{t('page')}</MenuItem>
            <MenuItem value={10}>10/{t('page')}</MenuItem>
            <MenuItem value={100}>100/{t('page')}</MenuItem>
          </Select>
        </div>
      )}
    </>
  )
}

export default withRouter(LPList)
