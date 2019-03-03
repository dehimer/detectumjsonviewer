import React, { PureComponent } from 'react';
import Checkbox from 'react-toolbox/lib/checkbox';

import styles from './index.css'

export default class Aggregations extends PureComponent {
  state = {
    availableCategories: [],
    availableParams: []
  };

  static getDerivedStateFromProps(props) {
    const { json } = props;

    if (json) {
      const {
        es_response: {
          aggregations: {
            filtered_aggs: {
              category_id: {
                buckets: availableCategories
              },
              params: {
                PARAM_NAMES: {
                  buckets: availableParams
                }
              }
            }
          }
        }
      } = json;

      return {
        availableCategories: availableCategories.map(category => {
          const { id2name: { buckets } } = category;
          category.buckets = buckets;
          return category
        }),
        availableParams: availableParams.map(param => {
          const { VALUES_TO_PARAMS: { NAME_VALUE: { buckets } } } = param;
          param.buckets = buckets;
          return param
        })
      }
    }

    return null;
  }

  render() {
    const { selectedCategories, selectedParams, selectCategory, selectParam } = this.props;
    const { availableCategories, availableParams } = this.state;


    return (
      <div className={styles.aggregations}>
        <div className={styles.group}>
          <b>Категории</b>
        </div>
        {
          availableCategories.map(({ key, doc_count, buckets }) => (
            <div key={key} className={styles.group}>
              {
                buckets.map(({ key, doc_count }) => (
                  <div
                    key={key}
                    className={styles.category}
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); selectCategory(key) }}
                  >
                    <div className={styles.label}>
                      <Checkbox
                        checked={selectedCategories.includes(key)}
                      />
                      <div className={styles.name}>{key}</div>
                    </div>
                    <div className={styles.count}>{doc_count}</div>
                  </div>
                ))
              }
            </div>
          ))
        }

        <div className={styles.group}>
          <b>Параметры</b>
        </div>
        {
          availableParams.map(({ key, doc_count, buckets }) => (
            <div key={key} className={styles.group}>
              <div className={styles.category}>
                <div className={styles.name}><b>{key}</b></div>
                <div className={styles.count}>{doc_count}</div>
              </div>

              {
                buckets.map(({ key, doc_count }) => (
                  <div
                    key={key}
                    className={styles.category}
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); selectParam(key) }}
                  >
                    <div className={styles.label}>
                      <Checkbox
                        checked={selectedParams.includes(key)}
                      />
                      <div className={styles.name}>{key}</div>
                    </div>
                    <div className={styles.count}>{doc_count}</div>
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    )

  }
}
