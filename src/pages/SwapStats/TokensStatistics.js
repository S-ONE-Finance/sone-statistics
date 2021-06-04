import React from 'react'
import { AutoRow, RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import { CustomLink } from '../../components/Link'
import TopTokenList from '../../components/TokenList'
import styled from 'styled-components'
import { useAllTokenData } from '../../contexts/TokenData'

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;

  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`

function TokensStatistics({ ...props }) {
  const allTokens = useAllTokenData()
  return (
    <div className="box-main-content-tokens">
      <div>
        <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
          <RowBetween>
            <TYPE.main fontSize={'2.125rem'} style={{ whiteSpace: 'nowrap' }}>
              Top Tokens
            </TYPE.main>
            <CustomLink to={'/tokens'}>See more</CustomLink>
          </RowBetween>
        </ListOptions>
        {/* <Panel style={{ marginTop: '6px', padding: '2.125rem 0 ' }}> */}
        <TopTokenList tokens={allTokens} />
        {/* </Panel> */}
      </div>
    </div>
  )
}

export default TokensStatistics
