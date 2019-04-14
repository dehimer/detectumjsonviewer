import React, { PureComponent } from 'react';

import { ProgressBar, AppBar } from 'react-toolbox/lib';
import Button from 'react-toolbox/lib/button';
import SearchIcon from 'mdi-react/SearchIcon'


import Stats from './Stats'
import List from './List'
import Aggregations from './Aggregations'
import Viewer from './Viewer';
import Pagination from './Pagination';

import styles from './index.css'

export default class Gallery extends PureComponent {
  state = {
    json: null,
    query: '',
    categories: [],
    params: [],
    loading: false,
    offset: 0,
    limit: 32,
    needQuery: false
  };

  constructor(props) {
    super(props);
    this.galleryRef = React.createRef()   // Create a ref object
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      query: oldQuery,
      offset: oldOffset,
      categories: oldCategories,
      params: oldParams,
      waitAccept: oldWaitAccept,
      loading: oldLoading,
    } = prevState;

    const {
      query: newQuery,
      offset: newOffset,
      categories: newCategories,
      params: newParams,
      waitAccept: newWaitAccept,
      loading: newLoading
    } = this.state;

    if (oldLoading && !newLoading) {
      this.galleryRef.current.scrollTo(0, 0);
    }

    let needQuery = false;
    let waitAccept = false;
    if (newWaitAccept && oldWaitAccept !== newWaitAccept) {
      this.acceptQuery();
      return;
    } else if (oldQuery !== newQuery) {
      needQuery = true;
    } else if (oldOffset !== newOffset) {
      needQuery = true;
      waitAccept = true;
    } else if (oldCategories.length !== newCategories.length) {
      needQuery = true;
    } else if (oldParams.length !== newParams.length) {
      needQuery = true;
    }

    if (needQuery) {
      const state = {
        tsid: +(new Date()),
        offset: newOffset,
        categories: newCategories,
        params: newParams,
        needQuery,
        waitAccept,
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

      this.setState(state);
    }
  }

  acceptQuery() {
    const {
      needQuery,
      tsid,
      query,
      offset,
      limit,
      categories,
      params
    } = this.state;

    if (needQuery) {
      this.setState({
        needQuery: false,
        json: null,
        waitAccept: false,
        loading: true,
      }, () => {
        this.getJSON({
          tsid,
          query,
          offset,
          limit,
          categories,
          params,
        });
      });
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

  onPageChange(page) {
    const {
      limit,
    } = this.state;

    this.setState({
      offset: page * limit
    })
  }

  toggleCategory(category) {
    let { categories } = this.state;

    if (categories.includes(category)) {
      categories = categories.filter(cat => cat !== category)
    } else {
      categories = categories.concat([category]);
    }

    this.setState({ categories: [...categories] });
  }

  toggleParam({name, value}) {
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

      fetch(`http://front.dev.detectum.com:8181/technopark/search_plain?${qs}`)
        .then(response => response.json())
        .then(json => {
          console.log(json);
          if ( json && this.state.tsid === tsid) {
            json.q = decodeURIComponent(json.q);
            this.setState({
              json,
              loading: false,
              error: false,
              needQuery: false
            })
          }
        })
        .catch(e => {
          console.log(e);
          this.setState({
            loading: false,
            error: e,
            needQuery: false
          });
        });
    }
  }

  onSearchKeyPress(e) {
    if (e.key === 'Enter') {
      this.acceptQuery();
    }
  }

  render() {
    const {
      json,
      query,
      loading,
      categories,
      params,
      item,
      offset,
      limit,
      needQuery
    } = this.state;

    return (
      <div className={styles.gallery} ref={this.galleryRef}>
        <div className={styles.top}>
          <input
            type='text'
            placeholder='Поиск'
            value={query}
            onKeyPress={(e) => this.onSearchKeyPress(e)}
            onChange={(e) => this.setState({ query: e.target.value })}
          />
          <Button
            raised primary
            className={!needQuery ? styles.disabled : null}
            onClick={() => this.acceptQuery()}
          >
            <SearchIcon />
          </Button>
        </div>
        <div className={styles.content}>
          {
            loading
              ? <ProgressBar type="linear" mode="indeterminate" multicolor={true} />
              : null
          }

          <Stats json={json} offset={offset} limit={limit}/>

          <div className={styles.fx}>
            <Aggregations
              json={json}
              selectedCategories={categories}
              currentParams={params}
              selectCategory={(category) => this.toggleCategory(category)}
              selectParam={(param) => this.toggleParam(param)}
              lastlevel={true}
            />

            { !loading && (
              <List json={json} select={(id) => this.onSelect(id)}>
                <div className={styles.bottom}>
                  <Pagination
                    json={json}
                    offset={offset}
                    limit={limit}
                    change={(page) => this.onPageChange(page)}
                  />
                </div>
              </List>
              )
            }
          </div>

          {
            item
              ? <Viewer item={item} close={() => this.setState({ item: null })} />
              : null
          }
        </div>
      </div>
    );
  }
}
