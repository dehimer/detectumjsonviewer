import React from "react";

import styles from './index.css'

export default ({ json, select }) => {
  const noresultsEl = (
    <div className={styles.noResults}>
      Ничего не найдено
    </div>
  );

  if (!json) return noresultsEl;

  const { es_response } = json;
  if (!es_response) return noresultsEl;

  const { hits } = es_response;
  if (!hits) return noresultsEl;

  const { hits: items } = hits;
  if (!items || items.length === 0) return noresultsEl;

  return (
    <div className={styles.list}>
    {
      items.map(hit => {
        const { _source } = hit;
        const { id, img_url, model } = _source;

        return (
          <div
            className={styles.item} key={id}
            onClick={() => select(id)}
          >
            <img src={img_url}/>
            <div>{model}</div>
          </div>
        );
      })
    }
    </div>
  );
}
