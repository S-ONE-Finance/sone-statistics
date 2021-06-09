import React from 'react';
import styled from 'styled-components';
import { AutoRow, RowBetween } from '../../components/Row'
import { TYPE, ThemedBackground } from '../../theme'
const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;

  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`

function PairsStatistics({ }) {
	return (
		<>
			{/* <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
				<RowBetween>
					<TYPE.main fontSize={'2rem'} style={{ whiteSpace: 'nowrap' }}>
						Top Pairs
              </TYPE.main>
					<AutoRow gap="4px" width="100%" justifyContent="flex-end">
						<CustomLink to={'/pairs'}>See All</CustomLink>
					</AutoRow>
				</RowBetween>
			</ListOptions>
			<Panel style={{ marginTop: '6px', padding: '1.125rem 0 ' }}>
				<PairList pairs={allPairs} useTracked={useTracked} />
			</Panel> */}
		</>
	);
}

export default PairsStatistics;