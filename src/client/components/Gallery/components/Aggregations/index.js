import React from 'react';
import Checkbox from 'react-toolbox/lib/checkbox';

import styles from './index.css'

export default ({ json, categories, select }) => {
  if (!json) return null;

  console.log('json');
  console.log(json);

  console.log('categories');
  console.log(categories);
  const {
    es_response: {
      aggregations: {
        filtered_aggs: {
          params: {
            PARAM_NAMES: {
              buckets
            }
          }
        }
      }
    }
  } = json;
  console.log('buckets');
  console.log(buckets);

  return (
    <div className={styles.aggregations}>
      {
        buckets.map(({ key, doc_count, VALUES_TO_PARAMS }) => {

          const { NAME_VALUE: { buckets } } = VALUES_TO_PARAMS;

          return (
            <div key={key}>
              <div className={styles.category}>
                <div className={styles.name}><b>{key}</b></div>
                <div className={styles.count}>{doc_count}</div>
              </div>
              {
                buckets.map(({ key, doc_count }) => (
                  <div
                    key={key}
                    className={styles.category}
                    onClick={() => select(key)}
                  >
                    <div className={styles.label}>
                      <Checkbox
                        checked={categories.includes(key)}
                      />
                      <div className={styles.name}>{key}</div>
                    </div>
                    <div className={styles.count}>{doc_count}</div>
                  </div>
                ))
              }
            </div>
          )
        })
      }
    </div>
  )
}
