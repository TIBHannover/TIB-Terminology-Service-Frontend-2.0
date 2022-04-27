import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Pagination from '@material-ui/lab/Pagination'
import { useState, useEffect } from 'react'

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
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [valid, setValid] = useState(false);

useEffect(() => {
  fetch(`http://127.0.0.1:8000/api/software/?p=${currentPage}`)
      .then(response => response.json())
      .then(data => {
        setCount(data.count);
        setNextPage(data.next);
        setPreviousPage(data.previous);
        setValid(true);
      })
}, [currentPage]);

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
