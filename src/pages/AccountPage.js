import React, { useState, useMemo, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useUserTransactions, useUserPositions, useMiningPositions } from '../contexts/User'
import TxnList from '../components/TxnList'
import Panel from '../components/Panel'
import { formattedNum } from '../utils'
import Row, { AutoRow, RowFixed, RowBetween } from '../components/Row'
import { AutoColumn } from '../components/Column'
import UserChart from '../components/UserChart'
import PairReturnsChart from '../components/PairReturnsChart'
import PositionList from '../components/PositionList'
import MiningPositionList from '../components/MiningPositionList'
import { TYPE } from '../theme'
import { ButtonDropdown, ButtonLight } from '../components/ButtonStyled'
import { PageWrapper, ContentWrapper, StyledIcon } from '../components'
import DoubleTokenLogo from '../components/DoubleLogo'
import { Bookmark, Activity } from 'react-feather'
import Link from '../components/Link'
import { FEE_WARNING_TOKENS } from '../constants'
import { BasicLink } from '../components/Link'
import { useMedia } from 'react-use'
import Search from '../components/Search'
import { useSavedAccounts } from '../contexts/LocalStorage'
import { useDarkModeManager } from '../contexts/LocalStorage'
import { ETHERSCAN_BASE_URL } from '../constants/urls'
import { useTranslation } from 'react-i18next'

const StyledPanel = styled(Panel)`
  margin-top: 1.5rem !important;
  padding: 0;
  background-color: transparent;
  box-shadow: none;
  border: 0;
`
const StyleAutoColumn = styled(AutoColumn)`
  margin-left: 10% !important;

  @media (max-width: 800px) {
    display: flex;
    width: fit-content;
    justify-content: space-between;
    grid-column-gap: 20px;
    :first-child {
      margin-left: 20px !important;
    }
    margin-left: 0% !important;
  }
`

const AccountWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 6px 16px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Header = styled.div``

const DashboardWrapper = styled.div`
  width: 100%;
`

const DropdownWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
  border: 1px solid #edeef2;
  border-radius: 12px;
`

const Flyout = styled.div`
  position: absolute;
  top: 38px;
  left: -1px;
  width: 100%;
  background-color: ${({ theme }) => theme.bg1};
  z-index: 999;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding-top: 4px;
  border: 1px solid #edeef2;
  border-top: none;
`

const MenuRow = styled(Row)`
  width: 100%;
  padding: 12px 0;
  padding-left: 12px;

  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg2};
  }
`

const PanelWrapper = styled.div`
  grid-template-columns: 1fr;
  grid-template-rows: max-content;
  gap: 6px;
  display: inline-grid;
  width: 100%;
  align-items: start;
`

const Warning = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  padding: 1rem;
  font-weight: 600;
  border-radius: 10px;
  margin-bottom: 1rem;
  width: calc(100% - 2rem);
`

