import React, { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import dayjs from 'dayjs'
import LocalLoader from '../LocalLoader'
import utc from 'dayjs/plugin/utc'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'

import { CustomLink } from '../Link'
import { Divider } from '..'
import { withRouter } from 'react-router-dom'
import { formattedNum } from '../../utils'
import { TYPE } from '../../theme'
import DoubleTokenLogo from '../DoubleLogo'
import { RowFixed } from '../Row'
import { Pagination } from '@material-ui/lab'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import { useTranslation } from 'react-i18next'

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.primary1};
  opacity: ${(props) => (props.faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 0.1fr 1fr 1fr 1fr;
  grid-template-areas: 'number name pair value';
  padding: 0 4px;

  > * {
    justify-content: flex-end;
  }

  @media screen and (max-width: 1080px) {
    grid-template-columns: 10px 1.5fr 1fr 1fr;
    grid-template-areas: 'number name pair value';
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: 'name pair value';
  }
`

const ListWrapper = styled.div``

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  justify-content: center;
  color: ${({ theme }) => theme.text1};
  & > * {
    font-size: 16px;
  }

  @media screen and (max-width: 600px) {
    font-size: 13px;
  }
`

function LPList({ lps, disbaleLinks, maxItems = 10 }) {
  const below600 = useMedia('(max-width: 600px)')
  const below800 = useMedia('(max-width: 800px)')

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = maxItems
  const [isDarkMode] = useDarkModeManager()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [lps])

  useEffect(() => {
    if (lps) {
      let extraPages = 1
      if (Object.keys(lps).length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(Object.keys(lps).length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [ITEMS_PER_PAGE, lps])

  const ListItem = ({ lp, index }) => {
    return (
      <DashGrid style={{ height: '48px' }} disbaleLinks={disbaleLinks} focus={true}>
        {!below600 && (
          <DataText area="number" fontWeight="500" style={{ justifyContent: 'center', margin: 'auto' }}>
            {index}
          </DataText>
        )}
        <DataText area="name" fontWeight="500" justifyContent="flex-start">
          <CustomLink
            style={{ marginLeft: below600 ? 0 : '1rem', whiteSpace: 'nowrap', color: '#3FAAB0', margin: 'auto' }}
            to={'/swap/account/' + lp.user.id}
          >
            {below800 ? lp.user.id.slice(0, 4) + '...' + lp.user.id.slice(38, 42) : lp.user.id}
          </CustomLink>
        </DataText>
        <DataText>
          <CustomLink
            style={{ color: '#3FAAB0', margin: 'auto', minWidth: '115px' }}
            area="pair"
            to={'/swap/pair/' + lp.pairAddress}
          >
            <RowFixed>
              {!below600 && <DoubleTokenLogo a0={lp.token0} a1={lp.token1} size={16} margin={true} />}
              {lp.pairName}
            </RowFixed>
          </CustomLink>
        </DataText>
        <DataText style={{ margin: 'auto', minWidth: !below600 ? '200px' : 'auto' }} area="value">
          {formattedNum(lp.usd, true)}
        </DataText>
      </DashGrid>
    )
  }

  const lpList =
    lps &&
    lps.slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE).map((lp, index) => {
      return (
        // <div key={index}>
        <div
          key={index}
          className={
            isDarkMode
              ? index % 2
                ? 'table-row'
                : 'table-row-dark-mode'
              : index % 2
              ? 'table-row'
              : 'table-row-light-mode'
          }
        >
          <ListItem key={index} index={(page - 1) * 10 + index + 1} lp={lp} />
          <Divider />
        </div>
      )
    })

  const StyleFlex = styled(Flex)`
    justify-content: center;
  `
  const StyleTypeMain = styled(TYPE.main)`
    justify-content: center;
  `

  return (
    <>
      <ListWrapper className={isDarkMode ? 'isBgTableDark' : 'isBgTableLight'} style={{ minHeight: '539px' }}>
        <DashGrid center={true} disbaleLinks={disbaleLinks} style={{ height: 'fit-content', padding: '1rem' }}>
          {!below600 && (
            <StyleFlex alignItems="center">
              <TYPE.main area="number">#</TYPE.main>
            </StyleFlex>
          )}
          <StyleFlex alignItems="center">
            <TYPE.main area="name">{t('Accounts')}</TYPE.main>
          </StyleFlex>
          <StyleFlex alignItems="center">
            <TYPE.main area="pair">{t('Pairs')}</TYPE.main>
          </StyleFlex>
          <StyleFlex alignItems="center">
            <StyleTypeMain area="value">{t('Value')}</StyleTypeMain>
          </StyleFlex>
        </DashGrid>
        <Divider />
        <List p={0}>{!lpList ? <LocalLoader /> : lpList}</List>
      </ListWrapper>
      <Pagination
        style={{ justifyContent: 'center' }}
        page={page}
        onChange={(event, newPage) => {
          setPage(newPage)
        }}
        count={maxPage}
        variant="outlined"
        shape="rounded"
        className="panigation-table-token-page"
      />
    </>
  )
}

export default withRouter(LPList)
