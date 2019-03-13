import React, { PureComponent } from 'react';
import Checkbox from 'react-toolbox/lib/checkbox';
import ArrowDropDownIcon from 'mdi-react/ArrowDropDownIcon';
import ArrowDropUpIcon from 'mdi-react/ArrowDropUpIcon';


import styles from './index.css'

export default class Aggregations extends PureComponent {
  state = {
    availableCategories: [],
    availableParams: [],
    openedParamGroups: []
  };

  static getDerivedStateFromProps(props, state) {
    const { json } = props;
    let { openedParamGroups } = state;

    if (json && json.es_response) {
      const {
        es_response: {
          aggregations
        }
      } = json;

      let {
        category_id,
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

      let availableParams = Object.entries(restParams).map(([name, value]) => {
        const { params: { PARAM_NAMES: { buckets } }} = value;
        return buckets.find(({key}) => name === key);
      }).filter(v => !!v);

      const usedBuckets = availableParams.map(param => param.key);

      availableParams = availableParams.concat(filteredParams.filter(param => !usedBuckets.includes(param.key)));

      const paramNames = availableParams.map(param => param.key);

      openedParamGroups = openedParamGroups.filter(param => paramNames.includes(param));

      return {
        aggregations,
        availableCategories: availableCategories.map(category => {
          const { id2name: { buckets } } = category;
          category.buckets = buckets;

          return category
        }),
        availableParams: availableParams.map(param => {
          const { VALUES_TO_PARAMS: { NAME_VALUE: { buckets } } } = param;
          param.buckets = buckets;

          return param
        }),
        openedParamGroups
      }
    }

    return null;
  }

  toggleParamGroup(param) {
    const { openedParamGroups } = this.state;
    let updatedopenedParamGroups  = [...openedParamGroups];

    if (updatedopenedParamGroups.includes(param)) {
      updatedopenedParamGroups = updatedopenedParamGroups.filter(p => p !== param);
    } else {
      updatedopenedParamGroups.push(param);
    }

    this.setState({ openedParamGroups: updatedopenedParamGroups });
  }

  render() {
    const { selectedCategories, currentParams, selectCategory, selectParam } = this.props;
    const { availableCategories, availableParams, openedParamGroups } = this.state;

    return (
      <div className={styles.aggregations}>
        <div className={styles.group}>
          <b>Категории</b>
        </div>
        <div className={styles.group}>
        {
          availableCategories.map(({ key: categoryId, doc_count, buckets }) => (
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
          ))
        }
        </div>

        <div className={styles.group}>
          <b>Параметры</b>
        </div>
        {
          availableParams.map(({ key: param, doc_count, buckets }) => {
            const opened = openedParamGroups.includes(param);
            return (
              <div key={param} className={styles.group}>
                <div className={styles.category} onClick={() => this.toggleParamGroup(param)}>
                  <div className={styles.arrow}>
                    {
                      opened
                        ? <ArrowDropUpIcon />
                        : <ArrowDropDownIcon />
                    }
                    <b>{param}</b>
                  </div>
                  <div className={styles.count}>{doc_count}</div>
                </div>

                {
                  opened && buckets.map(({ key, doc_count }) => {
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
