import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Globe, Menu as MenuIcon, Moon, Sun } from 'react-feather'
import { isMobile } from 'react-device-detect'

import Logo from '../../assets/logo_text_sone.svg'
import LogoDark from '../../assets/logo_text_white_sone.svg'

import { useDarkModeManager } from '../../contexts/LocalStorage'
import useLanguage from '../../hooks/useLanguage'

import { TYPE } from '../../theme'
import Row, { RowFixed } from '../Row'
import Modal from '../Modal'
import MobileMenu from '../MobileMenu'

const activeClassName = 'ACTIVE'

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: absolute;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 0 80px;
  z-index: 3;
  background-color: ${({ theme }) => theme.bg1Sone};
  box-sizing: border-box;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 1rem;
  }

  & > *:first-child {
    margin-left: 0;
  }

  ${({ theme }) => theme.mediaWidth.upToLarge`
    flex-direction: row-reverse;
    align-items: center;

    & > *:last-child {
      margin-left: 0 !important;
    }

    & > *:first-child {
      margin-left: 0.5rem !important;
    }
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToLarge`
   width: 100%;
  `};
`

const HeaderMenu = styled(Row)`
  margin-left: 87.52px;
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    justify-content: flex-end;
`};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 1rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text1Sone};
  font-size: 18px;
  width: fit-content;
  font-weight: 400;
  height: 70px;
  display: flex;
  align-items: center;
  position: relative;

  &.${activeClassName} {
    color: ${({ theme }) => theme.red1Sone};

    ::after {
      content: '';
      width: 100%;
      height: 4px;
      background-color: ${({ theme }) => theme.red1Sone};
      position: absolute;
      bottom: 0;
    }
  }

  :hover {
    color: ${({ theme }) => theme.red1Sone};
  }
`

// The same style as StyledNavLink
const StyledExternalLink = styled.a`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text1Sone};
  font-size: 18px;
  width: fit-content;
  font-weight: 400;
  height: 70px;
  display: flex;
  align-items: center;

  :hover {
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

// Put `display` in props to cast block during dev.
const SubMenu = styled.div<{ width?: string; borderRadius?: string; display?: string }>`
  position: absolute;
  top: calc(70px + 1rem);
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.24);
  background-color: ${({ theme }) => theme.bg1Sone};
  border-radius: ${({ borderRadius }) => borderRadius ?? '10px'};
  width: ${({ width }) => width ?? '172px'};
  cursor: default;
  display: ${({ display }) => display ?? 'none'};
`

// The last submenu in the top must be right-aligned, not centered.
const ResponsiveTopEndSubMenu = styled(SubMenu)`
  ${({ theme }) => theme.mediaWidth.upToLarge`
    left: unset;
    transform: none;
    right: 0;
  `}
`

// Put submenu cling to the bottom right of the screen.
const ResponsiveBottomRightSubMenu = styled(SubMenu)`
  ${({ theme }) => theme.mediaWidth.upToLarge`
    top: unset;
    bottom: calc(70px + 1rem);
    transform: none;
    left: unset;
    right: 0;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    transform: translateX(25%);
  `}
`

const SubMenuItemNavLink = styled(NavLink)`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text1Sone};
  font-size: 18px;
  font-weight: 400;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  :hover {
    color: ${({ theme }) => theme.red1Sone};
    background-color: ${({ theme }) => theme.bg2Sone};
  }
`

// The same style as SubMenuItemNavLink.
const SubMenuItemExternalLink = styled.a<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text1Sone};
  font-size: 18px;
  font-weight: 400;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  :hover {
    color: ${({ theme }) => theme.red1Sone};
    background-color: ${({ theme }) => theme.bg2Sone};
    text-decoration: none;
  }
`

// The same style as SubMenuItemNavLink.
const SubMenuItemText = styled.span`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text1Sone};
  font-size: 18px;
  font-weight: 400;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  :hover {
    color: ${({ theme }) => theme.red1Sone};
    background-color: ${({ theme }) => theme.bg2Sone};
    text-decoration: none;
  }
`

export const StyledMenuButton = styled.button<{ cursor?: string; primary?: boolean }>`
  position: relative;
  width: max-content;
  border: none;
  background-color: ${({ theme, primary }) => (primary ? theme.red1Sone : theme.bg3Sone)};
  height: 35px;
  margin: 0 0 0 1rem;
  padding: 0.15rem 1rem;
  border-radius: 20px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.12);
  cursor: ${({ cursor }) => cursor || 'default'};
  outline: none;

  :hover {
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }

  > * {
    stroke: ${({ theme, primary }) => (primary ? '#FFFFFF' : theme.stroke1Sone)};
  }
`

const StyledMenuButtonWithText = styled(StyledMenuButton)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const MenuItem = styled.div.attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: default;
  text-decoration: none;
  color: ${({ theme }) => theme.text1Sone};
  font-size: 18px;
  width: fit-content;
  margin-left: 60px;
  font-weight: 400;
  height: 70px;
  display: flex;
  align-items: center;
  position: relative;

  :hover {
    color: ${({ theme }) => theme.red1Sone};

    ${SubMenu} {
      display: block;
    }

    ${StyledMenuButton} {
      outline: none;
      background-color: ${({ theme }) => theme.bg4};
    }
  }

  ::before {
    content: '';
    display: block;
    position: absolute;
    width: calc(100% + 2rem);
    height: 1rem;
    left: 50%;
    transform: translateX(-50%);
    cursor: default;
    bottom: -1rem;
  }
`

