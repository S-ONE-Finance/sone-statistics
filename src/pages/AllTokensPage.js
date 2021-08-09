import React, { useEffect } from 'react'
import 'feather-icons'

import TopTokenList from '../components/TokenList'
import { TYPE } from '../theme'
import Panel from '../components/Panel'
import { useAllTokenData } from '../contexts/TokenData'
import { PageWrapper, FullWrapper } from '../components'
import { RowBetween } from '../components/Row'
import Search from '../components/Search'
import { useMedia } from 'react-use'
import styled from 'styled-components'
import { useDarkModeManager } from '../contexts/LocalStorage'
import { useTranslation } from 'react-i18next'

function AllTokensPage() {
  const allTokens = useAllTokenData()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const below600 = useMedia('(max-width: 800px)')

  const [isDarkMode] = useDarkModeManager()
  const { t, i18n } = useTranslation()

  const StylePanel = styled(Panel)`
    padding: 0;
    background-color: transparent;
    border: 0;
    box-shadow: none;
  `
  return (
    <PageWrapper>
      <FullWrapper>
        <RowBetween>
          <TYPE.largeHeader fontSize={'2.125rem'}>{t('Top Tokens')}</TYPE.largeHeader>
          {!below600 && <Search small={true} />}
        </RowBetween>

        <StylePanel>
          <TopTokenList tokens={allTokens} itemMax={50} />
        </StylePanel>
      </FullWrapper>
    </PageWrapper>
  )
}

export default AllTokensPage
