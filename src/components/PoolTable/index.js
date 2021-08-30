import React, { useCallback, useContext, useState } from 'react'
import {
  Box,
  CircularProgress,
  Link,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@material-ui/core'
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  ArrowRightAlt as ArrowRightAltIcon
} from '@material-ui/icons'
import _orderBy from 'lodash.orderby'
import { reduceFractionDigit } from '../../utils/number.js'
import { ThemeContext } from 'styled-components'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { useTranslation } from 'react-i18next'
import useFarms from '../../hooks/useFarms'
import TokenLogo from '../TokenLogo'
import { S_ONE_APP_URL } from '../../constants/urls'
import useOneSoneInUSD from '../../hooks/useOneSoneInUSD'

const useStyles = makeStyles((theme) => ({
  chip: {
    marginRight: 5,
  },
  tableContainer: {
    borderRadius: 40,
  },
  tableHeader: {
    border: 'none',
    // borderColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
  },
  sortable: {
    cursor: 'pointer',
  },
  tableHeaderText: {
    fontSize: 20,
    fontWeight: 700,
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
    },
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableCell: {
    minHeight: 200,
    border: 'none',
  },
  positive: {
    color: '#87d128',
  },
  negative: {
    color: 'red',
  },
  redirectBtn: {
    fontSize: 12,
    wordBreak: 'keep-all',
  },
  redirectIcon: {
    width: 15,
    height: 15,
    color: theme.palette.primary.main,
  },
  sortIcon: {
    marginLeft: 10,
    fontSize: 20,
  },
}))

const TABLE_COL_WIDTH = ['3%', '18%', '10%', '30%', '20%', '20%']
const TABLE_COL_MIN_WIDTH = [25, 100, 50, 250, 125, 125]

const LoadingIndicator = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress color="primary" size={70} thickness={3} />
    </Box>
  )
}

export const getTokenLogoURL = (address) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

