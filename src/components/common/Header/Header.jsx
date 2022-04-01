import React, { useState, useRef, useEffect } from 'react'

import {
  AppBar,
  ClickAwayListener,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography
} from '@material-ui/core'
import {
  withStyles,
  StylesProvider,
  createGenerateClassName
} from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'

const generateClassName = createGenerateClassName({
  productionPrefix: 'c'
})

const styles = {
  appBar: {
    background: 'white',
    padding: 10,
    boxShadow:
      '-6px 2px 0px -1px rgba(0, 0, 0, 0.1), 3px -2px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
  },
  gridItem: {
    paddingLeft: 10,
    paddingRight: 35
  },
  paper: {
    marginRight: 20
  }
}
const Header = ({ appName, headers, classes }) => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  const prevOpen = useRef(open)
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <StylesProvider generateClassName={generateClassName}>
      <div>
        <AppBar position="sticky" className={classes.appBar}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item className={classes.gridItem}>
              <Typography variant="h5" style={{ color: 'grey' }}>
                {appName}
              </Typography>
            </Grid>
            <Grid item className={classes.gridItem}>
              <MenuIcon
                style={{ color: 'black' }}
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              />
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === 'bottom' ? 'center top' : 'center bottom'
                    }}
                  >
                    <ClickAwayListener onClickAway={handleClose}>
                      <Paper className={classes.paper}>
                        <MenuList autoFocusItem={open} id="menu-list-grow">
                          {headers.map(link => (
                            // eslint-disable-next-line react/jsx-key
                            <MenuItem
                              onClick={event => {
                                window.open(link.link, '_blank')
                                handleClose(event)
                              }}
                            >
                              {link.label}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Paper>
                    </ClickAwayListener>
                  </Grow>
                )}
              </Popper>
            </Grid>
          </Grid>
        </AppBar>
      </div>
    </StylesProvider>
  )
}
export default withStyles(styles)(Header)
