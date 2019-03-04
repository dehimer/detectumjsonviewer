import React, { PureComponent } from 'react';
import Checkbox from 'react-toolbox/lib/checkbox';

import styles from './index.css'

export default class Aggregations extends PureComponent {
  state = {
    availableCategories: [],
    availableParams: []
  };

  static getDerivedStateFromProps(props) {
    // console.log('getDerivedStateFromProps');
    // console.log(props);
    const { json } = props;

    if (json && json.es_response) {
      const {
        es_response: {
          aggregations
        }
      } = json;

      let {
        filtered_aggs: {
          category_id: {
            buckets: availableCategories
          },
          params: {
            PARAM_NAMES: {
              buckets: filteredParams
            }
          }
        },
        price_max,
        price_min,
        ...restParams
      } = aggregations;

      // console.log('aggregations');
      // console.log(aggregations);
      //
      // console.log('restParams');
      // console.log(restParams);

      let availableParams = Object.entries(restParams).map(([name, value]) => {
        const { params: { PARAM_NAMES: { buckets } }} = value;
        return buckets.find(({key}) => name === key);
      });

      const usedBuckets = availableParams.map(param => param.key);

      availableParams = availableParams.concat(filteredParams.filter(param => !usedBuckets.includes(param.key)));

      return {
        aggregations,
        availableCategories: availableCategories.map(category => {
          const { id2name: { buckets } } = category;
          category.buckets = buckets;
          return category
        }),
        availableParams: availableParams.map(param => {
          // param = aggregations[param.key] ? aggregations[param.key] : param;

          if (aggregations[param.key]) {
            // console.log('param');
            // console.log(param);
            // console.log('aggregations[param.key]');
            // console.log(aggregations[param.key]);
            const { params: { PARAM_NAMES: { buckets } }} = aggregations[param.key];

            param = buckets.find(({key}) => param.key === key);
            // console.log('found param');
            // console.log(param);
          }

          const { VALUES_TO_PARAMS: { NAME_VALUE: { buckets } } } = param;
          param.buckets = buckets;

          return param
        })
      }
    }

    return null;
  }

  render() {
    const { selectedCategories, currentParams, selectCategory, selectParam } = this.props;
    const { availableCategories, availableParams } = this.state;

    return (
      <div className={styles.aggregations}>
        <div className={styles.group}>
          <b>Категории</b>
        </div>
        {
          availableCategories.map(({ key: categoryId, doc_count, buckets }) => (
            <div key={categoryId} className={styles.group}>
              {
                buckets.map(({ key, doc_count }) => (
                  <div
                    key={key}
                    className={styles.category}
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); selectCategory(categoryId) }}
                  >
                    <div className={styles.label}>
                      <Checkbox
                        checked={selectedCategories.includes(categoryId)}
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
          availableParams.map(({ key: param, doc_count, buckets }) => {

            return (
              <div key={param} className={styles.group}>
                <div className={styles.category}>
                  <div className={styles.name}><b>{param}</b></div>
                  <div className={styles.count}>{doc_count}</div>
                </div>

                {
                  buckets.map(({ key, doc_count }) => {
                    const checked = !!currentParams.find(p => p.name === param && p.value === key);

                    return (
                      <div
                        key={key}
                        className={styles.category}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          selectParam({name: param, value: key})
                        }}
                      >
                        <div className={styles.label}>
                          <Checkbox
                            checked={checked}
                          />
                          <div className={styles.name}>{key}</div>
                        </div>
                        <div className={styles.count}>{doc_count}</div>
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    )

  }
}
