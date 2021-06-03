import React from 'react'
import { ThemeProvider as StyledComponentsThemeProvider, css, createGlobalStyle } from 'styled-components'
import { useDarkModeManager } from '../contexts/LocalStorage'
import styled from 'styled-components'
import { Text } from 'rebass'
import backgroundImage from '../assets/background-light.svg'
import backgroundImageDark from '../assets/background-dark.svg'

export default function ThemeProvider({ children }) {
  const [darkMode] = useDarkModeManager()
  // console.log('statusTheme----------', darkMode);
  return <StyledComponentsThemeProvider statusTheme={darkMode}  theme={theme(darkMode)}>{children}</StyledComponentsThemeProvider>
}

export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 768,
  upToMedium: 992,
  upToLarge: 1400,
  upToExtraLarge: 1920,
}

const mediaWidthTemplates = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
  accumulator[size] = (a, b, c) => css`
    @media (max-width: ${MEDIA_WIDTHS[size]}px) {
      ${css(a, b, c)}
    }
  `
  return accumulator
}, {})

const theme = (darkMode, color) => ({
  mediaWidth: mediaWidthTemplates,

  customColor: color,
  textColor: darkMode ? color : 'black',

  panelColor: darkMode ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0)',
  backgroundColor: darkMode ? '#212429' : '#F7F8FA',

  uniswapPink: darkMode ? '#ff007a' : 'black',

  concreteGray: darkMode ? '#292C2F' : '#FAFAFA',
  inputBackground: darkMode ? '#1F1F1F' : '#FAFAFA',
  shadowColor: darkMode ? '#000' : '#2F80ED',
  mercuryGray: darkMode ? '#333333' : '#E1E1E1',

  text1: darkMode ? '#FAFAFA' : '#1F1F1F',
  text2: darkMode ? '#C3C5CB' : '#565A69',
  text3: darkMode ? '#6C7284' : '#888D9B',
  text4: darkMode ? '#565A69' : '#C3C5CB',
  text5: darkMode ? '#2C2F36' : '#EDEEF2',

  // special case text types
  white: '#FFFFFF',

  // backgrounds / greys
  bg1: darkMode ? '#212429' : '#FAFAFA',
  bg2: darkMode ? '#2C2F36' : '#F7F8FA',
  bg3: darkMode ? '#40444F' : '#EDEEF2',
  bg4: darkMode ? '#565A69' : '#CED0D9',
  bg5: darkMode ? '#565A69' : '#888D9B',
  bg6: darkMode ? '#000' : '#FFFFFF',

  //specialty colors
  modalBG: darkMode ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.6)',
  advancedBG: darkMode ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,1)',
  onlyLight: darkMode ? '#0A1C29' : 'transparent',
  divider: darkMode ? 'rgba(43, 43, 43, 0.435)' : 'rgba(43, 43, 43, 0.035)',

  //primary colors
  primary1: darkMode ? '#2172E5' : '#ff007a',
  primary2: darkMode ? '#3680E7' : '#FF8CC3',
  primary3: darkMode ? '#4D8FEA' : '#FF99C9',
  primary4: darkMode ? '#376bad70' : '#F6DDE8',
  primary5: darkMode ? '#153d6f70' : '#FDEAF1',

  // color text
  primaryText1: darkMode ? '#6da8ff' : '#ff007a',

  // secondary colors
  secondary1: darkMode ? '#2172E5' : '#ff007a',
  secondary2: darkMode ? '#17000b26' : '#F6DDE8',
  secondary3: darkMode ? '#17000b26' : '#FDEAF1',

  shadow1: darkMode ? '#000' : '#2F80ED',

  // other
  red1: '#FF6871',
  green1: '#27AE60',
  yellow1: '#FFE270',
  yellow2: '#F3841E',
  link: '#2172E5',
  blue: '2f80ed',
  gray: '#F3F3F3',

  background: darkMode ? 'black' : `radial-gradient(50% 50% at 50% 50%, #ff007a30 0%, #fff 0%)`,
  bgImage: darkMode ? backgroundImageDark : backgroundImage,

  // S-ONE
  textBlack: '#333333',
  text1Sone: darkMode ? '#FFFFFF' : '#111111',
  text2Sone: darkMode ? '#7AA3E5' : '#111111',
  text3Sone: darkMode ? '#FFFFFF' : '#767676',
  text4Sone: darkMode ? '#AAAAAA' : '#767676',
  text5Sone: '#3FAAB0',
  text6Sone: darkMode ? '#FFFFFF' : '#333333',
  text7Sone: darkMode ? '#56CFD6' : '#65BAC5',
  text8Sone: '#767676',
  text9Sone: '#C9C9C9',
  text10Sone: darkMode ? '#AAAAAA' : '#333333',

  red1Sone: '#F05359',
  green1Sone: '#7AC51B',

  bg1Sone: darkMode ? '#0E2B4A' : '#FFFFFF',
  bg2Sone: darkMode ? '#3B5183' : '#FAEDED',
  bg3Sone: darkMode ? '#3B5183' : '#FFFFFF',
  bg4Sone: darkMode ? '#111111' : '#F3F3F3',
  bg5Sone: '#DFDFDF',
  bgTable: darkMode ? '#0A1C29' : '#FFFFFF',
  bgInputPanel: darkMode ? 'transparent' : '#F3F3F3',

  border1Sone: darkMode ? '#AAAAAA' : '#C9C9C9',
  border2Sone: darkMode ? '#AAAAAA' : 'transparent',
  border3Sone: darkMode ? '#FFFFFF' : '#DFDFDF',
  stroke1Sone: darkMode ? '#3FAAB0' : '#F05359',
  divider1Sone: darkMode ? '#AAAAAA' : 'rgba(0, 0, 0, 0.25)',
  scrollbarThumb: darkMode ? '#3B5183' : '#808080',
  closeIcon: darkMode ? '#AAAAAA' : '#000000',

  // Tab
  tabBg: darkMode ? '#3B5183' : '#F3F3F3',
  tabBgActive: darkMode ? '#ECECEC' : '#3FAAB0',
  tabText: darkMode ? '#7AA3E5' : '#C9C9C9',
  tabTextActive: darkMode ? '#4F4F4F' : '#FFFFFF',

  // Others
  f3f3f3: '#F3F3F3',
  tableCellOddBackground: darkMode ? '#0A1C29' : '#F3F3F3',
})

