import React from "react";

import './index.css'

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
  const pages = [...Array(pagesCount).keys()];

  return (
    <div className="pagination">
      {
        pages.map(page => (
          <div
            key={page}
            className="page"
            onClick={() => change(page)}
          >
            { currentPage === page ? `[${page+1}]` : page+1 }
          </div>
        ))
      }
    </div>
  )
}


