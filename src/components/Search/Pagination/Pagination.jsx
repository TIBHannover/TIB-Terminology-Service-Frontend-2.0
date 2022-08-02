import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) => ({
  // root: {
  //   '& > * + *': {
  //     marginTop: theme.spacing(2),

  //   },
  // },
  pag: {
    marginLeft: '25%',
    marginTop: '50px'
  }
}))

function PaginationCustom (props) {
  const classes = useStyles()
  const [page, setPage] = React.useState(1)
  const handleChange = (event, value) => {
    props.clickHandler(value)
    setPage(value)
  }

  return (
    <div className={classes.root}>
      <Pagination
        className={classes.pag}
        shape='rounded'
        variant="outlined"
        count={props.count}
        page={props.page}
        onChange={handleChange}
      />
    </div>
  )
}

export default PaginationCustom
