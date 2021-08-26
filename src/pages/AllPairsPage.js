import React, { useEffect, useState } from 'react'
import 'feather-icons'
import Panel from '../components/Panel'
import { useAllPairData } from '../contexts/PairData'
import PairList from '../components/PairList'
import { FullWrapper, PageWrapper } from '../components'
import { AutoRow } from '../components/Row'
import QuestionHelper from '../components/QuestionHelper'
import CheckBox from '../components/Checkbox'
import styled from 'styled-components'

function AllPairsPage() {
  const allPairs = useAllPairData()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [useTracked, setUseTracked] = useState(true)

  const StylePanel = styled(Panel)`
    padding: 0;
    background-color: transparent;
    border: 0;
    box-shadow: none;
  `

  return (
    <PageWrapper>
      <FullWrapper>
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
