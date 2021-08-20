import React, { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import dayjs from 'dayjs'
import LocalLoader from '../LocalLoader'
import utc from 'dayjs/plugin/utc'
import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components'

import { CustomLink } from '../Link'
import { Divider } from '../../components'
import { withRouter } from 'react-router-dom'
import { formattedNum, formattedPercent } from '../../utils'
import DoubleTokenLogo from '../DoubleLogo'
import FormattedName from '../FormattedName'
import QuestionHelper from '../QuestionHelper'
import { TYPE } from '../../theme'
import { PAIR_BLACKLIST } from '../../constants'
import { AutoColumn } from '../Column'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import { Pagination } from '@material-ui/lab'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.primary1};
  opacity: ${(props) => (props.faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 'name liq vol';
  padding: 0 1.125rem;

  opacity: ${({ fade }) => (fade ? '0.6' : '1')};

  > * {
    justify-content: flex-end;

    :first-child {
      justify-content: flex-start;
      text-align: left;
      width: 20px;
    }
  }

  @media screen and (min-width: 740px) {
    padding: 0 1.125rem;
    grid-template-columns: 1.5fr 1fr 1fr};
    grid-template-areas: ' name liq vol pool ';
  }

  @media screen and (min-width: 1080px) {
    padding: 0 1.125rem;
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: ' name liq vol volWeek fees apy';
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: ' name liq vol volWeek fees apy';
  }
`

const ListWrapper = styled.div``

const ClickableText = styled(Text)`
  color: ${({ theme }) => theme.text1};
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  text-align: end;
  user-select: none;
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.text1};

  & > * {
    font-size: 16px;
  }

  @media screen and (max-width: 600px) {
    font-size: 12px;
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
    width: 82,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
})

const SORT_FIELD = {
  LIQ: 0,
  VOL: 1,
  VOL_7DAYS: 3,
  FEES: 4,
  APY: 5,
}

const FIELD_TO_VALUE = (field, useTracked) => {
  switch (field) {
    case SORT_FIELD.LIQ:
      return useTracked ? 'trackedReserveUSD' : 'reserveUSD'
    case SORT_FIELD.VOL:
      return useTracked ? 'oneDayVolumeUSD' : 'oneDayVolumeUntracked'
    case SORT_FIELD.VOL_7DAYS:
      return useTracked ? 'oneWeekVolumeUSD' : 'oneWeekVolumeUntracked'
    case SORT_FIELD.FEES:
      return useTracked ? 'oneDayVolumeUSD' : 'oneDayVolumeUntracked'
    default:
      return 'trackedReserveUSD'
  }
}

const formatDataText = (value, trackedValue, supressWarning = false) => {
  const showUntracked = value !== '$0' && !trackedValue & !supressWarning
  return (
    <AutoColumn gap="2px" style={{ opacity: showUntracked ? '0.7' : '1' }}>
      <div style={{ textAlign: 'right' }}>{value}</div>
      <TYPE.light fontSize={'9px'} style={{ textAlign: 'right' }}>
        {showUntracked ? 'untracked' : '  '}
      </TYPE.light>
    </AutoColumn>
  )
}

