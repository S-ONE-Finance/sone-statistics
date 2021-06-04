import React, { useContext } from 'react'
import { Grid, Paper, makeStyles, Box } from '@material-ui/core'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { ThemeContext } from 'styled-components'

CardItem.propTypes = {}

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 30,
  },
  cardPreview: {
    marginRight: 30,
    width: 128,
    height: 116,
    borderRadius: 25,
    overflow: 'hidden',
  },
  cardValue: {
    marginRight: 10,
    fontWeight: 700,
  },
  cardPercent: {
    fontSize: 16,
  },
  positive: {
    color: 'green',
  },
  negative: {
    color: 'red',
  },
  primaryBg: {
    backgroundColor: theme.palette.primary.main,
  },
}))

function CardItem({ displayPreview, title, valueContainer, descriptionContainer, ratioValue, colorTextRatioValue }) {
  const classes = useStyles()
  const theme = useContext(ThemeContext)
  const isUpToExtraSmall = useIsUpToExtraSmall()
  return (
    <Grid item className={classes.root}>
      <Paper
        elevation={2}
        style={{ background: theme.bg1Sone, color: '#767676', borderRadius: isUpToExtraSmall ? 20 : 25 }}
      >
        <Box display="flex" alignItems="center" p={2}>
          {displayPreview && (
            <Box
              className={classes.cardPreview}
              style={isUpToExtraSmall ? { marginRight: 10, width: 76, height: 76, borderRadius: 20 } : null}
            >
              {displayPreview}
            </Box>
          )}

          <Grid container direction="column" spacing={isUpToExtraSmall ? 0 : 1} style={{ width: '100%' }}>
            <Grid item style={{ fontSize: isUpToExtraSmall ? 13 : 16, fontWeight: 400, color: theme.text4Sone }}>
              {title}
            </Grid>

            {descriptionContainer && (
              <>
                <Grid item>{valueContainer}</Grid>
                <Grid item style={{ color: theme.text10Sone, fontSize: isUpToExtraSmall ? 13 : 16 }}>
                  {descriptionContainer}
                </Grid>
              </>
            )}
            {ratioValue && (
              <Box display="flex" alignItems="center" justifyContent="spaceBetween">
                <Grid item>{valueContainer}</Grid>
                <Grid
                  item
                  style={
                    colorTextRatioValue
                      ? { color: colorTextRatioValue, fontSize: isUpToExtraSmall ? 13 : 16, marginLeft: 'auto' }
                      : { fontSize: isUpToExtraSmall ? 13 : 16, marginLeft: 'auto', color: theme.text10Sone }
                  }
                >
                  {ratioValue}
                </Grid>
              </Box>
            )}
          </Grid>
        </Box>
      </Paper>
    </Grid>
  )
}

export default CardItem
