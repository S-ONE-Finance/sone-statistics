import React, { useContext, useState } from 'react'
import {
  makeStyles,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Tooltip,
  TableContainer,
  CircularProgress,
  Link,
} from '@material-ui/core'
import {
  ArrowRightAlt as ArrowRightAltIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
} from '@material-ui/icons'
import _orderBy from 'lodash.orderby'
import useDashboardData from '../../hooks/useDashboardData'
import { reduceFractionDigit } from '../../utils/number.js'
import { ThemeContext } from 'styled-components'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { useTranslation } from 'react-i18next'

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
    // borderColor: theme.palette.secondary.main,
  },
  positive: {
    color: 'green',
  },
  negative: {
    color: 'red',
  },
  // iconSwapRight: {
  //   animation: "swappingRight 5s linear infinite",
  // },
  // iconSwapLeft: {
  //   animation: "swappingLeft 5s linear infinite",
  // },
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

const PoolRow = ({ row }) => {
  const theme = useContext(ThemeContext)
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const commonData = useDashboardData((store) => store.commonData)
  const classes = useStyles()

  const handleForwardToPool = ({ poolSymbol }, event) => {
    event.preventDefault()
    // const link = document.createElement("a");
    // link.href = `https://luaswap.org/#/farms/${poolSymbol}`;
    // link.target = "_blank";
    // document.body.appendChild(link);
    // link.click();
    // document.body.remove(link);
    window.open(`https://luaswap.org/#/farms/${poolSymbol}`, '_blank').focus()
  }

  return (
    row && (
      <TableRow
        className={classes.tableRow}
        style={{ background: row.rowIdx % 2 === 0 ? theme.tableCellOddBackground : 'unset' }}
      >
        {!isUpToExtraSmall && (
          <TableCell className={classes.tableCell}>
            <Typography style={{ fontSize: 16, fontWeight: 400, float: 'right', color: theme.text4Sone }}>
              {row.rowIdx}
            </Typography>
          </TableCell>
        )}
        <TableCell className={classes.tableCell}>
          <Box display="flex" alignItems="center" flexDirection={isUpToExtraSmall ? 'column' : 'row'}>
            <Box display="flex" marginBottom={isUpToExtraSmall ? '5px' : 0}>
              <Tooltip title={row.token1Symbol}>
                <img
                  alt={row.token1Symbol}
                  src={row.token1Icon}
                  style={{ margin: 0, width: isUpToExtraSmall ? 24 : 36, height: isUpToExtraSmall ? 24 : 36 }}
                />
              </Tooltip>
              <Tooltip title={row.token2Symbol}>
                <img
                  alt={row.token2Symbol}
                  src={row.token2Icon}
                  style={{ marginLeft: -10, width: isUpToExtraSmall ? 24 : 36, height: isUpToExtraSmall ? 24 : 36 }}
                />
              </Tooltip>
            </Box>
            <Tooltip title={`Open ${row.poolSymbolShort} farm`}>
              <Link
                variant="nav"
                onClick={(event) => handleForwardToPool(row, event)}
                className={classes.redirectBtn}
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: theme.text4Sone,
                  marginLeft: isUpToExtraSmall ? 0 : '10px',
                }}
              >
                {row.poolSymbolShort}
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
          >{`${reduceFractionDigit(row.apy, 2)}%`}</Typography>
        </TableCell>
        {isUpToExtraSmall === false && (
          <>
            <TableCell className={classes.tableCell}>
              <Box display="flex" alignItems="baseline" mb={1}>
                <Typography style={{ fontSize: 16, color: theme.text4Sone }}>
                  {reduceFractionDigit(row.tokenAmount, 3)}&nbsp;
                </Typography>
                <Typography style={{ fontSize: 13, color: theme.text4Sone }}>{row.token1Symbol || ''}</Typography>
              </Box>
              <Box display="flex" alignItems="baseline">
                <Typography style={{ fontSize: 16, color: theme.text4Sone }}>
                  {reduceFractionDigit(row.token2Amount, 3)}&nbsp;
                </Typography>
                <Typography style={{ fontSize: 13, color: theme.text4Sone }}>{row.token2Symbol || ''}</Typography>
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
            {`${reduceFractionDigit(row.totalStaked, 3)}`}
          </Typography>
          <Typography component="span" style={{ fontSize: 13, fontWeight: 400, color: theme.text6Sone }}>
            {` ${row.poolSymbol || ''}`}
          </Typography>
        </TableCell>
        <TableCell className={classes.tableCell} style={{ textAlign: 'center' }}>
          <Typography
            style={{ marginBottom: 5, fontSize: isUpToExtraSmall ? 13 : 16, fontWeight: 700, color: theme.text6Sone }}
          >
            {`$${reduceFractionDigit(row.usdValue, 0)}`}
          </Typography>
          <Typography style={{ fontSize: isUpToExtraSmall ? 13 : 16, fontWeight: 400, color: theme.text4Sone }}>
            {`${reduceFractionDigit((row.usdValue / commonData.allStaked) * 100, 1)}% of total`}
          </Typography>
        </TableCell>
        <TableCell className={classes.tableCell} style={{ textAlign: 'center' }}>
          <Box mb={1} display="flex" alignItems="baseline" justifyContent="center">
            <Typography style={{ fontSize: isUpToExtraSmall ? 13 : 16, fontWeight: 700, color: theme.text6Sone }}>
              {reduceFractionDigit(row.newRewardPerBlock, 2)}&nbsp;
            </Typography>
            <Typography component="span" style={{ fontSize: 13, fontWeight: 700, color: theme.text6Sone }}>
              {'SONE'}
            </Typography>
          </Box>
          <Typography style={{ fontSize: isUpToExtraSmall ? 13 : 16, fontWeight: 400, color: theme.text4Sone }}>
            {`~ $${reduceFractionDigit(Number(row.newRewardPerBlock) * commonData.luaPrice, 2)}`}
          </Typography>
        </TableCell>
      </TableRow>
    )
  )
}

