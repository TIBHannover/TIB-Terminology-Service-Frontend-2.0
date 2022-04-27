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
  const [items, setItems] = useState([]);

  const [pageCount, setpageCount] = useState(0);

  let limit = 10;

  useEffect(() => {
    const getComments = async () => {
      const res = await fetch(
        `http://service.tib.eu/ts4tib/api/search?q=` + `&start=1`
      );
      const data = await res.json();
      const total = res.headers.get("x-total-count");
      setpageCount(Math.ceil(total / limit));
      // console.log(Math.ceil(total/12));
      setItems(data);
    };

    getComments();
  }, [limit]);
  
  const fetchComments = async (currentPage) => {
    const res = await fetch(
      `http://service.tib.eu/ts4tib/api/search?q=` + `&start=${currentPage}`
    );
    const data = await res.json();
    return data;
  };

  const handlePageClick = async (data) => {
    console.log(data.selected);

    let currentPage = data.selected + 1;

    const commentsFormServer = await fetchComments(currentPage);

    setItems(commentsFormServer);
    // scroll to the top
    //window.scrollTo(0, 0)
  };

  return (
    <div className={classes.root}>
      <Pagination
        className={classes.pag}
        shape='rounded'
        variant="outlined"
        count={props.count}
        page={props.page}
        onChange={handlePageClick}
      />
    </div>
  )
}

export default PaginationCustom
