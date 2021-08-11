import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@material-ui/core'
import _get from 'lodash.get'
import CommonStatistics from '../components/CommonStatistics'
import PoolTable from '../components/PoolTable'
import Service from '../services'
import useDashboardData from '../hooks/useDashboardData'
import { POOL_CONFIG, TOKEN_ADDRESS, TOKEN_ICON } from '../constants/tokens'
import { setCacheCommon, setCachePools } from '../utils/storage'
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

const Dashboard = () => {
  const { commonData, setCommonData, setPools } = useDashboardData()
  const [firstTime, setFirstTime] = useState(true)
  const priceInterval = useRef(null)
  const { t, i18n } = useTranslation()
  const reloadCommonData = () => {
    // Get token prices
    Promise.all([
      Service.getTokenPrice('LUA'),
      Service.getTokenPrice('USDC'),
      Service.getTokenPrice('TOMOE'),
      Service.getTokenPrice('ETH'),
      Service.getTokenPrice('USDT'),
      Service.getTokenPrice('FRONT'),
      Service.getTokenPrice('SUSHI'),
      Service.getTokenPrice('SRM'),
      Service.getTokenPrice('FTT'),
      Service.getTokenPrice('KAI'),
      Service.getTokenPrice('OM'),
    ]).then(
      ([
        luaPrice,
        usdcPrice,
        tomoePrice,
        ethPrice,
        usdtPrice,
        frontPrice,
        sushiPrice,
        srmPrice,
        fttPrice,
        kaiPrice,
        omPrice,
      ]) => {
        const newPrices = {
          luaPrice,
          usdcPrice,
          tomoePrice,
          ethPrice,
          usdtPrice,
          frontPrice,
          sushiPrice,
          srmPrice,
          fttPrice,
          kaiPrice,
          omPrice,
        }
        setCommonData(newPrices)

        // Cache common data
        setCacheCommon(newPrices)
      }
    )

    // Get total supply
    Service.getTotalSupply().then((totalSupply) => {
      setCommonData({ totalSupply })
      setCacheCommon({ totalSupply })
    })

    // Get total liquidity
    Service.getTotalLiquidityData().then((data) => {
      setCommonData({ totalLiquidity: data.totalLiquidity })
      setCacheCommon({ totalLiquidity: data.totalLiquidity })
    })
  }

  const reloadDashboardData = (data) => {
    // Request pool list
    Service.getPools()
      .then((newPools) => {
        const stakedRequests = newPools.map((row) => {
          const poolAddress = _get(
            POOL_CONFIG.find((item) => item.pid === row.pid),
            'poolAddress'
          )

          return Service.getTotalStaked(poolAddress)
        })
        const apyRequests = newPools.map((row) => {
          return Service.getPoolAPY({
            pid: row.pid,
            luaPrice: data.luaPrice,
            usdValue: row.usdValue,
          })
        })

        return Promise.all([Promise.all(stakedRequests), Promise.all(apyRequests)]).then(([valueList, apyList]) => {
          return newPools.map((row, rowIdx) => {
            const rowConfig = POOL_CONFIG.find((item) => item.pid === row.pid) || {}

            return {
              ...row,
              ...rowConfig,
              totalStaked: valueList[rowIdx],
              apy: apyList[rowIdx],
            }
          })
        })
      })
      .then((newPools) => {
        const updatedPools = newPools.map((row) => ({
          ...row,
          token1Address: TOKEN_ADDRESS[row.token1Symbol] || '',
          token2Address: TOKEN_ADDRESS[row.token2Symbol] || '',
          token1Icon: TOKEN_ICON[row.token1Symbol] || '',
          token2Icon: TOKEN_ICON[row.token2Symbol] || '',
        }))
        setPools(updatedPools)

        // Cache pool list
        setCachePools(updatedPools)
      })
  }

  useEffect(() => {
    // Initialize common data
    reloadCommonData()

    return () => clearInterval(priceInterval.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (firstTime && commonData && commonData.luaPrice) {
      setFirstTime(false)
      reloadDashboardData(commonData)
      // Set price request interval
      priceInterval.current = setInterval(() => reloadDashboardData(commonData), 60000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstTime, commonData])

  return (
    <>
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
    </>
  )
}

export default Dashboard