export default function PoolTable() {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const [sortData, setSortData] = useState({})
  const pools = useDashboardData((store) => store.pools)
  const classes = useStyles()
  const theme = useContext(ThemeContext)
  const { t, i18n } = useTranslation()
  const getSortedPools = (pools, sortData) => {
    const sortingCols = Object.keys(sortData)

    if (sortingCols.length) {
      return _orderBy(pools, sortingCols, Object.values(sortData))
    }

    return pools
  }

  const handleSort = (name) => {
    setSortData((oldData) => ({
      [name]: oldData[name] === 'desc' ? 'asc' : 'desc',
    }))
  }

  return pools?.length > 0 ? (
    <TableContainer
      component={Paper}
      elevation={2}
      className={classes.tableContainer}
      style={{ background: theme.bg1Sone }}
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
              onClick={() => handleSort('name')}
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
                {sortData.name &&
                  (sortData.name === 'asc' ? (
                    <ArrowDropDownIcon className={classes.sortIcon} />
                  ) : (
                    <ArrowDropUpIcon className={classes.sortIcon} />
                  ))}
              </Box>
            </TableCell>
            <TableCell
              onClick={() => handleSort('apy')}
              width={TABLE_COL_WIDTH[2]}
              style={{ minWidth: TABLE_COL_MIN_WIDTH[2] }}
              className={`${classes.tableHeader} ${classes.sortable}`}
            >
              <Box display="flex" alignItems="center" justifyContent={isUpToExtraSmall ? 'center' : 'unset'}>
                <Typography className={classes.tableHeaderText} style={{ color: theme.text1Sone }}>
                  APY
                </Typography>
                {sortData.apy &&
                  (sortData.apy === 'asc' ? (
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
              onClick={() => handleSort('usdValue')}
              width={TABLE_COL_WIDTH[4]}
              style={{ minWidth: TABLE_COL_MIN_WIDTH[4] }}
              className={`${classes.tableHeader} ${classes.sortable}`}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Typography className={classes.tableHeaderText} style={{ color: theme.text1Sone }}>
                  {t('Locked Value')}
                </Typography>
                {sortData.usdValue &&
                  (sortData.usdValue === 'asc' ? (
                    <ArrowDropDownIcon className={classes.sortIcon} />
                  ) : (
                    <ArrowDropUpIcon className={classes.sortIcon} />
                  ))}
              </Box>
            </TableCell>
            <TableCell
              onClick={() => handleSort('newRewardPerBlock')}
              width={TABLE_COL_WIDTH[5]}
              style={{ minWidth: TABLE_COL_MIN_WIDTH[5] }}
              className={`${classes.tableHeader} ${classes.sortable}`}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Typography className={classes.tableHeaderText} style={{ color: theme.text1Sone }}>
                  {t('Reward / Block')}
                </Typography>
                {sortData.newRewardPerBlock &&
                  (sortData.newRewardPerBlock === 'asc' ? (
                    <ArrowDropDownIcon className={classes.sortIcon} />
                  ) : (
                    <ArrowDropUpIcon className={classes.sortIcon} />
                  ))}
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getSortedPools(pools, sortData).map((row, rowIdx) => {
            return <PoolRow key={row.poolAddress} row={{ rowIdx, ...row }} />
          })}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <LoadingIndicator />
  )
}
