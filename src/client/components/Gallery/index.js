import _ from 'underscore'

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ProgressBar, AppBar } from 'react-toolbox/lib';

import Search from './components/Search'
import Stats from './components/Stats'
import List from './components/List'
import Aggregations from './components/Aggregations'
import Viewer from './components/Viewer';
import Pagination from './components/Pagination';

import styles from './index.css'

class Gallery extends Component {
  state = {
    json: null,
    query: '',
    categories: [],
    params: [],
    loading: false,
    offset: 0,
    limit: 32
  };

  constructor(props) {
    super(props);

    this.getjson = _.debounce(this.props.getjson, 700);
  }

  componentDidUpdate(prevProps, prevState) {
    const { query: oldQuery, offset: oldOffset, categories: oldCategories } = prevState;
    const { query: newQuery, offset: newOffset, categories: newCategories } = this.state;

    if (newQuery === '' && oldQuery !== '') {
      this.setState({ json: null, loading: false });
    } else if (
      newQuery !== oldQuery ||
      oldOffset !== newOffset ||
      oldCategories.length !== newCategories.length
    ) {
      const { offset, limit, categories } = this.state;

      const state = {
        loading: {
          query: newQuery,
          offset: newOffset
        },
        offset: newOffset
      };

      if (newQuery !== oldQuery) {
        state.json = null;
        state.offset = 0;
        state.loading.offset = 0;
        state.categories = [];
      }

      this.setState(state, () => {
        console.log('getjson');
        console.log({ query: newQuery, offset, limit, categories });
        this.getjson({ query: newQuery, offset, limit, categories });
      });
    }


    const { json: newJson } = this.props;
    const { loading, offset, limit } = this.state;

    if (newJson && loading) {
      const {q: query, req: { size, from }} = newJson;

      if (loading.query === query && offset === from*1 && limit === size*1) {
        this.setState({ json: newJson, loading: false });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { json: curJson, ...restCurState } = this.state;
    const { json: newJson, ...restNewState } = nextState;

    if (curJson !== newJson) return true;
    if (JSON.stringify(restCurState) !== JSON.stringify(restNewState)) return true;

    if (this.props.json !== nextProps.json) return true;

    return false;
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
    const { categories } = this.state;
    let newCategories = [];

    if (categories.includes(category)) {
      newCategories = categories.filter(cat => cat !== category)
    } else {
      newCategories = categories.concat([category]);
    }

    this.setState({ categories: newCategories });
  }

  toggleParam(param) {
    console.log(`toggleParam(${param})`);
    const { params } = this.state;
    let newParams = [];

    if (params.includes(param)) {
      newParams = params.filter(p => p !== param)
    } else {
      newParams = params.concat([param]);
    }

    this.setState({ params: newParams });
  }

  render() {
    console.log('render');
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
              selectedParams={params}
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

Gallery.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  json: PropTypes.object,
};

const mapStateToProps = (state) => {
  const { json } = state.server;

  return { json };
};

const mapDispatchToProps = dispatch => (
  {
    getjson: ({query, offset, limit, categories}) => {
      dispatch({
        type: 'server/getjson',
        data: {
          query,
          offset,
          limit,
          categories
        }
      });
    },
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Gallery);
