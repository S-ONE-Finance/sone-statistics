import React, { useState, useEffect, useMemo, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { Box, Flex, Text } from 'rebass'
import TokenLogo from '../TokenLogo'
import { CustomLink } from '../Link'
import Row from '../Row'
import { Divider } from '..'

import { formattedNum, formattedPercent } from '../../utils'
import { useMedia } from 'react-use'
import { withRouter } from 'react-router-dom'
import { TOKEN_BLACKLIST } from '../../constants'
import FormattedName from '../FormattedName'
import { Pagination } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import Panel from '../../components/Panel'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import { useTranslation } from 'react-i18next'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

dayjs.extend(utc)

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
  width: 100%;
  @media screen and (max-width: 600px) {
    width: fit-content;
    min-height: 300px;
  }
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1.2fr 0.6fr 1fr 1fr 1fr 1.5fr;
  grid-template-areas: 'name symbol liq vol price change';
  padding: 0 1.125rem;

  > * {
    justify-content: flex-end;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
      width: 100px;
    }
  }

  @media screen and (max-width: 680px) {
    min-width: 750px;
    > * {
      justify-content: flex-end;
      width: 100%;

      &:first-child {
        justify-content: flex-start;
      }
    }
  }
`

const ListWrapper = styled.div`
  overflow: auto;
