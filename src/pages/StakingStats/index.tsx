import React from 'react'
import { Box } from '@material-ui/core'
import CommonStatistics from '../../components/CommonStatistics'
import PoolTable from '../../components/PoolTable'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${({ theme }) => theme.bgImage});
  background-size: cover;
  padding-top: 108px; // Lấy từ PageWrapper cho đồng bộ.
  margin-bottom: 80px;

  > * {
    max-width: 1400px;
    margin: 0 auto;
  }

  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin-bottom: 140px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding-top: 0;
  `}
`

const Title = styled.div`
  color: ${({ theme }) => theme.text6Sone};
  font-size: 40px;
  font-weight: 500;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 20px;
    font-weight: 700;
    text-align: center;
  `}
`

export default function Dashboard() {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <div>
        <Box mb={0.5} px={4}>
          <Title>{t('Staking Statistics')}</Title>
        </Box>
        <Box mb={2}>
          <CommonStatistics />
        </Box>
        <Box px={2}>
          <PoolTable />
        </Box>
      </div>
    </Wrapper>
  )
}
