import React from 'react'
import styled from 'styled-components'
import { AutoRow, RowBetween } from '../../components/Row'
import { TYPE, ThemedBackground } from '../../theme'
import Panel from '../../components/Panel'
import { CustomLink } from '../../components/Link'
import PairList from '../../components/PairList'
import { useAllPairData } from '../../contexts/PairData'
import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'

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
  padding: 0;
  border: 0;
  backgroundcolor: transparent;
`

const StylePanel = styled(Panel)`
  margintop: 6px;
  padding: 0;
  border: 0;
  backgroundcolor: transparent;
`

function PairsStatistics({}) {
  const allPairs = useAllPairData()
  const { t, i18n } = useTranslation()
  const below600 = useMedia('(max-width: 600px)')

  return (
    <>
      <StyleListOptions gap="10px">
        <RowBetween>
          <TYPE.main fontSize={below600 ? 20 : 40} style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
            {t('Top Pairs')}
          </TYPE.main>
          <AutoRow gap="4px" width="100%" justifyContent="flex-end">
            <CustomLink className="btnLink" to={'/swap/pairs'}>
              {t('See more')}
            </CustomLink>
          </AutoRow>
        </RowBetween>
      </StyleListOptions>
      <PairList pairs={allPairs} />
    </>
  )
}

export default PairsStatistics