const PoolRow = ({ farm }) => {
  const theme = useContext(ThemeContext)
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const classes = useStyles()

  const handleForwardToPool = ({ id }) => {
    window.open(`${S_ONE_APP_URL}/#/staking/${id}`, '_blank')
  }

  const { token0, token1 } = farm.liquidityPair

  const MIN_NUM = 1
  const stakedLpToken = Number(farm.balance) || MIN_NUM
  const totalSupply = Number(farm?.liquidityPair?.totalSupply) || MIN_NUM
  const reserve0 = Number(farm?.liquidityPair?.reserve0) || MIN_NUM
  const reserve1 = Number(farm?.liquidityPair?.reserve1) || MIN_NUM
  const stakedToken0 = reserve0 * (stakedLpToken / totalSupply)
  const stakedToken1 = reserve1 * (stakedLpToken / totalSupply)

  const bonusMultiplier = farm?.owner?.bonusMultiplier ?? 1
  const rewardPerBlock = farm && farm.rewardPerBlock * bonusMultiplier
  const soneInUSD = useOneSoneInUSD()
  const rewardPerBlockInUSD = rewardPerBlock * soneInUSD
  
  const lockedValue = Number(farm?.balanceUSD) ?? 0
  const lockedValueAndTotalSupplyRatio = (Number(farm?.balance) / totalSupply) * 100

  return (
    farm && (
      <TableRow
        className={classes.tableRow}
        style={{ background: farm.rowIdx % 2 === 0 ? theme.tableCellOddBackground : 'unset' }}
      >
        {!isUpToExtraSmall && (
          <TableCell className={classes.tableCell}>
            <Typography style={{ fontSize: 16, fontWeight: 400, float: 'right', color: theme.text4Sone }}>
              {farm.rowIdx}
            </Typography>
          </TableCell>
        )}
        <TableCell className={classes.tableCell}>
          <Box display="flex" alignItems="center" flexDirection={isUpToExtraSmall ? 'column' : 'row'}>
            <Box display="flex" marginBottom={isUpToExtraSmall ? '5px' : 0}>
              <Tooltip title={token0.symbol}>
                <TokenLogo address={token0.address} size={isUpToExtraSmall ? 24 : 36}/>
              </Tooltip>
              <Tooltip title={farm.liquidityPair.token1.symbol}>
                <TokenLogo address={token1.address} size={isUpToExtraSmall ? 24 : 36} style={{marginLeft: '-10px'}}/>
              </Tooltip>
            </Box>
            <Tooltip title={`Open ${farm.symbol} farm`}>
              <Link
                variant="nav"
                onClick={() => handleForwardToPool(farm)}
                className={classes.redirectBtn}
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: theme.text4Sone,
                  marginLeft: isUpToExtraSmall ? 0 : '10px',
                }}
              >
                {farm.symbol}
              </Link>
            </Tooltip>
          </Box>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <Typography
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: theme.text5Sone,
              textAlign: isUpToExtraSmall ? 'center' : 'unset',
            }}
          >{`${reduceFractionDigit(farm.roiPerYear * 100, 2)}%`}</Typography>
        </TableCell>
        {isUpToExtraSmall === false && (
          <>
            <TableCell className={classes.tableCell}>
              <Box display="flex" alignItems="baseline" mb={1}>
                <Typography style={{ fontSize: 16, color: theme.text4Sone }}>
                  {reduceFractionDigit(stakedToken0, 10)}&nbsp;
                </Typography>
                <Typography style={{ fontSize: 13, color: theme.text4Sone }}>{token0.symbol || ''}</Typography>
              </Box>
              <Box display="flex" alignItems="baseline">
                <Typography style={{ fontSize: 16, color: theme.text4Sone }}>
                  {reduceFractionDigit(stakedToken1, 10)}&nbsp;
                </Typography>
                <Typography style={{ fontSize: 13, color: theme.text4Sone }}>{token1.symbol || ''}</Typography>
              </Box>
            </TableCell>
            <TableCell className={classes.tableCell} style={{ color: theme.text4Sone }}>
              <ArrowRightAltIcon />
            </TableCell>
          </>
        )}
        {/* colSpan để cover lại chỗ trống của 2 thằng trên. */}
        <TableCell
          className={classes.tableCell}
          colSpan={isUpToExtraSmall ? 3 : 1}
          style={{ textAlign: isUpToExtraSmall ? 'center' : 'unset' }}
        >
          <Typography
            component="span"
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: theme.text6Sone,
            }}
          >
            {`${reduceFractionDigit(stakedLpToken, 6)}`}
          </Typography>
          <Typography component="span" style={{ fontSize: 13, fontWeight: 400, color: theme.text6Sone }}>
            {` ${(farm.symbol + " LP") || ''}`}
          </Typography>
        </TableCell>
        <TableCell className={classes.tableCell} style={{ textAlign: 'center' }}>
          <Typography
            style={{ marginBottom: 5, fontSize: isUpToExtraSmall ? 13 : 16, fontWeight: 700, color: theme.text6Sone }}
          >
            {`$${reduceFractionDigit(lockedValue, 6)}`}
          </Typography>
          <Typography style={{ fontSize: isUpToExtraSmall ? 13 : 16, fontWeight: 400, color: theme.text4Sone }}>
            {`${reduceFractionDigit(lockedValueAndTotalSupplyRatio, 2)}% of total`}
          </Typography>
        </TableCell>
        <TableCell className={classes.tableCell} style={{ textAlign: 'center' }}>
          <Box mb={1} display="flex" alignItems="baseline" justifyContent="center">
            <Typography style={{ fontSize: isUpToExtraSmall ? 13 : 16, fontWeight: 700, color: theme.text6Sone }}>
              {reduceFractionDigit(rewardPerBlock, 6)}&nbsp;
            </Typography>
            <Typography component="span" style={{ fontSize: 13, fontWeight: 700, color: theme.text6Sone }}>
              SONE
            </Typography>
          </Box>
          <Typography style={{ fontSize: isUpToExtraSmall ? 13 : 16, fontWeight: 400, color: theme.text4Sone }}>
            {`~ $${reduceFractionDigit(rewardPerBlockInUSD, 2)}`}
          </Typography>
        </TableCell>
      </TableRow>
    )
  )
}

