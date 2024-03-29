import React, { useEffect, useState } from 'react'
import 'feather-icons'
import { withRouter } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import Link, { CustomLink } from '../components/Link'
import Panel from '../components/Panel'
import TokenLogo from '../components/TokenLogo'
import PairList from '../components/PairList'
import Loader from '../components/LocalLoader'
import { AutoRow, RowBetween, RowFixed } from '../components/Row'
import Column, { AutoColumn } from '../components/Column'
import { ButtonDark, ButtonLight } from '../components/ButtonStyled'
import TxnList from '../components/TxnList'
import TokenChart from '../components/TokenChart'
import { formattedNum, formattedPercent, getPoolLink, getSwapLink, localNumber, shortenAddress } from '../utils'
import { useTokenData, useTokenPairs, useTokenTransactions } from '../contexts/TokenData'
import { ThemedBackground, TYPE } from '../theme'
import { useColor, useCopyClipboard } from '../hooks'
import { useMedia } from 'react-use'
import { useDataForList } from '../contexts/PairData'
import Warning from '../components/Warning'
import { useDarkModeManager, usePathDismissed } from '../contexts/LocalStorage'
import { BlockedMessageWrapper, BlockedWrapper, ContentWrapper, PageWrapper } from '../components'
import { AlertCircle } from 'react-feather'
import FormattedName from '../components/FormattedName'
import { useListedTokens } from '../contexts/Application'
import HoverText from '../components/HoverText'
import { BLOCKED_WARNINGS, chainId, ETHERSCAN_BASE_URL, TOKEN_BLACKLIST, UNTRACKED_COPY } from '../constants'
import { useTranslation } from 'react-i18next'

const DashboardWrapper = styled.div`
  width: 100%;
`

const PanelWrapper = styled.div`
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: max-content;
  gap: 6px;
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

const TokenDetailsLayout = styled.div`
  display: inline-grid;
  width: 100%;
  grid-template-columns: auto auto auto 1fr;
  column-gap: 30px;
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

