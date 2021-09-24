import React, { useEffect } from 'react'
import 'feather-icons'

import TopTokenList from '../components/TokenList'
import Panel from '../components/Panel'
import { useAllTokenData } from '../contexts/TokenData'
import { PageWrapper, FullWrapper } from '../components'
import styled from 'styled-components'

function AllTokensPage() {
  const allTokens = useAllTokenData()

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
        <StylePanel>
          <TopTokenList tokens={allTokens} itemMax={5} />
        </StylePanel>
      </FullWrapper>
    </PageWrapper>
  )
}

export default AllTokensPage
