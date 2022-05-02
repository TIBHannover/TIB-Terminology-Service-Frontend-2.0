import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Pagination from '@material-ui/lab/Pagination'
import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate'

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
    const getSearchResults = async () => {
      const res = await fetch(
        `http://service.tib.eu/ts4tib/api/search?q=` + `&start=1`
      );
      const data = await res.json();
      const total = res.headers.get("x-total-count");
      setpageCount(Math.ceil(total / limit));
      // console.log(Math.ceil(total/12));
      setItems(data);
    };

    getSearchResults();
  }, [limit]);
  
  const fetchSearchResults = async (currentPage) => {
    const res = await fetch(
      `http://service.tib.eu/ts4tib/api/search?q=` + `&start=${currentPage}`
    );
    const data = await res.json();
    return data;
  };

  const handlePageClick = async (data) => {
    console.log(data.selected);

    let currentPage = data.selected + 1;

    const resultsFormServer = await fetchSearchResults(currentPage);

    setItems(resultsFormServer);
    // scroll to the top
    //window.scrollTo(0, 0)
  };

  return (
    <div className={classes.root}>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>
  )
}

export default PaginationCustom