`

const ClickableText = styled(Text)`
  text-align: end;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  user-select: none;
  color: ${({ theme }) => theme.text1} !important;
  @media screen and (max-width: 640px) {
    font-size: 15px !important;
  }
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.text1} !important;

  & > * {
    font-size: 16px;
  }

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`

const SORT_FIELD = {
  LIQ: 'totalLiquidityUSD',
  VOL: 'oneDayVolumeUSD',
  VOL_UT: 'oneDayVolumeUT',
  SYMBOL: 'symbol',
  NAME: 'name',
  PRICE: 'priceUSD',
  CHANGE: 'priceChangeUSD',
}

const useStyles = makeStyles({
  root: {
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    // marginTop: 25,
  },
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
  outlined: {
    border: '1px solid red',
  },
})

// @TODO rework into virtualized list
function TopTokenList({ tokens, itemMax = 5, useTracked = false }) {
  // page state
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [isDarkMode] = useDarkModeManager()
  //styles
  const classes = useStyles()
  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.LIQ)

  const below680 = useMedia('(max-width: 680px)')
  const below600 = useMedia('(max-width: 600px)')

  const [ITEMS_PER_PAGE, setITEMS_PER_PAGE] = useState(itemMax)

  // i18n
  const { t } = useTranslation()
  // style theme
  const theme = useContext(ThemeContext)

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [tokens])

  const formattedTokens = useMemo(() => {
    return (
      tokens &&
      Object.keys(tokens)
        .filter((key) => {
          return !TOKEN_BLACKLIST.includes(key)
        })
        .map((key) => tokens[key])
    )
  }, [tokens])

  useEffect(() => {
    if (tokens && formattedTokens) {
      let extraPages = 1
      if (formattedTokens.length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(formattedTokens.length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [tokens, formattedTokens, ITEMS_PER_PAGE])

  const filteredList = useMemo(() => {
    return (
      formattedTokens &&
      formattedTokens
        .sort((a, b) => {
          if (sortedColumn === SORT_FIELD.SYMBOL || sortedColumn === SORT_FIELD.NAME) {
            return a[sortedColumn] > b[sortedColumn] ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
          }
          return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn])
            ? (sortDirection ? -1 : 1) * 1
            : (sortDirection ? -1 : 1) * -1
        })
        .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
    )
  }, [formattedTokens, ITEMS_PER_PAGE, page, sortDirection, sortedColumn])

  const ListItem = ({ item, index }) => {
    return (
      <DashGrid style={{ height: '48px' }} focus={true}>
        <DataText area="name" fontWeight="400">
          <Row>
            {!below680 && (
              <div
                style={{ marginRight: '40px', width: '10px' }}
                className={
                  isDarkMode
                    ? 'justify-content-center font-weight-normal color-gray2'
                    : 'justify-content-center font-weight-normal color-gray'
                }
              >
                {index}
              </div>
            )}
            <TokenLogo address={item.id} />
            <CustomLink
              style={{ marginLeft: '16px', whiteSpace: 'nowrap', color: '#767676' }}
              to={'/swap/token/' + item.id}
            >
              <FormattedName
                text={below680 ? item.symbol : item.name}
                maxCharacters={below600 ? 8 : 16}
                adjustSize={true}
                link={true}
                fontSize={'16px'}
                className="justify-content-center font-weight-normal color-gray"
              />
            </CustomLink>
          </Row>
        </DataText>
        <DataText
          area="symbol"
          style={{ color: isDarkMode ? '#AAAAAA' : '#767676 ' }}
          fontWeight="400"
          className="justify-content-center font-weight-normal"
        >
          <FormattedName
            style={{ color: isDarkMode ? '#AAAAAA' : '#767676 ' }}
            className="font-weight-normal"
            text={item.symbol}
            maxCharacters={5}
          />
        </DataText>
        <DataText
          area="liq"
          fontSize={below680 ? '13px' : '16px'}
          style={{ color: isDarkMode ? '#AAAAAA' : '#767676 ' }}
          fontWeight="400"
          className={
            isDarkMode
              ? 'justify-content-center font-weight-normal color-gray2'
              : 'justify-content-center font-weight-normal color-gray'
          }
        >
          {formattedNum(item.totalLiquidityUSD, true)}
        </DataText>
        <DataText
          area="vol"
          fontSize={'16px'}
          style={{ color: isDarkMode ? '#AAAAAA' : '#767676 ' }}
          fontWeight="400"
          className={
            isDarkMode
              ? 'justify-content-center font-weight-normal color-gray2'
              : 'justify-content-center font-weight-normal color-gray'
          }
        >
          {formattedNum(item.oneDayVolumeUSD, true)}
        </DataText>
        <DataText
          area="price"
          fontSize={'16px'}
          style={{ color: '#767676', fontWeight: 400 }}
          fontWeight="400"
          className="justify-content-center font-weight-normal color-gray"
        >
          <div className="justify-content-center font-weight-normal color-gray">
            {formattedNum(item.priceUSD, true)}
          </div>
        </DataText>
        <DataText
          area="change"
          style={{ color: '#767676' }}
          fontWeight="400"
          className="justify-content-center font-weight-normal color-gray"
        >
          <div className="justify-content-center font-weight-normal">
            {item.priceChangeUSD >= 0 ? (
              <p className="d-flex color-blue">
                <span>{formattedPercent(item.priceChangeUSD)}</span>
              </p>
            ) : (
              <p className="d-flex color-red">
                <span>{formattedPercent(item.priceChangeUSD)}</span>
              </p>
            )}
          </div>
        </DataText>
      </DashGrid>
    )
  }

  const handleChangePagePanigation = (event) => {
    setPage(1)
    setITEMS_PER_PAGE(event.target.value)
    return
  }

  return (
    <>
      <Panel
        className="box-table-main"
        style={{
          marginTop: '6px',
          zIndex: 1,
          backgroundColor: theme.bgTable,
          border: 0,
          padding: 0,
          minHeight: 302,
        }}
      >
        <ListWrapper>
          <DashGrid center={true} style={{ height: 'fit-content', padding: '1rem 1.125rem 1rem 1.125rem' }}>
            <Flex alignItems="center" className="justify-content-center w-100 text-center f-20 font-weight-bold">
              <ClickableText
                color="text"
                area="name"
                fontWeight="700"
                onClick={(e) => {
                  setSortedColumn(SORT_FIELD.NAME)
                  setSortDirection(sortedColumn !== SORT_FIELD.NAME ? true : !sortDirection)
                }}
                className="f-20"
              >
                {t('Name')}
                {sortedColumn === SORT_FIELD.NAME ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
            <Flex alignItems="center">
              <ClickableText
                area="symbol"
                className="justify-content-center w-100 text-center f-20 font-weight-bold"
                onClick={() => {
                  setSortedColumn(SORT_FIELD.SYMBOL)
                  setSortDirection(sortedColumn !== SORT_FIELD.SYMBOL ? true : !sortDirection)
                }}
              >
                {t('Symbol')}
                {sortedColumn === SORT_FIELD.SYMBOL ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>

            <Flex alignItems="center">
              <ClickableText
                area="liq"
                className="justify-content-center w-100 text-center f-20 font-weight-bold"
                onClick={(e) => {
                  setSortedColumn(SORT_FIELD.LIQ)
                  setSortDirection(sortedColumn !== SORT_FIELD.LIQ ? true : !sortDirection)
                }}
              >
                {t('Liquidity')}
                {sortedColumn === SORT_FIELD.LIQ ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
            <Flex alignItems="center">
              <ClickableText
                area="vol"
                className="justify-content-center w-100 text-center f-20 font-weight-bold"
                onClick={() => {
                  setSortedColumn(useTracked ? SORT_FIELD.VOL_UT : SORT_FIELD.VOL)
                  setSortDirection(
                    sortedColumn !== (useTracked ? SORT_FIELD.VOL_UT : SORT_FIELD.VOL) ? true : !sortDirection
                  )
                }}
              >
                {t('Volume (24h)')}
                {sortedColumn === (useTracked ? SORT_FIELD.VOL_UT : SORT_FIELD.VOL) ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
            <Flex alignItems="center">
              <ClickableText
                area="price"
                className="justify-content-center w-100 text-center f-20 font-weight-bold"
                onClick={(e) => {
                  setSortedColumn(SORT_FIELD.PRICE)
                  setSortDirection(sortedColumn !== SORT_FIELD.PRICE ? true : !sortDirection)
                }}
              >
                {t('Price')} {sortedColumn === SORT_FIELD.PRICE ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
            <Flex alignItems="center">
              <ClickableText
                area="change"
                className="justify-content-center w-100 text-center f-20 font-weight-bold"
                onClick={(e) => {
                  setSortedColumn(SORT_FIELD.CHANGE)
                  setSortDirection(sortedColumn !== SORT_FIELD.CHANGE ? true : !sortDirection)
                }}
              >
                {t('Price Change (24h)')}
                {sortedColumn === SORT_FIELD.CHANGE ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
          </DashGrid>
          <Divider />
          <List p={0}>
            {filteredList &&
              filteredList.map((item, index) => {
                return (
                  // <div key={index} className={index % 2 && isDarkMode ? 'table-row-dark-mode' : 'table-row-light-mode'}>
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
                    <ListItem key={index} index={(page - 1) * ITEMS_PER_PAGE + index + 1} item={item} />
                    <Divider />
                  </div>
                )
              })}
          </List>
        </ListWrapper>
      </Panel>
      {filteredList && (
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

export default withRouter(TopTokenList)
