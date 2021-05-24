/**
 * "MobileMenu" is the content inside a modal.
 * On mobile devices, when the user presses the hamburger icon (menu), the modal will pop up.
 */

import React, { useCallback } from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'
import { ReactComponent as Close } from '../../assets/x.svg'
import Column from '../Column'

export const CloseIcon = styled.div`
  position: absolute;
  right: 2rem;
  top: 2.5rem;

  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    top: 1.75rem;
  `};
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.closeIcon};
  }
`

const ColumnWrapper = styled(Column)<{ padding?: string }>`
  width: 100%;
  padding-top: 1rem;
  background-color: ${({ theme }) => theme.bg1Sone};
  position: relative;

  & > * {
    padding: 1rem;
  }

  & > *:not(:last-child) {
    border-bottom: ${({ theme }) => `1px solid ${theme.divider1Sone}`};
  }
`

const TextBoxChangeAccount = styled.div`
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  color: #3faab0;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  :hover {
    color: ${`${lighten(0.05, '#3FAAB0')}`};
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled.a.attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text1Sone};
  font-size: 16px;
  width: fit-content;
  font-weight: 700;
  display: flex;
  align-items: center;
  position: relative;
  padding-bottom: 0.75rem;

  &.${activeClassName} {
    color: ${({ theme }) => theme.red1Sone};
  }

  :hover,
  :focus {
    color: ${({ theme }) => theme.red1Sone};
  }
`

// The same style as StyledNavLink
const StyledExternalLink = styled.a.attrs({
  activeClassName,
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text1Sone};
  font-size: 16px;
  width: fit-content;
  font-weight: 700;
  display: flex;
  align-items: center;
  padding-bottom: 0.75rem;

  :hover,
  :focus {
    color: ${({ theme }) => theme.red1Sone};
  }

  ::after {
    font-family: 'Inter var', sans-serif;
    content: ' ↗';
    font-size: 14px;
    margin-left: 0.25rem;
    margin-top: -0.25rem;
  }
`

interface MobileMenuProps {
  setIsShowMobileMenu: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MobileMenu({ setIsShowMobileMenu }: MobileMenuProps) {
  const closeModal = useCallback(() => {
    setIsShowMobileMenu(false)
  }, [setIsShowMobileMenu])

  return (
    <ColumnWrapper onClick={closeModal}>
      <Column>
        <CloseIcon>
          <CloseColor />
        </CloseIcon>
        <StyledExternalLink href={'https://www.lipsum.com/'}>S-ONE Wallet</StyledExternalLink>
        <StyledNavLink href={'https://www.lipsum.com/'}>Swap</StyledNavLink>
        <StyledNavLink href={'https://www.lipsum.com/'}>Liquidity</StyledNavLink>
        <StyledNavLink href={'https://www.lipsum.com/'}>Staking</StyledNavLink>
        <StyledExternalLink href={'https://www.lipsum.com/'}>Swap Stats</StyledExternalLink>
        <StyledExternalLink href={'https://www.lipsum.com/'}>Staking Stats</StyledExternalLink>
        <StyledExternalLink href={'https://www.lipsum.com/'}>White Paper</StyledExternalLink>
        <StyledExternalLink href={'https://www.lipsum.com/'}>FAQ</StyledExternalLink>
        <StyledExternalLink href={'https://www.lipsum.com/'}>Blog</StyledExternalLink>
      </Column>
    </ColumnWrapper>
  )
}