function TokenPage({ address, history }) {
  const {
    id,
    name,
    symbol,
    priceUSD,
    oneDayVolumeUSD,
    totalLiquidityUSD,
    volumeChangeUSD,
    oneDayVolumeUT,
    volumeChangeUT,
    priceChangeUSD,
    liquidityChangeUSD,
    oneDayTxns,
    txnChange,
  } = useTokenData(address)
  const [isDarkMode] = useDarkModeManager()
  const [, setCopied] = useCopyClipboard()
  const { t } = useTranslation()

  useEffect(() => {
    document.querySelector('body').scrollTo(0, 0)
  }, [])

  // detect color from token
  const backgroundColor = useColor(id, symbol)

  const allPairs = useTokenPairs(address)

  // pairs to show in pair list
  const fetchedPairsList = useDataForList(allPairs)

  // all transactions with this token
  const transactions = useTokenTransactions(address)

  // price
  const price = priceUSD ? formattedNum(priceUSD, true) : '0'
  const priceChange = priceChangeUSD ? formattedPercent(priceChangeUSD) : '0'

  // volume
  const volume = formattedNum(!!oneDayVolumeUSD ? oneDayVolumeUSD : oneDayVolumeUT, true)

  const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUT
  const volumeChange = formattedPercent(!usingUtVolume ? volumeChangeUSD : volumeChangeUT)

  // liquidity
  const liquidity = formattedNum(totalLiquidityUSD, true)
  const liquidityChange = formattedPercent(liquidityChangeUSD)

  // transactions
  const txnChangeFormatted = formattedPercent(txnChange)

  const below1080 = useMedia('(max-width: 1080px)')
  // const below800 = useMedia('(max-width: 800px)')
  const below600 = useMedia('(max-width: 600px)')
  const below500 = useMedia('(max-width: 500px)')

  // format for long symbol
  const LENGTH = below1080 ? 10 : 16
  const formattedSymbol = symbol?.length > LENGTH ? symbol.slice(0, LENGTH) + '...' : symbol

  const [dismissed, markAsDismissed] = usePathDismissed(history.location.pathname)
  // const [savedTokens, addToken] = useSavedTokens()
  const listedTokens = useListedTokens()

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

  const [useTracked] = useState(true)

  if (TOKEN_BLACKLIST.includes(address)) {
    return (
      <BlockedWrapper>
        <BlockedMessageWrapper>
          <AutoColumn gap="1rem" justify="center">
            <TYPE.light style={{ textAlign: 'center' }}>
              {BLOCKED_WARNINGS[address] ?? `This token is not supported.`}
            </TYPE.light>
            <Link
              external={true}
              href={ETHERSCAN_BASE_URL[chainId] + '/address/' + address}
            >{`More about ${shortenAddress(address)}`}</Link>
          </AutoColumn>
        </BlockedMessageWrapper>
      </BlockedWrapper>
    )
  }

  return (
    <PageWrapper>
      <ThemedBackground />
      <Warning
        type={'token'}
        show={!dismissed && listedTokens && !listedTokens.includes(address)}
        setShow={markAsDismissed}
        address={address}
      />
      <ContentWrapper style={{ zIndex: 1 }}>
        <WarningGrouping disabled={!dismissed && listedTokens && !listedTokens.includes(address)}>
          <DashboardWrapper style={{ marginTop: below1080 ? '0' : '1rem', zIndex: 1 }}>
            <RowBetween
              className="box-title-main"
              style={{
                flexWrap: 'wrap',
                marginBottom: '1rem',
                alignItems: 'flex-start',
              }}
            >
              <RowFixed style={{ flexWrap: 'wrap' }}>
                <RowFixed style={{ alignItems: below500 ? 'center' : 'baseline' }}>
                  <TokenLogo address={address} size={below500 ? '24px' : '32px'} style={{ alignSelf: 'center' }} />
                  <TYPE.main fontSize={below1080 ? '13px' : '36px'} fontWeight={500} style={{ margin: '0 1rem' }}>
                    <RowFixed gap="6px">
                      <FormattedName text={name ? name + ' ' : ''} maxCharacters={16} style={{ marginRight: '6px' }} />{' '}
                      {formattedSymbol ? `(${formattedSymbol})` : ''}
                    </RowFixed>
                  </TYPE.main>
                  <TYPE.main
                    className="font-weight-500"
                    fontWeight={500}
                    style={{ marginRight: '1rem', color: isDarkMode ? '#fff' : '#333333' }}
                    Add
                    Liquidity
                    fontSize={below500 ? 13 : 36}
                  >
                    {price}
                  </TYPE.main>
                  <div
                    fontSize={below500 ? 13 : 24}
                    className={priceChange >= 0 ? 'color-blue font-weight-500' : 'color-red font-weight-500'}
                  >
                    {priceChange}
                  </div>
                </RowFixed>
              </RowFixed>
            </RowBetween>
            <RowBetween
              style={{
                flexWrap: 'wrap',
                marginBottom: '1rem',
                alignItems: 'flex-start',
              }}
            >
              <RowFixed>
                <Link href={getPoolLink(address)} target="_blank" style={{ order: below500 ? 1 : 0 }}>
                  <ButtonLight
                    style={{
                      backgroundColor: '#F05359',
                      color: '#fff',
                      borderRadius: 35,
                      fontSize: below500 ? 13 : 24,
                    }}
                  >
                    + {t('Add Liquidity')}
                  </ButtonLight>
                </Link>
                <Link href={getSwapLink(address)} target="_blank" style={{ order: below500 ? 0 : 1 }}>
                  <ButtonDark
                    style={{
                      backgroundColor: '#F05359',
                      color: '#fff',
                      borderRadius: 35,
                      fontSize: below500 ? 13 : 24,
                      width: below500 ? 56 : 101,
                    }}
                    ml={'.5rem'}
                    mr={below1080 && '.5rem'}
                  >
                    {t('Swap')}
                  </ButtonDark>
                </Link>
              </RowFixed>
            </RowBetween>
            <>
              {!below1080 && (
                <RowFixed>
                  {/* <TYPE.main fontSize={'1.125rem'} mr="6px">
                    Token Stats
                  </TYPE.main> */}
                  {usingUtVolume && (
                    <HoverText text={UNTRACKED_COPY}>
                      <WarningIcon />
                    </HoverText>
                  )}
                </RowFixed>
              )}
              <PanelWrapper
                className="column-token"
                style={{ marginTop: below1080 ? '0' : '1rem', gap: below500 ? 20 : 6 }}
              >
                <Panel style={{ border: 0, backgroundColor: isDarkMode ? '#0E2B4A' : '#F3F3F3', borderRadius: 25 }}>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main
                        fontSize={below500 ? 13 : 24}
                        className={isDarkMode ? 'font-weight-normal color-gray2' : 'font-weight-normal color-gray'}
                      >
                        {t('Total Liquidity')}
                      </TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main
                        fontSize={below500 ? 20 : 28}
                        lineHeight={1}
                        fontWeight={500}
                        style={{ color: isDarkMode ? '#fff' : '#333333' }}
                      >
                        {liquidity}
                      </TYPE.main>
                      <TYPE.main fontSize={below500 ? 16 : 24}>{liquidityChange}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </Panel>
                <Panel style={{ border: 0, backgroundColor: isDarkMode ? '#0E2B4A' : '#F3F3F3', borderRadius: 25 }}>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main
                        fontSize={below500 ? 13 : 24}
                        className={isDarkMode ? 'font-weight-normal color-gray2' : 'font-weight-normal color-gray'}
                      >
                        {t('Volume (24h)')}
                      </TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main
                        fontSize={below500 ? 20 : 28}
                        lineHeight={1}
                        fontWeight={500}
                        style={{ color: isDarkMode ? '#fff' : '#333333' }}
                      >
                        {volume}
                      </TYPE.main>
                      <TYPE.main fontSize={below500 ? 16 : 24}>{volumeChange}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </Panel>
                <Panel style={{ border: 0, backgroundColor: isDarkMode ? '#0E2B4A' : '#F3F3F3', borderRadius: 25 }}>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main
                        fontSize={below500 ? 13 : 24}
                        className={isDarkMode ? 'font-weight-normal color-gray2' : 'font-weight-normal color-gray'}
                      >
                        {t('Transactions (24hrs)')}
                      </TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main
                        fontSize={below500 ? 20 : 28}
                        lineHeight={1}
                        fontWeight={500}
                        style={{ color: isDarkMode ? '#fff' : '#333333' }}
                      >
                        {oneDayTxns ? localNumber(oneDayTxns) : 0}
                      </TYPE.main>
                      <TYPE.main fontSize={below500 ? 16 : 24}>{txnChangeFormatted}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </Panel>
                <Panel
                  style={{
                    gridColumn: below1080 ? '1' : '2/4',
                    gridRow: below1080 ? '' : '1/4',
                    backgroundColor: isDarkMode ? '#0E2B4A' : '#fff',
                    border: 0,
                    boxShadow: '0px 8px 17px rgba(0, 0, 0, 0.18)',
                  }}
                >
                  <TokenChart address={address} color={backgroundColor} base={priceUSD} />
                </Panel>
              </PanelWrapper>
            </>

            <RowBetween style={{ marginTop: '3rem' }}>
              <TYPE.main fontSize={below500 ? 16 : 40} style={{ fontWeight: 'bold' }}>
                {t('Top Pairs')}
              </TYPE.main>
              <AutoRow gap="4px" style={{ width: 'fit-content' }}>
                <CustomLink style={{ color: '#3FAAB0' }} to={'/swap/pairs'}>
                  {t('See more')}
                </CustomLink>
                {/* <QuestionHelper text="USD amounts may be inaccurate in low liquiidty pairs or pairs without ETH or stablecoins." /> */}
              </AutoRow>
            </RowBetween>
            <Panel
              className="box-shadow-none"
              rounded
              style={{
                marginTop: '1.5rem',
                padding: '0 ',
                backgroundColor: 'transparent',
                border: 0,
                boxShadow: '0',
              }}
            >
              <PairList color={backgroundColor} address={address} pairs={fetchedPairsList} useTracked={useTracked} />
            </Panel>
            <RowBetween mt={40} mb={'1rem'} style={{ zIndex: 1 }}>
              <TYPE.main fontSize={below500 ? 16 : 40} style={{ fontWeight: 'bold' }}>
                {t('Transactions')}
              </TYPE.main>{' '}
              <div />
            </RowBetween>
            <Panel
              className="box-shadow-none"
              rounded
              style={{ backgroundColor: 'transparent', border: 0, padding: 0 }}
            >
              {transactions ? <TxnList color={backgroundColor} transactions={transactions} /> : <Loader />}
            </Panel>
            <>
              <RowBetween style={{ marginTop: '3rem' }}>
                <TYPE.main fontSize={below500 ? 16 : 40} style={{ fontWeight: 'bold' }}>
                  {t('Token Information')}
                </TYPE.main>{' '}
              </RowBetween>
              <Panel
                rounded
                style={{
                  marginTop: '1.5rem',
                  backgroundColor: isDarkMode ? '#0E2B4A' : '#fff',
                  border: 0,
                  boxShadow: '0px 8px 17px rgba(0, 0, 0, 0.18)',
                  borderRadius: 15,
                }}
                p={20}
              >
                <TokenDetailsLayout style={{}}>
                  <Column>
                    <TYPE.main style={{ fontWeight: 'bold' }} fontSize={below600 ? 13 : 20}>
                      {t('Symbol')}
                    </TYPE.main>
                    <Text fontSize={below600 ? 13 : 16} style={{ marginTop: '1.5rem' }} fontWeight="400">
                      <FormattedName
                        style={{ color: isDarkMode ? '#AAAAAA' : '#767676' }}
                        text={symbol}
                        maxCharacters={12}
                      />
                    </Text>
                  </Column>
                  <Column>
                    <TYPE.main fontSize={below600 ? 13 : 20} style={{ fontWeight: 'bold' }}>
                      {t('Name')}
                    </TYPE.main>
                    <TYPE.main style={{ marginTop: '1.5rem' }} fontSize={below600 ? 13 : 16} fontWeight="400">
                      <FormattedName
                        style={{ color: isDarkMode ? '#AAAAAA' : '#767676' }}
                        text={name}
                        maxCharacters={16}
                      />
                    </TYPE.main>
                  </Column>
                  <Column>
                    <TYPE.main style={{ fontWeight: 'bold' }} fontSize={below600 ? 13 : 20}>
                      {t('Address')}
                    </TYPE.main>
                    <AutoRow align="flex-end">
                      <TYPE.main
                        fontSize={below600 ? 13 : 16}
                        fontWeight="400"
                        style={{ color: isDarkMode ? '#AAAAAA' : '#767676', marginTop: '1.5rem' }}
                      >
                        {address.slice(0, 8) + '...' + address.slice(36, 42)}
                      </TYPE.main>
                    </AutoRow>
                  </Column>
                  <Column className="box-btn-action">
                    <TYPE.main style={{ fontWeight: 'bold' }} fontSize={below600 ? 13 : 20}>
                      {t('Action')}
                    </TYPE.main>
                    <AutoRow align="flex-end" style={{ marginTop: '1.5rem' }} fontSize={below600 ? 13 : 16}>
                      <button className="btn-danger" onClick={() => setCopied(address)} fontSize={below600 ? 13 : 16}>
                        {t('Copy Address')}
                      </button>
                      <ButtonLight className="btn-danger ml-1">
                        <Link
                          color="#fff"
                          external
                          href={ETHERSCAN_BASE_URL[chainId] + '/address/' + address}
                          fontSize={below600 ? 13 : 16}
                        >
                          {t('View on Etherscan')} ↗
                        </Link>
                      </ButtonLight>
                    </AutoRow>
                  </Column>
                </TokenDetailsLayout>
              </Panel>
            </>
          </DashboardWrapper>
        </WarningGrouping>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default withRouter(TokenPage)
