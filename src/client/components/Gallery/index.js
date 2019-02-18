import _ from 'underscore'

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './index.css'

import { ProgressBar, AppBar } from 'react-toolbox/lib';

import Search from './components/Search'
import Stats from './components/Stats'
import List from './components/List'
import Viewer from './components/Viewer';
import Pagination from './components/Pagination';


class Gallery extends Component {
  state = {
    json: null,
    query: '',
    loading: false,
    offset: 0,
    limit: 30
  };

  constructor(props) {
    super(props);

    this.getjson = _.debounce(this.props.getjson, 700);
  }

  componentDidUpdate(prevProps, prevState) {
    const { query: oldQuery, offset: oldOffset } = prevState;
    const { query: newQuery, offset: newOffset } = this.state;

    if (newQuery === '' && oldQuery !== '') {
      this.setState({ json: null, loading: false });
    } else if (newQuery !== oldQuery || oldOffset !== newOffset) {
      const { offset, limit } = this.state;

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
      }

      this.setState(state, () => {
        this.getjson({ query: newQuery, offset, limit });
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

  render() {
    const {
      json, query, loading, item, offset, limit
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
            loading
              ? <ProgressBar type="linear" mode="indeterminate" multicolor={true} />
              : (
                <Fragment>
                  <Stats json={json} />
                  <List json={json} select={(id) => this.onSelect(id)} />
                </Fragment>
              )
          }

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
    getjson: ({query, offset, limit}) => {
      dispatch({
        type: 'server/getjson',
        data: {
          query,
          offset,
          limit
        }
      });
    },
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Gallery);