const TextWrapper = styled(Text)`
  color: ${({ color, theme }) => theme[color]};
`

export const TYPE = {
  main(props) {
    return <TextWrapper fontWeight={500} fontSize={14} color={'text1'} {...props} />
  },

  body(props) {
    return <TextWrapper fontWeight={400} fontSize={14} color={'text1'} {...props} />
  },

  small(props) {
    return <TextWrapper fontWeight={500} fontSize={11} color={'text1'} {...props} />
  },

  header(props) {
    return <TextWrapper fontWeight={600} color={'text1'} {...props} />
  },

  largeHeader(props) {
    return <TextWrapper fontWeight={500} color={'text1'} fontSize={24} {...props} />
  },

  light(props) {
    return <TextWrapper fontWeight={400} color={'text3'} fontSize={14} {...props} />
  },

  pink(props) {
    return <TextWrapper fontWeight={props.faded ? 400 : 600} color={props.faded ? 'text1' : 'text1'} {...props} />
  },

  black(props) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },

  green1Sone(props) {
    return <TextWrapper fontWeight={500} color={'green1Sone'} {...props} />
  },

  red1Sone(props) {
    return <TextWrapper fontWeight={500} color={'red1Sone'} {...props} />
  },

  language(props) {
    return <TextWrapper fontWeight={500} color={'text2Sone'} {...props} />
  },
}

export const Hover = styled.div`
  :hover {
    cursor: pointer;
  }
`

export const Link = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;
  :hover {
    text-decoration: underline;
  }
  :focus {
    outline: none;
    text-decoration: underline;
  }
  :active {
    text-decoration: none;
  }
`

export const ThemedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  max-width: 100vw !important;
  height: 200vh;
  mix-blend-mode: color;
  background: ${({ backgroundColor }) =>
    `radial-gradient(50% 50% at 50% 50%, ${backgroundColor} 0%, rgba(255, 255, 255, 0) 100%)`};
  position: absolute;
  top: 0px;
  left: 0px;
  /* z-index: ; */

  transform: translateY(-110vh);
`

export const GlobalStyle = createGlobalStyle`
  @import url('https://rsms.me/inter/inter.css');
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
  
  html {
    font-family: 'Roboto', sans-serif;
  }
  
  @supports (font-variation-settings: normal) {
    html { font-family: 'Roboto', sans-serif; }
  }
  
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-size: 16px;
    background-color: ${({ theme }) => theme.bg1Sone};
  }

  a {
    text-decoration: none;

    :hover {
      text-decoration: none
    }
  }

  
.three-line-legend {
	width: 100%;
	height: 70px;
	position: absolute;
	padding: 8px;
	font-size: 12px;
	color: #20262E;
	background-color: rgba(255, 255, 255, 0.23);
	text-align: left;
	z-index: 10;
  pointer-events: none;
}

.three-line-legend-dark {
	width: 100%;
	height: 70px;
	position: absolute;
	padding: 8px;
	font-size: 12px;
	color: white;
	background-color: rgba(255, 255, 255, 0.23);
	text-align: left;
	z-index: 10;
  pointer-events: none;
}

@media screen and (max-width: 800px) {
  .three-line-legend {
    display: none !important;
  }
}

.tv-lightweight-charts{
  width: 100% !important;
  

  & > * {
    width: 100% !important;
  }
}


  html {
    font-size: 1rem;
    font-variant: none;
    color: 'black';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    height: 100%;
  }
`
