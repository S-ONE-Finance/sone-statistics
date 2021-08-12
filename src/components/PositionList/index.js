import React, { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import dayjs from 'dayjs'
import LocalLoader from '../LocalLoader'
import utc from 'dayjs/plugin/utc'
import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components'
import Link, { CustomLink } from '../Link'
import { Divider } from '../../components'
import DoubleTokenLogo from '../DoubleLogo'
import { withRouter } from 'react-router-dom'
import { formattedNum, getPoolLink } from '../../utils'
import { AutoColumn } from '../Column'
import { useEthPrice } from '../../contexts/GlobalData'
import { RowFixed } from '../Row'
import { ButtonLight } from '../ButtonStyled'
import { TYPE } from '../../theme'
import FormattedName from '../FormattedName'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import { Pagination } from '@material-ui/lab'
import { useTranslation } from 'react-i18next'

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
  grid-template-columns: 5px 0.5fr 1fr 1fr;
  grid-template-areas: 'number name uniswap return';
  align-items: flex-start;
  padding: 20px 0;

  > * {
    justify-content: flex-end;
    width: 100%;

    :first-child {
      justify-content: flex-start;
      text-align: left;
      width: 20px;
    }
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 0.25fr 1fr 1fr 1fr;
    grid-template-areas: 'number name uniswap return';
  }

  @media screen and (max-width: 740px) {
    grid-template-columns: 2.5fr 1fr 1fr;
    grid-template-areas: 'name uniswap return';
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 2.5fr 1fr;
    grid-template-areas: 'name uniswap';
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
    font-size: 1em;
  }

  @media screen and (max-width: 600px) {
    font-size: 13px;
  }
`

const SORT_FIELD = {
  VALUE: 'VALUE',
  UNISWAP_RETURN: 'UNISWAP_RETURN',
}

function PositionList({ positions }) {
  const below500 = useMedia('(max-width: 500px)')
  const below740 = useMedia('(max-width: 740px)')
  const { t, i18n } = useTranslation()
  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.VALUE)
  // status mode theme page
  const [isDarkMode] = useDarkModeManager()
  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [positions])

  useEffect(() => {
    if (positions) {
      let extraPages = 1
      if (positions.length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(positions.length / ITEMS_PER_PAGE) + extraPages || 1)
    }
  }, [positions])

  const [ethPrice] = useEthPrice()

  const ListItem = ({ position, index }) => {
    const poolOwnership = position.liquidityTokenBalance / position.pair.totalSupply
    const valueUSD = poolOwnership * position.pair.reserveUSD

    return (
      <DashGrid style={{ opacity: poolOwnership > 0 ? 1 : 0.6 }} focus={true}>
        {!below740 && (
          <DataText className="m-auto" area="number">
            {index}
          </DataText>
        )}
        <DataText area="name" justifyContent="flex-start" alignItems="flex-start">
          <AutoColumn gap="8px" justify="flex-start" align="flex-start">
            <DoubleTokenLogo size={16} a0={position.pair.token0.id} a1={position.pair.token1.id} margin={!below740} />
          </AutoColumn>
          <AutoColumn gap="8px" justify="flex-start" style={{ marginLeft: '20px' }}>
            <CustomLink to={'/swap/pair/' + position.pair.id}>
              <TYPE.main style={{ whiteSpace: 'nowrap' }} to={'/swap/pair/'}>
                <FormattedName
                  text={position.pair.token0.symbol + '-' + position.pair.token1.symbol}
                  maxCharacters={below740 ? 10 : 18}
                />
              </TYPE.main>
            </CustomLink>

            <RowFixed gap="8px" justify="flex-start">
              <Link
                external
                href={getPoolLink(position.pair.token0.id, position.pair.token1.id)}
                style={{ marginRight: '.5rem' }}
              >
                <ButtonLight
                  className="btn-danger minw-auto h-auto"
                  style={{ padding: '4px 6px', borderRadius: '4px' }}
                >
                  Add
                </ButtonLight>
              </Link>
              {poolOwnership > 0 && (
                <Link external href={getPoolLink(position.pair.token0.id, position.pair.token1.id, true)}>
                  <ButtonLight
                    className="btn-secondary minw-auto h-auto text-white"
                    style={{ padding: '4px 6px', borderRadius: '4px' }}
                  >
                    Withdraw
                  </ButtonLight>
                </Link>
              )}
            </RowFixed>
          </AutoColumn>
        </DataText>
        <DataText area="uniswap" className="justify-content-center">
          <AutoColumn gap="12px" justify="center">
            <TYPE.main fontSize={'16px'}>{formattedNum(valueUSD, true, true)}</TYPE.main>
            <AutoColumn gap="4px" justify="center">
              <RowFixed>
                <TYPE.small fontWeight={400}>
                  {formattedNum(poolOwnership * parseFloat(position.pair.reserve0))}{' '}
                </TYPE.small>
                <FormattedName
                  text={position.pair.token0.symbol}
                  maxCharacters={below740 ? 10 : 18}
                  margin={true}
                  fontSize={'13px'}
                />
              </RowFixed>
              <RowFixed>
                <TYPE.small fontWeight={400}>
                  {formattedNum(poolOwnership * parseFloat(position.pair.reserve1))}{' '}
                </TYPE.small>
                <FormattedName
                  text={position.pair.token1.symbol}
                  maxCharacters={below740 ? 10 : 18}
                  margin={true}
                  fontSize={'13px'}
                />
              </RowFixed>
            </AutoColumn>
          </AutoColumn>
        </DataText>
        {!below500 && (
          <DataText area="return" className="justify-content-center">
            <AutoColumn gap="12px" justify="center">
              <TYPE.main color={'green'}>
                <RowFixed fontSize={'16px'}>{formattedNum(position?.fees.sum, true, true)}</RowFixed>
              </TYPE.main>
              <AutoColumn gap="4px" justify="center">
                <RowFixed>
                  <TYPE.small fontWeight={400}>
                    {parseFloat(position.pair.token0.derivedETH)
                      ? formattedNum(
                          position?.fees.sum / (parseFloat(position.pair.token0.derivedETH) * ethPrice) / 2,
                          false,
                          true
                        )
                      : 0}{' '}
                  </TYPE.small>
                  <FormattedName
                    text={position.pair.token0.symbol}
                    maxCharacters={below740 ? 10 : 18}
                    margin={true}
                    fontSize={'13px'}
                  />
                </RowFixed>
                <RowFixed>
                  <TYPE.small fontWeight={400}>
                    {parseFloat(position.pair.token1.derivedETH)
                      ? formattedNum(
                          position?.fees.sum / (parseFloat(position.pair.token1.derivedETH) * ethPrice) / 2,
                          false,
                          true
                        )
                      : 0}{' '}
                  </TYPE.small>
                  <FormattedName
                    text={position.pair.token1.symbol}
                    maxCharacters={below740 ? 10 : 18}
                    margin={true}
                    fontSize={'13px'}
                  />
                </RowFixed>
              </AutoColumn>
            </AutoColumn>
          </DataText>
        )}
      </DashGrid>
    )
  }

  const positionsSorted =
    positions &&
    positions

      .sort((p0, p1) => {
        if (sortedColumn === SORT_FIELD.PRINCIPAL) {
          return p0?.principal?.usd > p1?.principal?.usd ? (sortDirection ? -1 : 1) : sortDirection ? 1 : -1
        }
        if (sortedColumn === SORT_FIELD.HODL) {
          return p0?.hodl?.sum > p1?.hodl?.sum ? (sortDirection ? -1 : 1) : sortDirection ? 1 : -1
        }
        if (sortedColumn === SORT_FIELD.UNISWAP_RETURN) {
          return p0?.uniswap?.return > p1?.uniswap?.return ? (sortDirection ? -1 : 1) : sortDirection ? 1 : -1
        }
        if (sortedColumn === SORT_FIELD.VALUE) {
          const bal0 = (p0.liquidityTokenBalance / p0.pair.totalSupply) * p0.pair.reserveUSD
          const bal1 = (p1.liquidityTokenBalance / p1.pair.totalSupply) * p1.pair.reserveUSD
          return bal0 > bal1 ? (sortDirection ? -1 : 1) : sortDirection ? 1 : -1
        }
        return 1
      })
      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
      .map((position, index) => {
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
            <ListItem key={index} index={(page - 1) * 10 + index + 1} position={position} />
            <Divider />
          </div>
        )
      })

  return (
    <>
      <ListWrapper
        style={{
          borderRadius: 25,
          overflow: 'hidden',
          boxShadow: '0px 8px 17px rgba(0, 0, 0, 0.18)',
          backgroundColor: isDarkMode ? '#0E2B4A' : '#F2F2F2',
        }}
      >
        <DashGrid center={true} style={{ padding: '1rem' }}>
          {!below740 && (
            <Flex alignItems="flex-start" className="justify-content-center m-auto">
              <TYPE.main area="number"></TYPE.main>
            </Flex>
          )}
          <Flex alignItems="flex-start" justifyContent="flex-start" className="h-100 align-items-center">
            <TYPE.main fontSize={'20px'} style={{ fontWeight: 'bold', width: 150, textAlign: 'center' }} area="number">
              {t('Name')}
            </TYPE.main>
          </Flex>
          <Flex alignItems="center" className="justify-content-center m-auto">
            <ClickableText
              area="uniswap"
              onClick={(e) => {
                setSortedColumn(SORT_FIELD.VALUE)
                setSortDirection(sortedColumn !== SORT_FIELD.VALUE ? true : !sortDirection)
              }}
              fontSize={'20px'}
              style={{ fontWeight: 'bold' }}
            >
              {t('Liquidity')}
            </ClickableText>
          </Flex>
          {!below500 && (
            <Flex alignItems="center" className="justify-content-center m-auto">
              <ClickableText
                area="return"
                onClick={() => {
                  setSortedColumn(SORT_FIELD.UNISWAP_RETURN)
                  setSortDirection(sortedColumn !== SORT_FIELD.UNISWAP_RETURN ? true : !sortDirection)
                }}
                fontSize={'20px'}
                style={{ fontWeight: 'bold' }}
              >
                {t('Total Fees Earned')}
              </ClickableText>
            </Flex>
          )}
        </DashGrid>
        <Divider />
        <List p={0}>{!positionsSorted ? <LocalLoader /> : positionsSorted}</List>
      </ListWrapper>
      <Pagination
        style={{ justifyContent: 'center' }}
        page={page}
        onChange={(event, newPage) => {
          setPage(newPage)
        }}
        count={maxPage}
        variant="outlined"
        shape="rounded"
        className="panigation-table-token-page"
      />
    </>
  )
}

export default withRouter(PositionList)
