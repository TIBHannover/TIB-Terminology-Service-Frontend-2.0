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
  const [count, setCount] = useState();
  const [nextPage, setNextPage] = useState();
  const [previousPage, setPreviousPage] = useState();
  const [valid, setValid] = useState(false);

useEffect(() => {
  fetch("/search?q=" + "start= ${currentPage}")
      .then(response => response.json())
      .then(data => {
        setCount(data.count);
        setNextPage(data.next);
        setPreviousPage(data.previous);
        setValid(true);
      })
}, [currentPage]);

const incrementPageNumber = () => setCurrentPage(prevPage => prevPage + 10);

const decrementPageNumber = () => {
  if(currentPage <= 1) return; 
  setCurrentPage(prevPage => prevPage - 10);
}

  return (
    <div className={classes.root}>
      <Pagination
        className={classes.pag}
        shape='rounded'
        variant="outlined"
        count={props.count}
        page={props.page}
      />
    </div>
  )
}

export default PaginationCustom