function AccountPage({ account }) {
  // get data for this account
  const transactions = useUserTransactions(account)
  const positions = useUserPositions(account)
  const miningPositions = useMiningPositions(account)
  const { t, i18n } = useTranslation()
  // get data for user stats
  const transactionCount = transactions?.swaps?.length + transactions?.burns?.length + transactions?.mints?.length

  // get derived totals
  let totalSwappedUSD = useMemo(() => {
    return transactions?.swaps
      ? transactions?.swaps.reduce((total, swap) => {
          return total + parseFloat(swap.amountUSD)
        }, 0)
      : 0
  }, [transactions])

  // if any position has token from fee warning list, show warning
  const [showWarning, setShowWarning] = useState(false)
  useEffect(() => {
    if (positions) {
      for (let i = 0; i < positions.length; i++) {
        if (
          FEE_WARNING_TOKENS.includes(positions[i].pair.token0.id) ||
          FEE_WARNING_TOKENS.includes(positions[i].pair.token1.id)
        ) {
          setShowWarning(true)
        }
      }
    }
  }, [positions])

  // settings for list view and dropdowns
  const hideLPContent = positions && positions.length === 0
  const [showDropdown, setShowDropdown] = useState(false)
  const [activePosition, setActivePosition] = useState()

  const dynamicPositions = activePosition ? [activePosition] : positions

  const aggregateFees = dynamicPositions?.reduce(function (total, position) {
    return total + position.fees.sum
  }, 0)

  const positionValue = useMemo(() => {
    return dynamicPositions
      ? dynamicPositions.reduce((total, position) => {
          return (
            total +
            (parseFloat(position?.liquidityTokenBalance) / parseFloat(position?.pair?.totalSupply)) *
              position?.pair?.reserveUSD
          )
        }, 0)
      : null
  }, [dynamicPositions])

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

  const below600 = useMedia('(max-height: 600px)')

  // adding/removing account from saved accounts
  const [savedAccounts, addAccount, removeAccount] = useSavedAccounts()
  const isBookmarked = savedAccounts.includes(account)
  const handleBookmarkClick = useCallback(() => {
    ;(isBookmarked ? removeAccount : addAccount)(account)
  }, [account, isBookmarked, addAccount, removeAccount])

  // status theme mode
  const [isDarkMode] = useDarkModeManager()

  const StyleAutoRow = styled(AutoRow)`
    box-shadow: 0px 8px 17px rgba(0, 0, 0, 0.18);
    background-color: ${isDarkMode ? '#0E2B4A' : '#F2F2F2'};
    border-radius: 15px;
    flex-wrap: wrap;
    margin: auto;
    @media (max-width: 800px) {
      flex-direction: column;
      align-items: flex-start;
      grid-column-gap: 20px;
    }
  `

  const StylePanel = styled(Panel)`
    grid-column: 1;
    border: 0;
    background-color: ${isDarkMode ? '#0E2B4A' : '#F2F2F2'};
    box-shadow: 0px 8px 17px rgba(0, 0, 0, 0.18);
  `
  const StylePanelBlockPosition = styled(Panel)`
    flex-wrap: wrap;
    margin: auto;
    box-shadow: none;
    margin-top: 1.5rem;
    border: 0;
    background-color: transparent;
    padding: 0;
  `

  const TitlteTop = styled(TYPE.main)`
    margin-top: 3rem !important;
    margin-bottom: 1.125rem !important;
  `

  const StyleTitle = styled(TYPE.body)`
    color: ${isDarkMode ? '#AAAAAA' : '#767676'}
    font-size: 20px;
    @media(max-width: 600px){
      font-size: 13px;
    }
  `

  const StyleContentBottom = styled(TYPE.header)`
    color: ${isDarkMode ? '#FFFFF' : '#767676'}
    font-size: 24px;
    @media(max-width: 600px){
      font-size: 16px;
    }
  `
  const StyleAutoRow2 = styled(AutoRow)`
    margin: 0px !important;
    justify-content: space-between;
  `

  const StylePanel2 = styled(Panel)`
    height: 100%;
    margin-bottom: 35px !important;
    border: 0;
    background-color: ${isDarkMode ? '#0E2B4A !important' : '#F2F2F2 !important'};
    padding: 1.25rem !important;
    box-shadow: none !important;
    // margin: -20px ;
    @media (max-width: 600px) {
      margin-bottom: 15px !important;
    }
  `

  return (
    <PageWrapper>
      <ContentWrapper style={{ zIndex: 1 }}>
        <RowBetween>
          <TYPE.body>
            <BasicLink to="/swap/accounts">{t('Accounts')}</BasicLink>→
            <Link lineHeight={'145.23%'} href={ETHERSCAN_BASE_URL + '/address/' + account} target="_blank">
              {account?.slice(0, 42)}
            </Link>
          </TYPE.body>
          {!below600 && <Search small={true} />}
        </RowBetween>
        <Header>
          <RowBetween>
            <span>
              <TYPE.header fontSize={24}>{account?.slice(0, 6) + '...' + account?.slice(38, 42)}</TYPE.header>
              <Link lineHeight={'145.23%'} href={ETHERSCAN_BASE_URL + '/address/' + account} target="_blank">
                <TYPE.main
                  className="btn-danger"
                  fontSize={16}
                  style={{ margin: !below600 ? '15px 0 35px' : '15px 0' }}
                >
                  {t('View on Etherscan')}
                </TYPE.main>
              </Link>
            </span>
            <AccountWrapper>
              <StyledIcon>
                <Bookmark
                  onClick={handleBookmarkClick}
                  style={{ opacity: isBookmarked ? 0.8 : 0.4, cursor: 'pointer' }}
                />
              </StyledIcon>
            </AccountWrapper>
          </RowBetween>
        </Header>
        <DashboardWrapper>
          {showWarning && <Warning>Fees cannot currently be calculated for pairs that include AMPL.</Warning>}
          {!hideLPContent && (
            <DropdownWrapper
              style={{
                border: 0,
                borderRadius: 25,
                backgroundColor: '#F3F3F3',
                marginBottom: !below600 ? '35px' : '15px',
              }}
            >
              <ButtonDropdown
                style={{ border: 0, backgroundColor: 'transparent' }}
                width="100%"
                onClick={() => setShowDropdown(!showDropdown)}
                open={showDropdown}
              >
                {!activePosition && (
                  <RowFixed>
                    <StyledIcon style={{ color: '#333333' }}>
                      <Activity style={{ color: '#333333' }} size={16} />
                    </StyledIcon>
                    <TYPE.body style={{ color: '#333333' }} ml={'10px'}>
                      All Positions
                    </TYPE.body>
                  </RowFixed>
                )}
                {activePosition && (
                  <RowFixed>
                    <DoubleTokenLogo a0={activePosition.pair.token0.id} a1={activePosition.pair.token1.id} size={16} />
                    <TYPE.body ml={'16px'}>
                      {activePosition.pair.token0.symbol}-{activePosition.pair.token1.symbol} Position
                    </TYPE.body>
                  </RowFixed>
                )}
              </ButtonDropdown>
              {showDropdown && (
                <Flyout>
                  <AutoColumn gap="0px">
                    {positions?.map((p, i) => {
                      if (p.pair.token1.symbol === 'WETH') {
                        p.pair.token1.symbol = 'ETH'
                      }
                      if (p.pair.token0.symbol === 'WETH') {
                        p.pair.token0.symbol = 'ETH'
                      }
                      return (
                        p.pair.id !== activePosition?.pair.id && (
                          <MenuRow
                            onClick={() => {
                              setActivePosition(p)
                              setShowDropdown(false)
                            }}
                            key={i}
                          >
                            <DoubleTokenLogo a0={p.pair.token0.id} a1={p.pair.token1.id} size={16} />
                            <TYPE.body ml={'16px'}>
                              {p.pair.token0.symbol}-{p.pair.token1.symbol} Position
                            </TYPE.body>
                          </MenuRow>
                        )
                      )
                    })}
                    {activePosition && (
                      <MenuRow
                        onClick={() => {
                          setActivePosition()
                          setShowDropdown(false)
                        }}
                      >
                        <RowFixed>
                          <StyledIcon>
                            <Activity size={16} />
                          </StyledIcon>
                          <TYPE.body ml={'10px'}>All Positions</TYPE.body>
                        </RowFixed>
                      </MenuRow>
                    )}
                  </AutoColumn>
                </Flyout>
              )}
            </DropdownWrapper>
          )}
          {!hideLPContent && (
            <StylePanel2 className="hideLPContent">
              <StyleAutoRow2>
                <AutoColumn gap="10px">
                  <RowBetween>
                    <StyleTitle style={{ color: isDarkMode ? '#AAAAAA' : '#767676 ' }}>
                      {t('Liquidity (Including Fees)')}
                    </StyleTitle>
                    <div />
                  </RowBetween>
                  <RowFixed align="flex-end">
                    <StyleContentBottom lineHeight={1}>
                      {positionValue
                        ? formattedNum(positionValue, true)
                        : positionValue === 0
                        ? formattedNum(0, true)
                        : '-'}
                    </StyleContentBottom>
                  </RowFixed>
                </AutoColumn>
                <AutoColumn gap="10px">
                  <RowBetween>
                    <StyleTitle>{t('Fees Earned (Cumulative)')}</StyleTitle>
                    <div />
                  </RowBetween>
                  <RowFixed align="flex-end">
                    <StyleContentBottom lineHeight={1} color={aggregateFees && 'green'}>
                      {aggregateFees ? formattedNum(aggregateFees, true, true) : '-'}
                    </StyleContentBottom>
                  </RowFixed>
                </AutoColumn>
              </StyleAutoRow2>
            </StylePanel2>
          )}
          {!hideLPContent && (
            <PanelWrapper>
              <StylePanel>
                {activePosition ? (
                  <PairReturnsChart account={account} position={activePosition} />
                ) : (
                  <UserChart account={account} position={activePosition} />
                )}
              </StylePanel>
            </PanelWrapper>
          )}
          <TitlteTop fontSize={'2.125rem'} style={{ fontWeight: 'bold' }}>
            {t('Positions')}
          </TitlteTop>
          <StylePanelBlockPosition>
            <PositionList positions={positions} />
          </StylePanelBlockPosition>
          <TitlteTop fontSize={'2.125rem'} style={{ fontWeight: 'bold' }}>
            {t('Transactions')}
          </TitlteTop>
          <StylePanelBlockPosition>
            <TxnList transactions={transactions} />
          </StylePanelBlockPosition>
          <TitlteTop fontSize={'2.125rem'} style={{ fontWeight: 'bold' }}>
            {t('Wallet Stats')}
          </TitlteTop>
          <StyledPanel>
            <StyleAutoRow gap="20px">
              <StyleAutoColumn gap="8px">
                <TYPE.header fontSize={!below600 ? 20 : 13}>Total Value Swapped</TYPE.header>
                <TYPE.main color="#767676" fontSize={!below600 ? 24 : 13}>
                  {totalSwappedUSD ? formattedNum(totalSwappedUSD, true) : '-'}
                </TYPE.main>
              </StyleAutoColumn>

              <StyleAutoColumn gap="8px">
                <TYPE.header fontSize={!below600 ? 20 : 13}>Total Fees Paid</TYPE.header>
                <TYPE.main color="#767676" fontSize={!below600 ? 24 : 13}>
                  {totalSwappedUSD ? formattedNum(totalSwappedUSD * 0.003, true) : '-'}
                </TYPE.main>
              </StyleAutoColumn>
              <StyleAutoColumn gap="8px">
                <TYPE.header fontSize={!below600 ? 20 : 13}>Total Transactions</TYPE.header>
                <TYPE.main color="#767676" fontSize={!below600 ? 24 : 13}>
                  {transactionCount ? transactionCount : '-'}
                </TYPE.main>
              </StyleAutoColumn>
            </StyleAutoRow>
          </StyledPanel>
        </DashboardWrapper>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default AccountPage
