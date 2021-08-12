import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import 'feather-icons'
import styled from 'styled-components'
import Panel from '../components/Panel'
import {
  PageWrapper,
  ContentWrapperLarge,
  StyledIcon,
  BlockedWrapper,
  BlockedMessageWrapper,
} from '../components/index'
import { AutoRow, RowBetween, RowFixed } from '../components/Row'
import Column, { AutoColumn } from '../components/Column'
import { ButtonLight, ButtonDark } from '../components/ButtonStyled'
import PairChart from '../components/PairChart'
import Link from '../components/Link'
import TxnList from '../components/TxnList'
import Loader from '../components/LocalLoader'
import { BasicLink } from '../components/Link'
import Search from '../components/Search'
import { formattedNum, formattedPercent, getPoolLink, getSwapLink, shortenAddress } from '../utils'
import { useColor } from '../hooks'
import { usePairData, usePairTransactions } from '../contexts/PairData'
import { TYPE, ThemedBackground } from '../theme'
import { transparentize } from 'polished'
import CopyHelper from '../components/Copy'
import { useMedia } from 'react-use'
import DoubleTokenLogo from '../components/DoubleLogo'
import TokenLogo from '../components/TokenLogo'
import { Hover } from '../components'
import { useEthPrice } from '../contexts/GlobalData'
import Warning from '../components/Warning'
import { usePathDismissed, useSavedPairs } from '../contexts/LocalStorage'

import { Bookmark, PlusCircle, AlertCircle } from 'react-feather'
import FormattedName from '../components/FormattedName'
import { useListedTokens } from '../contexts/Application'
import HoverText from '../components/HoverText'
import { UNTRACKED_COPY, PAIR_BLACKLIST, BLOCKED_WARNINGS } from '../constants'
import { useDarkModeManager } from '../contexts/LocalStorage'
import { ETHERSCAN_BASE_URL } from '../constants/urls'
import { useTranslation } from 'react-i18next'

const DashboardWrapper = styled.div`
  width: 100%;
`

const PanelWrapper = styled.div`
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: max-content;
  gap: 20px;
  display: inline-grid;
  width: 100%;
  align-items: start;
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      /* grid-column: 1 / 4; */
    }

    > * {
      &:first-child {
        width: 100%;
      }
    }
  }
`
const ItemPairInfomation = styled.div`
  height: 100%;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 768.5px) {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr;
  }
`
const TokenDetailsLayout = styled.div`
  display: inline-grid;
  width: 100%;
  grid-template-columns: auto auto auto auto 1fr;
  column-gap: 60px;
  align-items: start;

  &:last-child {
    align-items: center;
    justify-items: end;
  }
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      /* grid-column: 1 / 4; */
      margin-bottom: 1rem;
    }

    &:last-child {
      align-items: start;
      justify-items: start;
    }
  }
`

const FixedPanel = styled(Panel)`
  width: fit-content;
  padding: 8px 12px;
  border-radius: 10px;

  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg2};
  }
`

const HoverSpan = styled.span`
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const WarningIcon = styled(AlertCircle)`
  stroke: ${({ theme }) => theme.text1};
  height: 16px;
  width: 16px;
  opacity: 0.6;
