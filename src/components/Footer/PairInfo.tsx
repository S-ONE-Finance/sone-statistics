import React from 'react'
import styled from 'styled-components'

import { RowFixed } from '../Row'
import { TYPE } from '../../theme'
import { ArrowDown, ArrowUp } from 'react-feather'

import { getFormatNumber } from '../../utils'

interface PairInfoProps {
  pairName: string
  tokenPrice: number
  tokenPriceChange: number
}

const PairInfoWrapper = styled(RowFixed)`
  align-items: center;
  height: 100%;
  //width: max-content; // May cause a stalled interface error when updating the data.
  //padding: 0 45px;
  width: 350px;
  padding: 0 2rem;
  display: flex;
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 200px;
    padding: 0 12.5px;
  `};
`

const Text = {
  PairName: styled(TYPE.black)`
    ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 11px;
    `};
  `,
  ChangeAmount: styled(TYPE.black)`
    margin-left: 10px !important;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 11px;
    margin-left: 5px !important;
    `};
  `,
  Up: styled(TYPE.green1Sone)`
    display: flex;
    align-items: center;
    font-weight: 400 !important;
    margin-left: 10px !important;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 11px;
    margin-left: 5px !important;
    `};
  `,
  Down: styled(TYPE.red1Sone)`
    display: flex;
    align-items: center;
    font-weight: 400 !important;
    margin-left: 10px !important;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 11px;
    margin-left: 5px !important;
    `};
  `,
}

const ResponsiveArrowUp = styled(ArrowUp)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 15px;
    height: 15px;
  `};
`

const ResponsiveArrowDown = styled(ArrowDown)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 15px;
    height: 15px;
  `};
`

export default function PairInfo({ pairName, tokenPrice, tokenPriceChange }: PairInfoProps) {
  const formattedTokenPrice = getFormatNumber(tokenPrice, 6)
  const formattedTokenPriceChange =
    tokenPriceChange > 0 ? getFormatNumber(tokenPriceChange, 2) : getFormatNumber(tokenPriceChange * -1, 2)

  return (
    <PairInfoWrapper>
      <Text.PairName>{pairName}</Text.PairName>
      <Text.ChangeAmount>{formattedTokenPrice}</Text.ChangeAmount>
      {tokenPriceChange > 0 ? (
        <Text.Up>
          <ResponsiveArrowUp size={19} />
          <span>+{formattedTokenPriceChange}%</span>
        </Text.Up>
      ) : (
        <Text.Down>
          <ResponsiveArrowDown size={19} />
          <span>−{formattedTokenPriceChange}%</span>
        </Text.Down>
      )}
    </PairInfoWrapper>
  )
}
