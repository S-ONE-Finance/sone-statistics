import React from 'react'
import styled, { ThemeContext } from 'styled-components'
import { AutoRow, RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import { CustomLink } from '../../components/Link'
import LPList from '../../components/LPList'
import { useTopLps } from '../../contexts/GlobalData'

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;

  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`
function AccountStatics() {
  const topLps = useTopLps()
  return (
    <div className="tab-account">
      <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
        <RowBetween>
          <TYPE.main fontSize={'2.125rem'} style={{ whiteSpace: 'nowrap' }}>
            Top Accounts
          </TYPE.main>
          <CustomLink className="btnLink" to={'/accounts'}>
            See more
          </CustomLink>
        </RowBetween>
      </ListOptions>
      <LPList lps={topLps} />
    </div>
  )
}

export default AccountStatics