`

const WarningGrouping = styled.div`
  opacity: ${({ disabled }) => disabled && '0.4'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
`

function PairPage({ pairAddress, history }) {
  const {
    token0,
    token1,
    reserve0,
    reserve1,
    reserveUSD,
    trackedReserveUSD,
    oneDayVolumeUSD,
    volumeChangeUSD,
    oneDayVolumeUntracked,
    volumeChangeUntracked,
    liquidityChangeUSD,
  } = usePairData(pairAddress)
  const [isDarkMode] = useDarkModeManager()

  useEffect(() => {
    document.querySelector('body').scrollTo(0, 0)
  }, [])

  const transactions = usePairTransactions(pairAddress)
  const backgroundColor = useColor(pairAddress)

  const formattedLiquidity = reserveUSD ? formattedNum(reserveUSD, true) : formattedNum(trackedReserveUSD, true)
  const usingUntrackedLiquidity = !trackedReserveUSD && !!reserveUSD
  const liquidityChange = formattedPercent(liquidityChangeUSD)

  // volume
  const volume = !!oneDayVolumeUSD ? formattedNum(oneDayVolumeUSD, true) : formattedNum(oneDayVolumeUntracked, true)
  const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUntracked
  const volumeChange = formattedPercent(!usingUtVolume ? volumeChangeUSD : volumeChangeUntracked)

  const showUSDWaning = usingUntrackedLiquidity | usingUtVolume

  // get fees	  // get fees
  const fees =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? usingUtVolume
        ? formattedNum(oneDayVolumeUntracked * 0.003, true)
        : formattedNum(oneDayVolumeUSD * 0.003, true)
      : '-'

  // token data for usd
  const [ethPrice] = useEthPrice()
  const token0USD =
    token0?.derivedETH && ethPrice ? formattedNum(parseFloat(token0.derivedETH) * parseFloat(ethPrice), true) : ''

  const token1USD =
    token1?.derivedETH && ethPrice ? formattedNum(parseFloat(token1.derivedETH) * parseFloat(ethPrice), true) : ''

  // rates
  const token0Rate = reserve0 && reserve1 ? formattedNum(reserve1 / reserve0) : '-'
  const token1Rate = reserve0 && reserve1 ? formattedNum(reserve0 / reserve1) : '-'

  // formatted symbols for overflow
  const formattedSymbol0 = token0?.symbol.length > 6 ? token0?.symbol.slice(0, 5) + '...' : token0?.symbol
  const formattedSymbol1 = token1?.symbol.length > 6 ? token1?.symbol.slice(0, 5) + '...' : token1?.symbol

  const below1080 = useMedia('(max-width: 1080px)')
  const below900 = useMedia('(max-width: 900px)')
  const below600 = useMedia('(max-width: 600px)')

  const [dismissed, markAsDismissed] = usePathDismissed(history.location.pathname)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

  const [savedPairs, addPair] = useSavedPairs()

  const listedTokens = useListedTokens()

  if (PAIR_BLACKLIST.includes(pairAddress)) {
    return (
      <BlockedWrapper>
        <BlockedMessageWrapper>
          <AutoColumn gap="1rem" justify="center">
            <TYPE.light style={{ textAlign: 'center' }}>
              {BLOCKED_WARNINGS[pairAddress] ?? `This pair is not supported.`}
            </TYPE.light>
            <Link external={true} href={ETHERSCAN_BASE_URL + '/address/' + pairAddress}>{`More about ${shortenAddress(
              pairAddress
            )}`}</Link>
          </AutoColumn>
        </BlockedMessageWrapper>
      </BlockedWrapper>
    )
  }

  const StylePanel = styled(Panel)`
    border: 0;
    background-color: ${isDarkMode ? '#0E2B4A' : '#F3F3F3'};
    margin-bottom: 20;
  `
  // const StylePanelPairChart = styled(Panel)`
  //   gridColumn: ${below1080 ? 1 : 2/4};
  //   gridRow: below1080 ? '' : '1/5';
  //   backgroundColor: isDarkMode ? '#0E2B4A' : '#F3F3F3';
  //   border: 0;
  //   boxShadow: '0px 8px 17px rgba(0, 0, 0, 0.18)',
  //   borderRadius: 25
  // `
  const StyleDiv = styled.div`
    z-index: 2;
  `

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={transparentize(0.6, backgroundColor)} />
      <span />
      <StyleDiv>
        <Warning
          type={'pair'}
          show={!dismissed && listedTokens && !(listedTokens.includes(token0?.id) && listedTokens.includes(token1?.id))}
          setShow={markAsDismissed}
          address={pairAddress}
        />
      </StyleDiv>

      <ContentWrapperLarge style={{ zIndex: 1 }}>
        {/* <RowBetween>
          <TYPE.body>
            <BasicLink to="/swap/pairs">{'Pairs'}</BasicLink>→ {token0?.symbol}-{token1?.symbol}
          </TYPE.body>
        </RowBetween> */}
        <WarningGrouping
          disabled={
            !dismissed && listedTokens && !(listedTokens.includes(token0?.id) && listedTokens.includes(token1?.id))
          }
        >
          <DashboardWrapper>
            <AutoColumn gap="40px" style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  width: '100%',
                }}
              >
                <RowFixed style={{ flexWrap: 'wrap', minWidth: '100px' }}>
                  <RowFixed>
                    {token0 && token1 && (
                      <DoubleTokenLogo a0={token0?.id || ''} a1={token1?.id || ''} size={32} margin={true} />
                    )}{' '}
                    <TYPE.main fontSize={below1080 ? '1.5rem' : '2rem'} style={{ margin: '0 1rem' }}>
                      {token0 && token1 ? (
                        <>
                          <HoverSpan onClick={() => history.push(`/swap/token/${token0?.id}`)}>
                            {token0.symbol}
                          </HoverSpan>
                          <span>-</span>
                          <HoverSpan onClick={() => history.push(`/swap/token/${token1?.id}`)}>
                            {token1.symbol}
                          </HoverSpan>{' '}
                          {t('Pairs')}
                        </>
                      ) : (
                        ''
                      )}
                    </TYPE.main>
                  </RowFixed>
                </RowFixed>
                <RowFixed style={below1080 ? { width: '100%' } : { width: '50%' }}>
                  {!below600 && <Search small={false} />}
                </RowFixed>
              </div>
              <div>
                <RowFixed
                  ml={0}
                  mt={below1080 && '1rem'}
                  style={{
                    flexDirection: below1080 ? 'row-reverse' : 'initial',
                    marginLeft: 0,
                  }}
                >
                  <Link external href={getPoolLink(token0?.id, token1?.id)}>
                    <ButtonLight style={{ backgroundColor: '#F05359', color: '#fff', fontSize: 24 }}>
                      + {t('Add Liquidity')}
                    </ButtonLight>
                  </Link>
                  <Link external href={getSwapLink(token0?.id, token1?.id)}>
                    <ButtonDark
                      ml={!below1080 && '.5rem'}
                      mr={below1080 && '.5rem'}
                      style={{ backgroundColor: '#F05359', color: '#fff', fontSize: 24 }}
                    >
                      {t('Swap')}
                    </ButtonDark>
                  </Link>
                </RowFixed>
              </div>
            </AutoColumn>
            <AutoRow
              gap="6px"
              style={{
                width: 'fit-content',
                marginTop: below900 ? '1rem' : '0',
                marginBottom: below900 ? '0' : '2rem',
                flexWrap: 'wrap',
              }}
            >
              <FixedPanel
                onClick={() => history.push(`/swap/token/${token0?.id}`)}
                style={{ backgroundColor: '#F3F3F3', borderRadius: 25, border: 0 }}
              >
                <RowFixed>
                  <TokenLogo address={token0?.id} size={'16px'} />
                  <TYPE.main fontSize={'16px'} lineHeight={1} fontWeight={500} ml={'4px'} style={{ color: '#767676' }}>
                    {token0 && token1
                      ? `1 ${formattedSymbol0} = ${token0Rate} ${formattedSymbol1} ${
                          parseFloat(token0?.derivedETH) ? '(' + token0USD + ')' : ''
                        }`
                      : '-'}
                  </TYPE.main>
                </RowFixed>
              </FixedPanel>
              <FixedPanel
                style={{ backgroundColor: '#F3F3F3', borderRadius: 25, border: 0, color: '#767676' }}
                onClick={() => history.push(`/swap/token/${token1?.id}`)}
              >
                <RowFixed>
                  <TokenLogo address={token1?.id} size={'16px'} />
                  <TYPE.main fontSize={'16px'} lineHeight={1} fontWeight={500} ml={'4px'} style={{ color: '#767676' }}>
                    {token0 && token1
                      ? `1 ${formattedSymbol1} = ${token1Rate} ${formattedSymbol0}  ${
                          parseFloat(token1?.derivedETH) ? '(' + token1USD + ')' : ''
                        }`
                      : '-'}
                  </TYPE.main>
                </RowFixed>
              </FixedPanel>
            </AutoRow>
            <>
              {!below1080 && (
                <RowFixed>
                  {/* <TYPE.main fontSize={'2.125rem'} mr="6px">
                    {t('Pair Stats')}
                  </TYPE.main> */}
                  {showUSDWaning ? (
                    <HoverText text={UNTRACKED_COPY}>
                      <WarningIcon />
                    </HoverText>
                  ) : null}
                </RowFixed>
              )}
              <PanelWrapper style={{ marginTop: '1.5rem' }}>
                <StylePanel>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main className="font-24">{t('Total Liquidity')} </TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main className="font-28" lineHeight={1} fontWeight={500}>
                        {formattedLiquidity}
                      </TYPE.main>
                      <TYPE.main className="font-24">{liquidityChange}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </StylePanel>
                <StylePanel>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main className="font-24">{t('Volume (24h)')} </TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main className="font-28" lineHeight={1} fontWeight={500}>
                        {volume}
                      </TYPE.main>
                      <TYPE.main className="font-24">{volumeChange}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </StylePanel>
                <StylePanel>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main className="font-24">{t('Fees (24hr)')}</TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main className="font-28" fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                        {fees}
                      </TYPE.main>
                      <TYPE.main className="font-24">{volumeChange}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </StylePanel>
                <StylePanel style={{ border: 0, backgroundColor: isDarkMode ? '#0E2B4A' : '#F3F3F3' }}>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main className="font-24">{t('Pooled Tokens')}</TYPE.main>
                      <div />
                    </RowBetween>
                    <Hover onClick={() => history.push(`/swap/token/${token0?.id}`)} fade={true}>
                      <AutoRow gap="4px">
                        <TokenLogo address={token0?.id} />
                        <TYPE.main fontSize={32} lineHeight={1} fontWeight={500}>
                          <RowFixed>
                            {reserve0 ? formattedNum(reserve0) : ''}{' '}
                            <FormattedName text={token0?.symbol ?? ''} maxCharacters={8} margin={true} />
                          </RowFixed>
                        </TYPE.main>
                      </AutoRow>
                    </Hover>
                    <Hover onClick={() => history.push(`/swap/token/${token1?.id}`)} fade={true}>
                      <AutoRow gap="4px">
                        <TokenLogo address={token1?.id} />
                        <TYPE.main fontSize={32} lineHeight={1} fontWeight={500}>
                          <RowFixed>
                            {reserve1 ? formattedNum(reserve1) : ''}{' '}
                            <FormattedName text={token1?.symbol ?? ''} maxCharacters={8} margin={true} />
                          </RowFixed>
                        </TYPE.main>
                      </AutoRow>
                    </Hover>
                  </AutoColumn>
                </StylePanel>
                <Panel
                  style={{
                    gridColumn: below1080 ? '1' : '2/4',
                    gridRow: below1080 ? '' : '1/5',
                    backgroundColor: isDarkMode ? '#0E2B4A' : '#fff',
                    border: 0,
                    boxShadow: '0px 8px 17px rgba(0, 0, 0, 0.18)',
                    borderRadius: 25,
                  }}
                >
                  <PairChart
                    address={pairAddress}
                    color={backgroundColor}
                    base0={reserve1 / reserve0}
                    base1={reserve0 / reserve1}
                  />
                </Panel>
              </PanelWrapper>
              <TYPE.main fontSize={'2.125rem'} style={{ marginTop: '3rem', fontWeight: 'bold' }}>
                {t('Transactions')}
              </TYPE.main>{' '}
              <Panel
                style={{
                  marginTop: '1.5rem',
                  padding: 0,
                  border: 0,
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                }}
              >
                {transactions ? <TxnList transactions={transactions} /> : <Loader />}
              </Panel>
              <RowBetween style={{ marginTop: '3rem' }}>
                <TYPE.main fontSize={'2.125rem'} style={{ fontWeight: 'bold' }}>
                  {t('Pair Information')}
                </TYPE.main>{' '}
              </RowBetween>
              <Panel
                rounded
                style={{
                  marginTop: '1.5rem',
                  backgroundColor: isDarkMode ? '#0E2B4A' : '#FFFFFF',
                  border: 0,
                }}
                p={20}
              >
                <TokenDetailsLayout style={{ maxHeight: !below600 ? '82px' : 'auto' }}>
                  <Column style={{ height: '100%', width: '100%' }}>
                    <ItemPairInfomation>
                      <TYPE.main
                        className="font-weight-bold f-20"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#333333', fontWeight: 'bold' }}
                      >
                        {t('Pair Name')}
                      </TYPE.main>
                      <TYPE.main style={{ margin: 'auto' }}>
                        <RowFixed>
                          <FormattedName
                            style={{ color: isDarkMode ? '#AAAAAA' : '#767676' }}
                            fontSize={16}
                            text={token0?.symbol ?? ''}
                            maxCharacters={8}
                          />
                          -
                          <FormattedName
                            style={{ color: isDarkMode ? '#AAAAAA' : '#767676' }}
                            fontSize={16}
                            text={token1?.symbol ?? ''}
                            maxCharacters={8}
                          />
                        </RowFixed>
                      </TYPE.main>
                    </ItemPairInfomation>
                  </Column>
                  <Column style={{ height: '100%', width: '100%' }}>
                    <ItemPairInfomation>
                      <TYPE.main
                        className="font-weight-bold f-20"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#333333' }}
                      >
                        {t('Pair Address')}
                      </TYPE.main>
                      <AutoRow align="center" style={{ margin: 'auto' }}>
                        <TYPE.main style={{ color: isDarkMode ? '#AAAAAA' : '#767676' }}>
                          {pairAddress.slice(0, 6) + '...' + pairAddress.slice(38, 42)}
                        </TYPE.main>
                        <CopyHelper toCopy={pairAddress} />
                      </AutoRow>
                    </ItemPairInfomation>
                  </Column>
                  <Column style={{ height: '100%', width: '100%' }}>
                    <ItemPairInfomation>
                      <TYPE.main
                        className="font-weight-bold f-20"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#333333' }}
                      >
                        <RowFixed>
                          <FormattedName text={token0?.symbol ?? ''} maxCharacters={8} />{' '}
                          <span style={{ marginLeft: '4px' }}>{t('Address')}</span>
                        </RowFixed>
                      </TYPE.main>
                      <AutoRow align="center" style={{ margin: 'auto' }}>
                        <TYPE.main style={{ color: isDarkMode ? '#AAAAAA' : '#767676' }}>
                          {token0 && token0.id.slice(0, 6) + '...' + token0.id.slice(38, 42)}
                        </TYPE.main>
                        <CopyHelper toCopy={token0?.id} />
                      </AutoRow>
                    </ItemPairInfomation>
                  </Column>
                  <Column style={{ height: '100%', width: '100%' }}>
                    <ItemPairInfomation>
                      <TYPE.main>
                        <RowFixed style={{ fontWeight: 'bold' }} className="f-20">
                          <FormattedName text={token1?.symbol ?? ''} maxCharacters={8} />{' '}
                          <span style={{ marginLeft: '4px' }}>{t('Address')}</span>
                        </RowFixed>
                      </TYPE.main>
                      <AutoRow align="center" style={{ margin: 'auto' }}>
                        <TYPE.main style={{ color: isDarkMode ? '#AAAAAA' : '#767676' }} fontSize={16}>
                          {token1 && token1.id.slice(0, 6) + '...' + token1.id.slice(38, 42)}
                        </TYPE.main>
                        <CopyHelper toCopy={token1?.id} />
                      </AutoRow>
                    </ItemPairInfomation>
                  </Column>
                  <Column>
                    <ItemPairInfomation>
                      <TYPE.main>
                        <RowFixed>
                          <TYPE.main
                            className="font-weight-bold f-20"
                            style={{ color: isDarkMode ? '#FFFFFF' : '#333333' }}
                          >
                            {t('Action')}
                          </TYPE.main>
                        </RowFixed>
                      </TYPE.main>
                      <AutoRow align="center" style={{ margin: 'auto' }}>
                        <ButtonLight color={backgroundColor} className="btn-danger" style={{ marginTop: 20 }}>
                          <Link color={backgroundColor} external href={ETHERSCAN_BASE_URL + '/address/' + pairAddress}>
                            {t('View on Etherscan')} ↗
                          </Link>
                        </ButtonLight>
                      </AutoRow>
                    </ItemPairInfomation>
                  </Column>
                </TokenDetailsLayout>
              </Panel>
            </>
          </DashboardWrapper>
        </WarningGrouping>
      </ContentWrapperLarge>
    </PageWrapper>
  )
}

export default withRouter(PairPage)
