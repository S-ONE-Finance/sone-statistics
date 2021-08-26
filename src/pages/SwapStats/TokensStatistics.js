import React from 'react'
import { AutoRow, RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import { CustomLink } from '../../components/Link'
import TopTokenList from '../../components/TokenList'
import styled from 'styled-components'
import { useAllTokenData } from '../../contexts/TokenData'
import { useMedia } from 'react-use'
import { useTranslation } from 'react-i18next'

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  @media screen and (max-width: 640px) {
    font-size: 1rem;
    margin-top: 1rem;
  }
`

function TokensStatistics({ ...props }) {
  const allTokens = useAllTokenData()
  const { t, i18n } = useTranslation()
  const below600 = useMedia('(max-width: 600px)')

  return (
    <div className="box-main-content-tokens">
      <ListOptions gap="10px">
        <RowBetween>
          <TYPE.main fontSize={below600 ? 20 : 40} style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
            {t('Top Tokens')}
          </TYPE.main>
          <CustomLink style={{ color: '#3FAAB0' }} to={'/swap/tokens'}>
            {t('See more')}
          </CustomLink>
        </RowBetween>
      </ListOptions>
      {/* <Panel style={{ marginTop: '6px', padding: '2.125rem 0 ' }}> */}
      <TopTokenList tokens={allTokens} />
      {/* </Panel> */}
    </div>
  )
}

export default TokensStatistics
