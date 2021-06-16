import React from 'react'
import { AutoRow, RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import { CustomLink } from '../../components/Link'
import styled from 'styled-components'
import { useGlobalTransactions } from '../../contexts/GlobalData'
import TxnList from '../../components/TxnList'

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
  @media screen and (max-width: 640px) {
    font-size: 1rem;
    margin-top: 1rem;
  }
`

function TransactionStatics(props) {
  const transactions = useGlobalTransactions()
  return (
    <div>
      <ListOptions gap="10px">
        <RowBetween>
          <TYPE.main fontSize={'2.125rem'} style={{ whiteSpace: 'nowrap' }}>
            Transactions
          </TYPE.main>
        </RowBetween>
      </ListOptions>
      <TxnList transactions={transactions} />
    </div>
  )
}

export default TransactionStatics
