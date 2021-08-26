import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { formattedNum, formatTime, urls } from '../../utils'
import { useMedia } from 'react-use'
import { useCurrentCurrency } from '../../contexts/Application'
import { RowBetween, RowFixed } from '../Row'

import LocalLoader from '../LocalLoader'
import { Box, Flex, Text } from 'rebass'
import Link from '../Link'
import { Divider, EmptyCard } from '..'
import DropdownSelect from '../DropdownSelect'
import FormattedName from '../FormattedName'
import { TYPE } from '../../theme'
import { updateNameData } from '../../utils/data'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import { Pagination } from '@material-ui/lab'
import { ETHERSCAN_BASE_URL } from '../../constants/urls'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

dayjs.extend(utc)

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 'txn value time';

  > * {
    justify-content: flex-end;
    width: 100%;

    &:first-child {
      justify-content: flex-start;
      text-align: left;Transactions
      width: 100px;
    }
  }

  @media screen and (min-width: 500px) {
    > * {
      &:first-child {
        width: 180px;
      }
    }
  }

  @media screen and (min-width: 780px) {
    max-width: 1320px;
    grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'txn value amountToken amountOther time';

    > * {
      &:first-child {
        width: 180px;
      }
    }
  }

  @media screen and (min-width: 1080px) {
    max-width: 1320px;
    grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'txn value amountToken amountOther account time';
  }
`

const ClickableText = styled(Text)`
  color: ${({ theme }) => theme.text1};
  user-select: none;
  text-align: end;

  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }

  @media screen and (max-width: 640px) {
    font-size: 14px;
  }
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: right;
  color: ${({ theme }) => theme.text1};

  & > * {
    font-size: 1em;
  }

  @media screen and (max-width: 40em) {
    font-size: 0.85rem;
  }