export default function PoolTable() {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const classes = useStyles()
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  const [isLoading, farms] = useFarms()
  // console.log(`farms`, farms.map(farm => farm.balanceUSD))

  const [sortData, setSortData] = useState({})

  const getSortedPools = useCallback(() => {
    const sortingCols = Object.keys(sortData)
    if (sortingCols.length) {
      return _orderBy(farms, sortingCols, Object.values(sortData))
    }
    return farms
  }, [farms, sortData])

  const handleSort = (name) => {
    setSortData((oldData) => ({
      [name]: oldData[name] === 'desc' ? 'asc' : 'desc',
    }))
  }

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <TableContainer
      component={Paper}
      elevation={2}
      className={classes.tableContainer}
      style={{ background: theme.bg1Sone, marginBottom: '100px' }}
    >
      <Table aria-label="Pool table" style={{ background: theme.bg1Sone }}>
        <TableHead style={{ height: '81px' }}>
          <TableRow>
            {!isUpToExtraSmall && (
              <TableCell
                width={TABLE_COL_WIDTH[0]}
                style={{ minWidth: TABLE_COL_MIN_WIDTH[0] }}
                className={classes.tableHeader}
              />
            )}
            <TableCell
              onClick={() => handleSort('symbol')}
              width={TABLE_COL_WIDTH[1]}
              style={{ minWidth: TABLE_COL_MIN_WIDTH[1] }}
              className={`${classes.tableHeader} ${classes.sortable}`}
            >
              <Box display="flex" alignItems="center" justifyContent={isUpToExtraSmall ? 'center' : 'unset'}>
                <Typography
                  className={classes.tableHeaderText}
                  style={{ color: theme.text1Sone, marginLeft: isUpToExtraSmall ? 0 : '3vw' }}
                >
                  {t('Pairs')}
                </Typography>
                {sortData.symbol &&
                  (sortData.symbol === 'asc' ? (
                    <ArrowDropDownIcon className={classes.sortIcon} />
                  ) : (
                    <ArrowDropUpIcon className={classes.sortIcon} />
                  ))}
              </Box>
            </TableCell>
            <TableCell
              onClick={() => handleSort('roiPerYear')}
              width={TABLE_COL_WIDTH[2]}
              style={{ minWidth: TABLE_COL_MIN_WIDTH[2] }}
              className={`${classes.tableHeader} ${classes.sortable}`}
            >
              <Box display="flex" alignItems="center" justifyContent={isUpToExtraSmall ? 'center' : 'unset'}>
                <Typography className={classes.tableHeaderText} style={{ color: theme.text1Sone }}>
                  APY
                </Typography>
                {sortData.roiPerYear &&
                  (sortData.roiPerYear === 'asc' ? (
                    <ArrowDropDownIcon className={classes.sortIcon} />
                  ) : (
                    <ArrowDropUpIcon className={classes.sortIcon} />
                  ))}
              </Box>
            </TableCell>
            <TableCell
              width={TABLE_COL_WIDTH[3]}
              colSpan={3}
              style={{ minWidth: TABLE_COL_MIN_WIDTH[3] }}
              className={classes.tableHeader}
            >
              <Typography
                className={classes.tableHeaderText}
                style={{ color: theme.text1Sone, textAlign: isUpToExtraSmall ? 'center' : 'unset' }}
              >
                {t('Staked Value')}
              </Typography>
            </TableCell>
            <TableCell
              onClick={() => handleSort('balanceUSD')}
              width={TABLE_COL_WIDTH[4]}
              style={{ minWidth: TABLE_COL_MIN_WIDTH[4] }}
              className={`${classes.tableHeader} ${classes.sortable}`}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Typography className={classes.tableHeaderText} style={{ color: theme.text1Sone }}>
                  {t('Locked Value')}
                </Typography>
                {sortData.balanceUSD &&
                  (sortData.balanceUSD === 'asc' ? (
                    <ArrowDropDownIcon className={classes.sortIcon} />
                  ) : (
                    <ArrowDropUpIcon className={classes.sortIcon} />
                  ))}
              </Box>
            </TableCell>
            <TableCell
              onClick={() => handleSort('rewardPerBlock')}
              width={TABLE_COL_WIDTH[5]}
              style={{ minWidth: TABLE_COL_MIN_WIDTH[5] }}
              className={`${classes.tableHeader} ${classes.sortable}`}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Typography className={classes.tableHeaderText} style={{ color: theme.text1Sone }}>
                  {t('Reward / Block')}
                </Typography>
                {sortData.rewardPerBlock &&
                  (sortData.rewardPerBlock === 'asc' ? (
                    <ArrowDropDownIcon className={classes.sortIcon} />
                  ) : (
                    <ArrowDropUpIcon className={classes.sortIcon} />
                  ))}
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getSortedPools().map((row, rowIdx) => {
            return <PoolRow key={row.poolAddress} farm={{ rowIdx, ...row }} />
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
