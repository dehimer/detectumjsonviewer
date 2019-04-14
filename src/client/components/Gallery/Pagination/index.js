import React from "react";

import ReactPaginate from 'react-paginate';

import ChevronLeftIcon from 'mdi-react/ChevronLeftIcon'
import ChevronRightIcon from 'mdi-react/ChevronRightIcon'
import MoreHorizIcon from 'mdi-react/MoreHorizIcon'

import styles from './index.css'

export default ({ json, offset, limit, change }) => {
  if (!json) return null;

  const { es_response } = json;
  if (!es_response) return null;

  const { hits } = es_response;
  if (!hits) return null;

  const currentPage = offset/limit;

  const { total } = hits;
  let pagesCount = parseInt(total/limit);
  if (pagesCount*limit < total) pagesCount += 1;

  return (
    <ReactPaginate
      containerClassName={styles.pagination}
      pageClassName={styles.page}
      pageLinkClassName={styles.pageLink}

      previousClassName={styles.page}
      nextClassName={styles.page}
      activeClassName={styles.activePage}
      breakClassName={styles.page}

      previousLabel={<ChevronLeftIcon className={styles.arrow}/>}
      nextLabel={<ChevronRightIcon className={styles.arrow}/>}


      rangeLeftButtonLabel={(<MoreHorizIcon />)}
      rangeRightButtonLabel={(<MoreHorizIcon />)}

      onPageChange={({selected}) => change(selected)}

      pageCount={pagesCount}
      initialPage={currentPage}
      pageRangeDisplayed={10}
      marginPagesDisplayed={2}
    />
  )
}


