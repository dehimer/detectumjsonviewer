import React from 'react';

import styles from './index.css'

export default ({ json }) => {
  if (!json) return null;

  console.log(json);
  const {
    q: query,
    es_response: { hits: { total } },
    stat: { start }
  } = json;
  const spend = parseInt((new Date())*1 - start*1000);

  return (
    <div className={styles.stats}>
      <div>Запрос:<b>{ query }</b></div>
      <div>Найдено:<b>{ total }</b></div>
      <div>Время: <b>{ spend }мс</b></div>
    </div>
  )
}
