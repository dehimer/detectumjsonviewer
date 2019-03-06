import React, { PureComponent } from 'react';

import { ProgressBar, AppBar } from 'react-toolbox/lib';

import Search from './components/Search'
import Stats from './components/Stats'
import List from './components/List'
import Aggregations from './components/Aggregations'
import Viewer from './components/Viewer';
import Pagination from './components/Pagination';

import styles from './index.css'

export default class Gallery extends PureComponent {
  state = {
    json: null,
    query: '',
    categories: [],
    params: [],
    loading: false,
    offset: 0,
    limit: 32
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      query: oldQuery,
      offset: oldOffset,
      categories: oldCategories,
      params: oldParams
    } = prevState;

    const {
      query: newQuery,
      offset: newOffset,
      categories: newCategories,
      params: newParams,
      limit
    } = this.state;

    let needQuery = false;
    if (oldQuery !== newQuery) {
      needQuery = true;
    } else if (oldOffset !== newOffset) {
      needQuery = true;
    } else if (oldCategories.length !== newCategories.length) {
      needQuery = true;
    } else if (oldParams.length !== newParams.length) {
      needQuery = true;
    }

    if (needQuery) {
      const state = {
        tsid: +(new Date()),
        json: null,
        loading: true,
        offset: newOffset,
        categories: newCategories,
        params: newParams,
      };

      if (oldQuery !== newQuery) {
        state.offset = 0;
        state.categories = [];
        state.params = [];
      } else if (oldCategories.length !== newCategories.length) {
        state.offset = 0;
      } else if (oldParams.length !== newParams.length) {
        state.offset = 0;
      }

      this.setState(state, () => {
        this.getJSON({
          tsid: state.tsid,
          query: newQuery,
          offset: state.offset,
          limit,
          categories: state.categories,
          params: state.params,
        });
      })
    }
  }

  onSelect = (id) => {
    const { json } = this.state;

    const {
      es_response: {
        hits: {
          hits
        }
      }
    } = json;

    const item = hits.find(hit => hit._source.id === id);

    this.setState({ item });
  };

  toggleCategory(category) {
    console.log(`toggleCategory(${category})`);
    let { categories } = this.state;

    if (categories.includes(category)) {
      categories = categories.filter(cat => cat !== category)
    } else {
      categories = categories.concat([category]);
    }

    this.setState({ categories: [...categories] });
  }

  toggleParam({name, value}) {
    console.log(`toggleParam(${name}, ${value})`);
    let { params } = this.state;

    if (params.find(param => param.name === name && param.value === value)) {
      params = params.filter(param => !(param.name === name && param.value === value));
    } else {
      params = params.concat([{name, value}]);
    }

    this.setState({ params: [...params] });
  }

  getJSON({ tsid, query, offset, limit, categories, params }) {
    if (query) {
      let qs = {
        q: encodeURIComponent(query),
        id2name: true,
        getrawoutput: true,
        debug: true,
        explain: true,
        offset,
        limit
      };

      if (categories.length) {
        qs.category_id = encodeURIComponent(categories.join(','));
      }

      qs.params = params.length;
      if (params.length) {
        params.forEach((param, index) => {
          qs[`param_${index}`] = param.name;
          qs[`value_${index}`] = param.value;
        });
      }

      qs = Object.keys(qs)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(qs[k]))
        .join('&');

      // 'http://front.dev.detectum.com:8181/technopark/search_plain'
      fetch(`http://front.dev.detectum.com:8181/technopark/search_plain?${qs}`)
        .then(response => response.json())
        .then(json => {
          console.log(json);
          if ( json && this.state.tsid === tsid) {
            json.q = decodeURIComponent(json.q);
            this.setState({
              json,
              loading: false,
              error: false
            })
          }
        })
        .catch(e => {
          console.log(e);
          this.setState({ loading: false, error: e });
        });
    }
  }

  render() {
    const {
      json, query, loading, categories, params, item, offset, limit
    } = this.state;

    return (
      <div className={styles.gallery}>
        <AppBar className={styles.top}>
          <Search
            query={query}
            search={(query) => this.setState({ query })}
          />
        </AppBar>
        <div className={styles.content}>
          {
            loading ? <ProgressBar type="linear" mode="indeterminate" multicolor={true} /> : null
          }

          <Stats json={json} />

          <div className={styles.fx}>
            <Aggregations
              json={json}
              selectedCategories={categories}
              currentParams={params}
              selectCategory={(category) => this.toggleCategory(category)}
              selectParam={(param) => this.toggleParam(param)}
              lastlevel={true}
            />

            { !loading ? <List json={json} select={(id) => this.onSelect(id)} /> : null }
          </div>

          {
            item
              ? <Viewer item={item} close={() => this.setState({ item: null })} />
              : null
          }
        </div>

        <div className={styles.bottom}>
          <Pagination
            json={json}
            offset={offset}
            limit={limit}
            change={(page) => this.setState({ offset: page * limit })}
          />
        </div>
      </div>
    );
  }
}
