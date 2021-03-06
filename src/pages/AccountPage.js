import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useUserPositions, useUserTransactions } from '../contexts/User'
import TxnList from '../components/TxnList'
import Panel from '../components/Panel'
import { formattedNum } from '../utils'
import Row, { AutoRow, RowBetween, RowFixed } from '../components/Row'
import { AutoColumn } from '../components/Column'
import UserChart from '../components/UserChart'
import PairReturnsChart from '../components/PairReturnsChart'
import PositionList from '../components/PositionList'
import { TYPE } from '../theme'
import { ButtonDropdown } from '../components/ButtonStyled'
import { ContentWrapper, PageWrapper, StyledIcon } from '../components'
import DoubleTokenLogo from '../components/DoubleLogo'
import { Activity } from 'react-feather'
import Link from '../components/Link'
import { ETHERSCAN_BASE_URL, chainId, FEE_WARNING_TOKENS } from '../constants'
import { useMedia } from 'react-use'
import { useDarkModeManager } from '../contexts/LocalStorage'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'

const StyledPanel = styled(Panel)`
  margin-top: 1.5rem !important;
  padding: 0;
  background-color: 'red';
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
  z-index: 999;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding-top: 4px;
  border: 0;
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
  const { t } = useTranslation()
  // get data for user stats
  const transactionCount = transactions?.swaps?.length + transactions?.burns?.length + transactions?.mints?.length
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })

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

  const below600 = useMedia('(max-width: 600px)')

  // status theme mode
  const [isDarkMode] = useDarkModeManager()

  const StyleAutoRow = styled(AutoRow)`
    box-shadow: 0px 8px 17px rgba(0, 0, 0, 0.18);
    background-color: ${isDarkMode ? '#0E2B4A !important' : '#fff !important'};
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
    background-color: ${isDarkMode ? '#0E2B4A' : '#FFF'};
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
    // justify-content: ;
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
        <RowBetween></RowBetween>
        <Header>
          <RowBetween>
            <div
              className="w-100"
              style={isMobile ? { marginTop: '20px', display: 'flex', justifyContent: 'space-between' } : {}}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TYPE.header fontSize={isMobile ? 13 : 32}>
                  {account?.slice(0, 6) + '...' + account?.slice(38, 42)}
                </TYPE.header>
              </div>
              <div style={{ width: isMobile ? '144px' : '15%', maxWidth: 218 }}>
                <Link lineHeight={'145.23%'} href={ETHERSCAN_BASE_URL[chainId] + '/address/' + account} target="_blank">
                  <TYPE.main
                    className="btn-danger"
                    fontSize={isMobile ? 13 : 16}
                    style={{ margin: !below600 ? '15px 0 35px' : '15px 0', minWidth: isMobile ? 144 : 'auto' }}
                  >
                    {t('View on Etherscan')}
                  </TYPE.main>
                </Link>
              </div>
            </div>
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
                borderBottomLeftRadius: showDropdown ? 0 : 25,
                borderBottomRightRadius: showDropdown ? 0 : 25,
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
                    <TYPE.body fontSize={'16px'} style={{ color: '#333333' }} ml={'10px'}>
                      {t('All Positions')}
                    </TYPE.body>
                  </RowFixed>
                )}
                {activePosition && (
                  <RowFixed>
                    <DoubleTokenLogo a0={activePosition.pair.token0.id} a1={activePosition.pair.token1.id} size={16} />
                    <TYPE.body ml={'16px'}>
                      {activePosition.pair.token0.symbol}-{activePosition.pair.token1.symbol} {t('Positions')}
                    </TYPE.body>
                  </RowFixed>
                )}
              </ButtonDropdown>
              {showDropdown && (
                <Flyout style={{ backgroundColor: isDarkMode ? '#0E2B4A' : '#F3F3F3' }}>
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
                              {p.pair.token0.symbol}-{p.pair.token1.symbol} {t('Positions')}
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
                          <TYPE.body ml={'10px'}>{t('All Positions')}</TYPE.body>
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
                <AutoColumn gap="10px" style={{ marginRight: 85 }}>
                  <RowBetween>
                    <StyleTitle fontSize={isMobile ? 13 : 20} style={{ color: isDarkMode ? '#AAAAAA' : '#767676 ' }}>
                      {t('Liquidity (Including Fees)')}
                    </StyleTitle>
                    <div />
                  </RowBetween>
                  <RowFixed align="flex-end">
                    <StyleContentBottom
                      lineHeight={1}
                      fontSize={isMobile ? 16 : 24}
                      style={{ color: isDarkMode ? '#fff' : '#111111' }}
                    >
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
                    <StyleTitle fontSize={isMobile ? 13 : 20} style={{ color: isDarkMode ? '#AAAAAA' : '#767676' }}>
                      {t('Fees Earned (Cumulative)')}
                    </StyleTitle>
                    <div />
                  </RowBetween>
                  <RowFixed align="flex-end">
                    <StyleContentBottom
                      lineHeight={1}
                      fontSize={isMobile ? 16 : 24}
                      style={{ color: isDarkMode ? '#fff' : '#111111' }}
                    >
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
          <TitlteTop fontSize={isMobile ? 20 : '2.125rem'} style={{ fontWeight: 'bold' }}>
            {t('Positions')}
          </TitlteTop>
          <StylePanelBlockPosition>
            <PositionList positions={positions} />
          </StylePanelBlockPosition>
          <TitlteTop fontSize={isMobile ? 20 : '2.125rem'} style={{ fontWeight: 'bold' }}>
            {t('Transactions')}
          </TitlteTop>
          <StylePanelBlockPosition>
            <TxnList transactions={transactions} />
          </StylePanelBlockPosition>
          <TitlteTop
            fontSize={isMobile ? 20 : '2.125rem'}
            style={{ fontWeight: 'bold', marginBottom: below600 ? 10 : '' }}
          >
            {t('Wallet Stats')}
          </TitlteTop>
          <StyledPanel>
            <StyleAutoRow gap="20px">
              <StyleAutoColumn gap="8px" style={{ width: below600 ? '100%' : 'auto' }}>
                <TYPE.header fontSize={below600 ? 13 : 20}>{t('Total Value Swapped')}</TYPE.header>
                <TYPE.main color="#767676" fontSize={below600 ? 13 : 24} style={{ width: below600 ? '60%' : 'auto' }}>
                  {totalSwappedUSD ? formattedNum(totalSwappedUSD, true) : '-'}
                </TYPE.main>
              </StyleAutoColumn>

              <StyleAutoColumn gap="8px" style={{ width: below600 ? '100%' : 'auto' }}>
                <TYPE.header fontSize={!below600 ? 20 : 13} style={{ minWidth: below600 ? 120 : 'auto' }}>
                  {t('Total Fees Paid')}
                </TYPE.header>
                <TYPE.main color="#767676" fontSize={!below600 ? 24 : 13} style={{ width: below600 ? '60%' : 'auto' }}>
                  {totalSwappedUSD ? formattedNum(totalSwappedUSD * 0.003, true) : '-'}
                </TYPE.main>
              </StyleAutoColumn>
              <StyleAutoColumn gap="8px" style={{ width: below600 ? '100%' : 'auto' }}>
                <TYPE.header fontSize={!below600 ? 20 : 13} style={{ minWidth: below600 ? 120 : 'auto' }}>
                  {t('Total Transactions')}
                </TYPE.header>
                <TYPE.main color="#767676" fontSize={!below600 ? 24 : 13} style={{ width: below600 ? '60%' : 'auto' }}>
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
