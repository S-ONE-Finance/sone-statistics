/**
 * "MobileMenu" is the content inside a modal.
 * On mobile devices, when the user presses the hamburger icon (menu), the modal will pop up.
 */

import React, { useCallback } from 'react'
import styled from 'styled-components'
import { ReactComponent as Close } from '../../assets/x.svg'
import Column from '../Column'
import {
  S_ONE_APP_URL,
  S_ONE_BLOG_URL,
  S_ONE_FAQ_URL,
  S_ONE_TOP_PAGE_URL,
  S_ONE_WHITE_PAPER_URL,
} from '../../constants/urls'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
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
  const { t } = useTranslation()

  return (
    <ColumnWrapper onClick={closeModal}>
      <Column>
        <CloseIcon>
          <CloseColor />
        </CloseIcon>
        <StyledExternalLink href={S_ONE_TOP_PAGE_URL} target="_blank">
          {t('S-ONE Wallet')}
        </StyledExternalLink>
        <StyledExternalLink href={S_ONE_APP_URL + '/#/swap'} target="_blank">
          {t('Swap')}
        </StyledExternalLink>
        <StyledExternalLink href={S_ONE_APP_URL + '/#/add'} target="_blank">
          {t('Liquidity')}
        </StyledExternalLink>
        <StyledExternalLink href={S_ONE_APP_URL + '/#/staking'} target="_blank">
          {t('Staking')}
        </StyledExternalLink>
        <StyledNavLink to="/swap">{t('Swap Stats')}</StyledNavLink>
        <StyledNavLink to="/staking">{t('Staking Stats')}</StyledNavLink>
        <StyledExternalLink href={S_ONE_WHITE_PAPER_URL} target="_blank">
          {t('White Paper')}
        </StyledExternalLink>
        <StyledExternalLink href={S_ONE_FAQ_URL} target="_blank">
          {t('FAQ')}
        </StyledExternalLink>
        <StyledExternalLink href={S_ONE_BLOG_URL} target="_blank">
          {t('Blog')}
        </StyledExternalLink>
      </Column>
    </ColumnWrapper>
  )
}
