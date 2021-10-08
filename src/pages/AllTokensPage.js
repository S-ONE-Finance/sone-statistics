import React, { useEffect } from 'react'
import 'feather-icons'

import TopTokenList from '../components/TokenList'
import Panel from '../components/Panel'
import { useAllTokenData } from '../contexts/TokenData'
import { PageWrapper, FullWrapper } from '../components'
import styled from 'styled-components'
import { TYPE } from '../theme'
import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'

function AllTokensPage() {
  const allTokens = useAllTokenData()
  const { t } = useTranslation()
  const below600 = useMedia('(max-width: 600px)')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const StylePanel = styled(Panel)`
    padding: 0;
    background-color: transparent;
    border: 0;
    box-shadow: none;
  `
  return (
    <PageWrapper>
      <FullWrapper>
        <TYPE.main fontSize={below600 ? 20 : 40} style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
          {t('Top Tokens')}
        </TYPE.main>
        <StylePanel>
          <TopTokenList tokens={allTokens} itemMax={5} />
        </StylePanel>
      </FullWrapper>
    </PageWrapper>
  )
}

export default AllTokensPage
