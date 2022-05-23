import React from 'react'
import { alpha, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TreeItem from '@material-ui/lab/TreeItem'

const useTreeItemStyles = makeStyles((theme) => ({
  content: {
    flexDirection: 'row'
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0)
  },
  labelIcon: {
    marginRight: theme.spacing(1)
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1
  },

  root: {
    position: 'relative',
    '&:before': {
      pointerEvents: 'none',
      content: '""',
      position: 'absolute',
      width: 14,
      left: -16,
      top: 14,
      borderBottom: (props) =>
        // only display if the TreeItem is not root node
        props.nodeId !== '1' &&
        // only display if the TreeItem has any child nodes
        props.children?.length > 0
          ? `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`
          : 'none'
    }
  },
  iconContainer: {
    '& .close': {
      opacity: 0.3
    }
  },
  group: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`
  }
}))

function StyledTreeItem (props) {
  const classes = useTreeItemStyles(props)
  const { labelText, labelIcon: LabelIcon, ...other } = props  

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          {/* <LabelIcon color="action" className={classes.labelIcon} /> */}
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
        </div>
      }
      classes={{
        root: classes.root,
        content: classes.content,
        group: classes.group,
        iconContainer: classes.iconContainer
      }}
      {...other}
    />
  )
}

export default StyledTreeItem
