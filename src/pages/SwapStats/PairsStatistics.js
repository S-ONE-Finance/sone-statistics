import React from 'react'
import styled from 'styled-components'
import { AutoRow, RowBetween } from '../../components/Row'
import { TYPE, ThemedBackground } from '../../theme'
import Panel from '../../components/Panel'
import { CustomLink } from '../../components/Link'
import PairList from '../../components/PairList'
import { useAllPairData } from '../../contexts/PairData'

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;

  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`

const StyleListOptions = styled(ListOptions)`
  margin-top: 2rem;
  margin-bottom: 0.5rem;
`

const StylePanel = styled(Panel)`
  margintop: 6px;
  padding: 0;
  border: 0;
  backgroundcolor: transparent;
`

function PairsStatistics({}) {
  const allPairs = useAllPairData()

  return (
    <>
      <StyleListOptions gap="10px" style={{}}>
        <RowBetween>
          <TYPE.main fontSize={'2rem'} style={{ whiteSpace: 'nowrap' }}>
            Top Pairs
          </TYPE.main>
          <AutoRow gap="4px" width="100%" justifyContent="flex-end">
            <CustomLink to={'/pairs'}>See All</CustomLink>
          </AutoRow>
        </RowBetween>
      </StyleListOptions>
      <Panel style={{}}>
        <PairList pairs={allPairs} />
      </Panel>
    </>
  )
}

export default PairsStatistics
