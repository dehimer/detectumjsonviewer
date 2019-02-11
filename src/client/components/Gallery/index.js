import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { CircularProgress } from '@material-ui/core';

import Search from './components/Search'
import List from './components/List'
import Viewer from './components/Viewer';

import _ from 'underscore'

import './index.css';

class Gallery extends Component {
  state = {
    json: null,
    query: '',
    loading: false
  };

  constructor(props) {
    super(props);

    this.getjson = _.debounce(this.props.getjson, 700);
  }

  // todo: to know what sence of shapshot argument
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { query: oldQuery } = prevState;
    const { query: newQuery } = this.state;

    if (newQuery === '' && oldQuery !== '') {
      console.log(1);
      this.setState({ json: null, loading: false });
    } else if (newQuery !== oldQuery) {
      console.log(2);
      this.setState({ json: null, loading: newQuery }, () => {
        this.getjson(newQuery);
      });
    }


    const { json: newJson } = this.props;
    const { loading } = this.state;

    if (newJson && loading === newJson.q) {
      console.log(3);
      this.setState({ json: newJson, loading: false });
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
    const { json, query, loading, item } = this.state;

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
    getjson: (query) => {
      dispatch({
        type: 'server/getjson',
        data: query
      });
    },
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Gallery);