function PairList({ pairs, color, disbaleLinks, maxItems = 10, useTracked = false }) {
  const below600 = useMedia('(max-width: 600px)')
  const below740 = useMedia('(max-width: 740px)')
  const below1080 = useMedia('(max-width: 1080px)')

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = maxItems
  const [isDarkMode] = useDarkModeManager()

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.LIQ)

  const classes = useStyles()
  // i18n
  const { t, i18n } = useTranslation()

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [pairs])

  useEffect(() => {
    if (pairs) {
      let extraPages = 1
      if (Object.keys(pairs).length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(Object.keys(pairs).length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [ITEMS_PER_PAGE, pairs])

  const ListItem = ({ pairAddress, index }) => {
    const pairData = pairs[pairAddress]
    if (pairData && pairData.token0 && pairData.token1) {
      const liquidity = formattedNum(
        !!pairData.trackedReserveUSD ? pairData.trackedReserveUSD : pairData.reserveUSD,
        true
      )

      const volume = formattedNum(
        pairData.oneDayVolumeUSD ? pairData.oneDayVolumeUSD : pairData.oneDayVolumeUntracked,
        true
      )

      const apy = formattedPercent(
        ((pairData.oneDayVolumeUSD ? pairData.oneDayVolumeUSD : pairData.oneDayVolumeUntracked) * 0.003 * 365 * 100) /
          (pairData.oneDayVolumeUSD ? pairData.trackedReserveUSD : pairData.reserveUSD)
      )

      const weekVolume = formattedNum(
        pairData.oneWeekVolumeUSD ? pairData.oneWeekVolumeUSD : pairData.oneWeekVolumeUntracked,
        true
      )

      const fees = formattedNum(
        pairData.oneDayVolumeUSD ? pairData.oneDayVolumeUSD * 0.003 : pairData.oneDayVolumeUntracked * 0.003,
        true
      )

      return (
        <DashGrid style={{ height: '48px' }} disbaleLinks={disbaleLinks} focus={true}>
          <DataText area="name" fontWeight="500">
            {!below600 && (
              <div
                style={{
                  marginRight: '20px',
                  width: '10px',
                  fontWeight: 400,
                  color: isDarkMode ? '#AAAAAA' : '#767676 ',
                }}
              >
                {index}
              </div>
            )}
            <DoubleTokenLogo
              size={below600 ? 16 : 20}
              a0={pairData.token0.id}
              a1={pairData.token1.id}
              margin={!below740}
            />
            <CustomLink
              style={{ marginLeft: '20px', whiteSpace: 'nowrap' }}
              to={'/swap/pair/' + pairAddress}
              color={isDarkMode ? '#fff' : '#333333'}
            >
              <FormattedName
                text={pairData.token0.symbol + '-' + pairData.token1.symbol}
                maxCharacters={below600 ? 8 : 16}
                adjustSize={true}
                link={true}
                className="text-dark"
              />
            </CustomLink>
          </DataText>
          <DataText
            area="liq"
            className="justify-content-center w-100"
            style={{ color: isDarkMode ? '#AAAAAA' : '#767676 ' }}
          >
            {formatDataText(liquidity, pairData.trackedReserveUSD)}
          </DataText>
          <DataText
            area="vol"
            className="justify-content-center w-100"
            style={{ color: isDarkMode ? '#AAAAAA' : '#767676 ' }}
          >
            {formatDataText(volume, pairData.oneDayVolumeUSD)}
          </DataText>
          {!below1080 && (
            <DataText
              area="volWeek"
              className="justify-content-center w-100"
              style={{ color: isDarkMode ? '#AAAAAA' : '#767676 ' }}
            >
              {formatDataText(weekVolume, pairData.oneWeekVolumeUSD)}
            </DataText>
          )}
          {!below1080 && (
            <DataText
              area="fees"
              className="justify-content-center w-100"
              style={{ color: isDarkMode ? '#AAAAAA' : '#767676 ' }}
            >
              {formatDataText(fees, pairData.oneDayVolumeUSD)}
            </DataText>
          )}
          {!below1080 && (
            <DataText
              area="apy"
              className="justify-content-center w-100"
              // style={{ color: isDarkMode ? '#AAAAAA' : '#767676 ' }}
            >
              {pairData.oneDayVolumeUSD ? (
                <p className="d-flex color-blue">
                  <span>{formatDataText(apy, pairData.oneDayVolumeUSD, pairData.oneDayVolumeUSD === 0)}</span>
                </p>
              ) : (
                <p className="d-flex color-blue">
                  <span>{formatDataText(apy, pairData.oneDayVolumeUSD, pairData.oneDayVolumeUSD === 0)}</span>
                </p>
              )}
              {/* {formatDataText(apy, pairData.oneDayVolumeUSD, pairData.oneDayVolumeUSD === 0)} */}
            </DataText>
          )}
        </DashGrid>
      )
    } else {
      return ''
    }
  }

  const pairList =
    pairs &&
    Object.keys(pairs)
      .filter(
        (address) => !PAIR_BLACKLIST.includes(address) && (useTracked ? !!pairs[address].trackedReserveUSD : true)
      )
      .sort((addressA, addressB) => {
        const pairA = pairs[addressA]
        const pairB = pairs[addressB]
        if (sortedColumn === SORT_FIELD.APY) {
          const apy0 = parseFloat(pairA.oneDayVolumeUSD * 0.003 * 356 * 100) / parseFloat(pairA.reserveUSD)
          const apy1 = parseFloat(pairB.oneDayVolumeUSD * 0.003 * 356 * 100) / parseFloat(pairB.reserveUSD)
          return apy0 > apy1 ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
        }
        return parseFloat(pairA[FIELD_TO_VALUE(sortedColumn, useTracked)]) >
          parseFloat(pairB[FIELD_TO_VALUE(sortedColumn, useTracked)])
          ? (sortDirection ? -1 : 1) * 1
          : (sortDirection ? -1 : 1) * -1
      })
      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
      .map((pairAddress, index) => {
        return (
          pairAddress && (
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
              <ListItem key={index} index={(page - 1) * ITEMS_PER_PAGE + index + 1} pairAddress={pairAddress} />
              <Divider />
            </div>
          )
        )
      })

  // console.log('pairList', pairList);
  return (
    <>
      <ListWrapper className={isDarkMode ? 'isBgTableDark' : 'isBgTableLight'} style={{ minHeight: '550px' }}>
        <DashGrid center={true} disbaleLinks={disbaleLinks} style={{ height: 'fit-content', padding: '20px' }}>
          <Flex alignItems="center" className="justify-content-center w-100 f-20 font-weight-bold">
            <TYPE.main area="name" style={{ fontWeight: 'bold', fontSize: 20 }}>
              {t('Name')}
            </TYPE.main>
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="center"
            className="justify-content-center w-100  f-20 font-weight-bold"
          >
            <ClickableText
              area="liq"
              style={{ fontWeight: 'bold' }}
              onClick={(e) => {
                setSortedColumn(SORT_FIELD.LIQ)
                setSortDirection(sortedColumn !== SORT_FIELD.LIQ ? true : !sortDirection)
              }}
            >
              {t('Liquidity')}
            </ClickableText>
          </Flex>
          <Flex alignItems="center" className="justify-content-center w-100 f-20 font-weight-bold">
            <ClickableText
              area="vol"
              style={{ fontWeight: 'bold' }}
              onClick={(e) => {
                setSortedColumn(SORT_FIELD.VOL)
                setSortDirection(sortedColumn !== SORT_FIELD.VOL ? true : !sortDirection)
              }}
            >
              {t('Volume (24h)')}
              {sortedColumn === SORT_FIELD.VOL ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
          {!below1080 && (
            <Flex alignItems="center" className="justify-content-center w-100 f-20 font-weight-bold">
              <ClickableText
                style={{ fontWeight: 'bold' }}
                area="volWeek"
                onClick={(e) => {
                  setSortedColumn(SORT_FIELD.VOL_7DAYS)
                  setSortDirection(sortedColumn !== SORT_FIELD.VOL_7DAYS ? true : !sortDirection)
                }}
              >
                {t('Volume (7d)')} {sortedColumn === SORT_FIELD.VOL_7DAYS ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
          )}
          {!below1080 && (
            <Flex alignItems="center" className="justify-content-center w-100  f-20 font-weight-bold">
              <ClickableText
                area="fees"
                style={{ fontWeight: 'bold' }}
                onClick={(e) => {
                  setSortedColumn(SORT_FIELD.FEES)
                  setSortDirection(sortedColumn !== SORT_FIELD.FEES ? true : !sortDirection)
                }}
              >
                {t('Fees (24hr)')} {sortedColumn === SORT_FIELD.FEES ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </Flex>
          )}
          {!below1080 && (
            <Flex alignItems="center" className="justify-content-center w-100 f-20 font-weight-bold">
              <ClickableText
                area="apy"
                style={{ fontWeight: 'bold' }}
                onClick={(e) => {
                  setSortedColumn(SORT_FIELD.APY)
                  setSortDirection(sortedColumn !== SORT_FIELD.APY ? true : !sortDirection)
                }}
              >
                {t('1y Fees / Liquidity')} {sortedColumn === SORT_FIELD.APY ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
              {/* <QuestionHelper text={'Based on 24hr volume annualized'} /> */}
            </Flex>
          )}
        </DashGrid>
        <Divider />
        <List p={0}>{!pairList ? <LocalLoader /> : pairList}</List>
      </ListWrapper>
      {pairList && (
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
          <div className={classes.boxNavigation} style={{ color: isDarkMode ? '#fff' : '#767676', fontSize: 14 }}>
            {pairList.length}/page
          </div>
        </div>
      )}
    </>
  )
}

export default withRouter(PairList)