// Khi màn hình kéo về large thì phải hover lên trên menuitem phải giữ submenu hiện ra.
const ResponsiveMenuItem = styled(MenuItem)`
  ::before {
    ${({ theme }) => theme.mediaWidth.upToLarge`
      bottom: unset;
      top: -1rem;
    `}
  }
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
  box-sizing: border-box;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    background-color: ${({ theme }) => theme.bg1Sone};
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    justify-content: center;
  `};
`

const AccountElement = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  /* cursor: pointer; */

  :focus {
    border: 1px solid blue;
  }
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const HideExtraSmall = styled.div`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const ShowOnlyExtraSmall = styled.div`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: inherit;
  `};
`

export default function Header() {
  const [language, setLanguage] = useLanguage()
  const [darkMode, toggleDarkMode] = useDarkModeManager()

  const [isShowMobileMenu, setIsShowMobileMenu] = useState(false)

  return (
    <>
      <Modal isOpen={isShowMobileMenu} onDismiss={() => setIsShowMobileMenu(false)} isBottomOnMobile={true}>
        <MobileMenu setIsShowMobileMenu={setIsShowMobileMenu} />
      </Modal>
      <HeaderFrame>
        {/* NOTE: Cái này là modal thông báo claim uni, sau này cho thành clame sone modal, giờ chưa cần sử dụng. */}
        {/*<ClaimModal />*/}
        <HideExtraSmall>
          <HeaderRow>
            <Title href="https://www.lipsum.com/" target="_blank">
              <img width={'100px'} src={darkMode ? LogoDark : Logo} alt="logo" />
            </Title>
            <HeaderMenu>
              <HideSmall>
                <StyledExternalLink href={'https://www.lipsum.com/'}>S-ONE Wallet</StyledExternalLink>
              </HideSmall>
              <MenuItem>
                <StyledNavLink
                  to={'/swap'}
                  isActive={(match, { pathname }) =>
                    Boolean(match) || pathname.startsWith('/swap') || pathname.startsWith('/add')
                  }
                >
                  Swap
                </StyledNavLink>
                <SubMenu>
                  <SubMenuItemNavLink to={'/swap'}>Swap</SubMenuItemNavLink>
                  <SubMenuItemNavLink id={`pool-nav-link`} to={'/add'}>
                    Liquidity
                  </SubMenuItemNavLink>
                </SubMenu>
              </MenuItem>
              <MenuItem>
                <StyledNavLink to={'/uni'}>Staking</StyledNavLink>
              </MenuItem>
              <MenuItem>
                <StyledExternalLink
                  href={isMobile ? '' : 'https://www.lipsum.com/'}
                  target={isMobile ? '_self' : '_blank'}
                >
                  Stats
                </StyledExternalLink>
                <SubMenu>
                  <SubMenuItemNavLink to={'/stats'}>Swap Stats</SubMenuItemNavLink>
                  <SubMenuItemNavLink to={'/staking'}>Staking Stats</SubMenuItemNavLink>
                </SubMenu>
              </MenuItem>
              <MenuItem>
                <StyledExternalLink
                  href={isMobile ? '' : 'https://docs.s-one.finance/'}
                  target={isMobile ? '_self' : '_blank'}
                >
                  Docs
                </StyledExternalLink>
                <ResponsiveTopEndSubMenu>
                  <SubMenuItemExternalLink href={'https://www.lipsum.com/'}>White Paper</SubMenuItemExternalLink>
                  <SubMenuItemExternalLink href={'https://www.lipsum.com/'}>FAQ</SubMenuItemExternalLink>
                  <SubMenuItemExternalLink href={'https://www.lipsum.com/'}>Blog</SubMenuItemExternalLink>
                </ResponsiveTopEndSubMenu>
              </MenuItem>
            </HeaderMenu>
          </HeaderRow>
        </HideExtraSmall>
        <HeaderControls>
          <HeaderElement>
            <HideExtraSmall>
              <AccountElement style={{ pointerEvents: 'auto' }}>{/*<PendingStatus />*/}</AccountElement>
            </HideExtraSmall>
            <ResponsiveMenuItem>
              <AccountElement style={{ pointerEvents: 'auto' }}>{/*<Web3Status />*/}</AccountElement>
            </ResponsiveMenuItem>
          </HeaderElement>
          <HeaderElementWrap>
            <StyledMenuButton onClick={() => toggleDarkMode()} cursor="pointer">
              {darkMode ? <Moon size={20} strokeWidth={2.5} /> : <Sun size={20} strokeWidth={2.5} />}
            </StyledMenuButton>
            <ResponsiveMenuItem style={{ margin: '0' }}>
              <StyledMenuButtonWithText>
                <Globe size={20} />
                {/* Only support 3 languages */}
                <TYPE.language style={{ marginLeft: '5px' }}>
                  {language === 'en' ? 'EN' : language === 'jp' ? '日本語' : language === 'zh-CN' ? '中文' : 'EN'}
                </TYPE.language>
              </StyledMenuButtonWithText>
              <ResponsiveBottomRightSubMenu>
                <SubMenuItemText onClick={() => setLanguage('jp')}>日本語</SubMenuItemText>
                <SubMenuItemText onClick={() => setLanguage('en')}>English</SubMenuItemText>
                <SubMenuItemText onClick={() => setLanguage('zh-CN')}>中文</SubMenuItemText>
              </ResponsiveBottomRightSubMenu>
            </ResponsiveMenuItem>
            <ShowOnlyExtraSmall>
              <StyledMenuButton primary={true} onClick={() => setIsShowMobileMenu(true)}>
                <MenuIcon size={20} strokeWidth={2.5} />
              </StyledMenuButton>
            </ShowOnlyExtraSmall>
          </HeaderElementWrap>
        </HeaderControls>
      </HeaderFrame>
    </>
  )
}