`

const SortText = styled.button`
  cursor: pointer;
  font-weight: ${({ active, theme }) => (active ? 500 : 400)};
  margin-right: 0.75rem !important;
  border: none;
  background-color: transparent;
  font-size: 1rem;
  padding: 0px;
  color: ${({ active, theme }) => (active ? theme.text1 : theme.text3)};
  outline: none;

  @media screen and (max-width: 600px) {
    font-size: 14px;
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

const SORT_FIELD = {
  VALUE: 'amountUSD',
  AMOUNT0: 'token0Amount',
  AMOUNT1: 'token1Amount',
  TIMESTAMP: 'timestamp',
}

const TXN_TYPE = {
  ALL: 'All',
  SWAP: 'Swaps',
  ADD: 'Adds',
  REMOVE: 'Removes',
}

function getTransactionType(event, symbol0, symbol1) {
  const formattedS0 = symbol0?.length > 8 ? symbol0.slice(0, 7) + '...' : symbol0
  const formattedS1 = symbol1?.length > 8 ? symbol1.slice(0, 7) + '...' : symbol1
  switch (event) {
    case TXN_TYPE.ADD:
      return 'Add ' + formattedS0 + ' and ' + formattedS1
    case TXN_TYPE.REMOVE:
      return 'Remove ' + formattedS0 + ' and ' + formattedS1
    case TXN_TYPE.SWAP:
      return 'Swap ' + formattedS0 + ' for ' + formattedS1
    default:
      return ''
  }
}

// @TODO rework into virtualized list
function TxnList({ transactions, symbol0Override, symbol1Override, color }) {
  // page state
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.TIMESTAMP)
  const [filteredItems, setFilteredItems] = useState()
  const [txFilter, setTxFilter] = useState(TXN_TYPE.ALL)
  const [isDarkMode] = useDarkModeManager()
  const [currency] = useCurrentCurrency()
  const { t } = useTranslation()
  const classes = useStyles()

  const [ITEMS_PER_PAGE, SET_ITEMS_PER_PAGE] = useState(5)

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [transactions])

  // parse the txns and format for UI
  useEffect(() => {
    if (transactions && transactions.mints && transactions.burns && transactions.swaps) {
      let newTxns = []
      if (transactions.mints.length > 0) {
        transactions.mints.map((mint) => {
          let newTxn = {}
          newTxn.hash = mint.transaction.id
          newTxn.timestamp = mint.transaction.timestamp
          newTxn.type = TXN_TYPE.ADD
          newTxn.token0Amount = mint.amount0
          newTxn.token1Amount = mint.amount1
          newTxn.account = mint.to
          newTxn.token0Symbol = updateNameData(mint.pair).token0.symbol
          newTxn.token1Symbol = updateNameData(mint.pair).token1.symbol
          newTxn.amountUSD = mint.amountUSD
          return newTxns.push(newTxn)
        })
      }
      if (transactions.burns.length > 0) {
        transactions.burns.map((burn) => {
          let newTxn = {}
          newTxn.hash = burn.transaction.id
          newTxn.timestamp = burn.transaction.timestamp
          newTxn.type = TXN_TYPE.REMOVE
          newTxn.token0Amount = burn.amount0
          newTxn.token1Amount = burn.amount1
          newTxn.account = burn.sender
          newTxn.token0Symbol = updateNameData(burn.pair).token0.symbol
          newTxn.token1Symbol = updateNameData(burn.pair).token1.symbol
          newTxn.amountUSD = burn.amountUSD
          return newTxns.push(newTxn)
        })
      }
      if (transactions.swaps.length > 0) {
        transactions.swaps.map((swap) => {
          const netToken0 = swap.amount0In - swap.amount0Out
          const netToken1 = swap.amount1In - swap.amount1Out

          let newTxn = {}

          if (netToken0 < 0) {
            newTxn.token0Symbol = updateNameData(swap.pair).token0.symbol
            newTxn.token1Symbol = updateNameData(swap.pair).token1.symbol
            newTxn.token0Amount = Math.abs(netToken0)
            newTxn.token1Amount = Math.abs(netToken1)
          } else if (netToken1 < 0) {
            newTxn.token0Symbol = updateNameData(swap.pair).token1.symbol
            newTxn.token1Symbol = updateNameData(swap.pair).token0.symbol
            newTxn.token0Amount = Math.abs(netToken1)
            newTxn.token1Amount = Math.abs(netToken0)
          }

          newTxn.hash = swap.transaction.id
          newTxn.timestamp = swap.transaction.timestamp
          newTxn.type = TXN_TYPE.SWAP

          newTxn.amountUSD = swap.amountUSD
          newTxn.account = swap.to
          return newTxns.push(newTxn)
        })
      }

      const filtered = newTxns.filter((item) => {
        if (txFilter !== TXN_TYPE.ALL) {
          return item.type === txFilter
        }
        return true
      })
      setFilteredItems(filtered)
      let extraPages = 1
      if (filtered.length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      if (filtered.length === 0) {
        setMaxPage(1)
      } else {
        setMaxPage(Math.floor(filtered.length / ITEMS_PER_PAGE) + extraPages)
      }
    }
  }, [ITEMS_PER_PAGE, transactions, txFilter])

  useEffect(() => {
    setPage(1)
  }, [txFilter])

  const filteredList =
    filteredItems &&
    filteredItems
      .sort((a, b) => {
        return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn])
          ? (sortDirection ? -1 : 1) * 1
          : (sortDirection ? -1 : 1) * -1
      })
      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)

  const below1080 = useMedia('(max-width: 1080px)')
  const below780 = useMedia('(max-width: 780px)')

  const ListItem = ({ item }) => {
    return (
      <DashGrid style={{ height: '48px' }}>
        <DataText area="txn" fontWeight="400" className="justify-content-center w-100">
          <Link color="#3FAAB0" external href={urls.showTransaction(item.hash)}>
            {getTransactionType(item.type, item.token1Symbol, item.token0Symbol)}
          </Link>
        </DataText>
        <DataText area="value" style={{ justifyContent: 'center', color: isDarkMode ? '#AAAAAA' : '#767676 ' }}>
          {currency === 'ETH' ? 'Ξ ' + formattedNum(item.valueETH) : formattedNum(item.amountUSD, true)}
        </DataText>
        {!below780 && (
          <>
            <DataText
              area="amountOther"
              style={{ justifyContent: 'center', color: isDarkMode ? '#AAAAAA' : '#767676 ' }}
            >
              {formattedNum(item.token1Amount) + ' '}{' '}
              <FormattedName
                style={{ color: isDarkMode ? '#AAAAAA' : '#767676 ' }}
                text={item.token1Symbol}
                maxCharacters={5}
                margin={true}
              />
            </DataText>
            <DataText
              area="amountToken"
              style={{ justifyContent: 'center', color: isDarkMode ? '#AAAAAA' : '#767676 ' }}
            >
              {formattedNum(item.token0Amount) + ' '}{' '}
              <FormattedName
                style={{ color: isDarkMode ? '#AAAAAA' : '#767676 ' }}
                text={item.token0Symbol}
                maxCharacters={5}
                margin={true}
              />
            </DataText>
          </>
        )}
        {!below1080 && (
          <DataText area="account" style={{ justifyContent: 'center' }}>
            <Link color="#3FAAB0" external href={ETHERSCAN_BASE_URL + '/address/' + item.account}>
              {item.account && item.account.slice(0, 6) + '...' + item.account.slice(38, 42)}
            </Link>
          </DataText>
        )}
        <DataText area="time" style={{ justifyContent: 'center', color: isDarkMode ? '#AAAAAA' : '#767676 ' }}>
          {formatTime(item.timestamp)}
        </DataText>
      </DashGrid>
    )
  }

  const handleChangePagePagination = (event) => {
    SET_ITEMS_PER_PAGE(event.target.value)
  }

  return (
    <>
      <div className={isDarkMode ? 'isBgTableDark' : 'isBgTableLight'} style={{ borderRadius: 15, minHeight: 302 }}>
        <DashGrid center={true} style={{ height: 'fit-content', padding: '1rem' }}>
          {below780 ? (
            <RowBetween area="txn">
              <DropdownSelect
                style={{ border: 0 }}
                options={TXN_TYPE}
                active={txFilter}
                setActive={setTxFilter}
                color={color}
              />
            </RowBetween>
          ) : (
            <RowFixed area="txn" gap="10px" pl={4}>
              <SortText
                onClick={() => {
                  setTxFilter(TXN_TYPE.ALL)
                }}
                active={txFilter === TXN_TYPE.ALL}
                style={{ fontWeight: 'bold' }}
                className="f-20"
              >
                {t('All')}
              </SortText>
              <SortText
                onClick={() => {
                  setTxFilter(TXN_TYPE.SWAP)
                }}
                active={txFilter === TXN_TYPE.SWAP}
                style={{ fontWeight: 'bold' }}
                className="f-20"
              >
                {t('Swaps')}
              </SortText>
              <SortText
                onClick={() => {
                  setTxFilter(TXN_TYPE.ADD)
                }}
                active={txFilter === TXN_TYPE.ADD}
                style={{ fontWeight: 'bold' }}
                className="f-20"
              >
                {t('Adds')}
              </SortText>
              <SortText
                onClick={() => {
                  setTxFilter(TXN_TYPE.REMOVE)
                }}
                active={txFilter === TXN_TYPE.REMOVE}
                style={{ fontWeight: 'bold' }}
                className="f-20"
              >
                {t('Withdraw')}
              </SortText>
            </RowFixed>
          )}

          <Flex alignItems="center" justifyContent="center">
            <ClickableText
              color="textDim"
              area="value"
              style={{ fontWeight: 'bold' }}
              className="f-20"
              onClick={(e) => {
                setSortedColumn(SORT_FIELD.VALUE)
                setSortDirection(sortedColumn !== SORT_FIELD.VALUE ? true : !sortDirection)
              }}
            >
              {t('Total Value')}
              {sortedColumn === SORT_FIELD.VALUE ? (sortDirection ? '↓' : '↑') : ''}
            </ClickableText>
          </Flex>
          {!below780 && (
            <Flex alignItems="center" justifyContent="center">
              <ClickableText
                area="amountToken"
                color="textDim"
                style={{ fontWeight: 'bold' }}
                className="f-20"
                onClick={() => {
                  setSortedColumn(SORT_FIELD.AMOUNT0)
                  setSortDirection(sortedColumn !== SORT_FIELD.AMOUNT0 ? true : !sortDirection)
                }}
              >
                {symbol0Override ? symbol0Override + ' Amount' : `${t('Token Amount')}`}
                {''}
                {sortedColumn === SORT_FIELD.AMOUNT0 ? (sortDirection ? '↓' : '↑') : ''}
              </ClickableText>
            </Flex>
          )}
          <>
            {!below780 && (
              <Flex alignItems="center" justifyContent="center">
                <ClickableText
                  area="amountOther"
                  color="textDim"
                  style={{ fontWeight: 'bold' }}
                  className="f-20"
                  onClick={() => {
                    setSortedColumn(SORT_FIELD.AMOUNT1)
                    setSortDirection(sortedColumn !== SORT_FIELD.AMOUNT1 ? true : !sortDirection)
                  }}
                >
                  {symbol1Override ? symbol1Override + ' Amount' : `${t('Token Amount')}`}
                  {''}
                  {sortedColumn === SORT_FIELD.AMOUNT1 ? (sortDirection ? '↓' : '↑') : ''}
                </ClickableText>
              </Flex>
            )}
            {!below1080 && (
              <Flex alignItems="center" justifyContent="center">
                <TYPE.body area="account" style={{ fontWeight: 'bold', fontSize: 20 }}>
                  {t('Accounts')}
                </TYPE.body>
              </Flex>
            )}
            <Flex alignItems="center" justifyContent="center">
              <ClickableText
                area="time"
                color="textDim"
                onClick={() => {
                  setSortedColumn(SORT_FIELD.TIMESTAMP)
                  setSortDirection(sortedColumn !== SORT_FIELD.TIMESTAMP ? true : !sortDirection)
                }}
                className="f-20"
                style={{ fontWeight: 'bold' }}
              >
                {t('Time')}
                {sortedColumn === SORT_FIELD.TIMESTAMP ? (sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
          </>
        </DashGrid>
        <Divider />
        <List p={0}>
          {!filteredList ? (
            <LocalLoader />
          ) : filteredList.length === 0 ? (
            <EmptyCard>No recent transactions found.</EmptyCard>
          ) : (
            filteredList.map((item, index) => {
              return (
                // <div key={index} >
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
                  style={{ padding: '0 1rem' }}
                >
                  <ListItem key={index} index={index + 1} item={item} />
                  <Divider />
                </div>
              )
            })
          )}
        </List>
      </div>
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
          />
          <Select
            className={classes.boxNavigation}
            style={{ color: isDarkMode ? '#fff' : '#767676', fontSize: 14 }}
            labelId="demo-customized-select-label"
            id="demo-customized-select"
            value={ITEMS_PER_PAGE}
            onChange={handleChangePagePagination}
          >
            <MenuItem value={5}>5/Page</MenuItem>
            <MenuItem value={10}>10/Page</MenuItem>
            <MenuItem value={100}>100/Page</MenuItem>
          </Select>
        </div>
      )}
    </>
  )
}

export default TxnList
