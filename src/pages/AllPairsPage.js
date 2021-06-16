import React, { useEffect, useState } from 'react'
import 'feather-icons'

import { TYPE } from '../theme'
import Panel from '../components/Panel'
import { useAllPairData } from '../contexts/PairData'
import PairList from '../components/PairList'
import { PageWrapper, FullWrapper } from '../components'
import { RowBetween, AutoRow } from '../components/Row'
import Search from '../components/Search'
import { useMedia } from 'react-use'
import QuestionHelper from '../components/QuestionHelper'
import CheckBox from '../components/Checkbox'
import styled from 'styled-components'
import { useDarkModeManager } from '../contexts/LocalStorage'

function AllPairsPage() {
  const allPairs = useAllPairData()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const below800 = useMedia('(max-width: 800px)')

  const [useTracked, setUseTracked] = useState(true)
  const [isDarkMode] = useDarkModeManager()

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
          <TYPE.largeHeader>Top Pairs</TYPE.largeHeader>
          {!below800 && <Search small={true} />}
        </RowBetween>
        <AutoRow gap="4px">
          <CheckBox checked={useTracked} setChecked={() => setUseTracked(!useTracked)} text={'Hide untracked pairs'} />
          <QuestionHelper text="USD amounts may be inaccurate in low liquiidty pairs or pairs without ETH or stablecoins." />
        </AutoRow>
        <StylePanel>
          <PairList pairs={allPairs} disbaleLinks={true} maxItems={50} useTracked={useTracked} />
        </StylePanel>
      </FullWrapper>
    </PageWrapper>
  )
}

export default AllPairsPage
