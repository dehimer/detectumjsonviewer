import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { CircularProgress } from '@material-ui/core';

import Search from './components/Search'
import List from './components/List'
import Viewer from './components/Viewer';
import Pagination from './components/Pagination';

import _ from 'underscore'

import './index.css';

class Gallery extends Component {
  state = {
    json: null,
    query: '',
    loading: false,
    offset: 0,
    limit: 100
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
      this.setState({
        json: null,
        loading: {
          query: newQuery,
          offset: newOffset
        },
        offset: newOffset
      }, () => {
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
      <div className="gallery">
        <Search query={query} change={(query) => this.setState({ query })} />
        {
          loading
            ? (<div className="loading"><CircularProgress/></div>)
            : (<List json={json} select={(id) => this.onSelect(id)}/>)
        }

        {
          item
            ? <Viewer item={item} close={() => this.setState({ item: null })} />
            : null
        }

        <Pagination
          json={json}
          offset={offset}
          limit={limit}
          change={(page) => this.setState({ offset: page * limit })}
        />
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
