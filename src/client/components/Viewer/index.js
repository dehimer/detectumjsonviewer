import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import ReactJson from 'react-json-view'

import './index.css';

class Viewer extends PureComponent {
  componentWillReceiveProps(nextProps) {
    const { match: { params: { query: newQuery } } } = nextProps;
    const { match: { params: { query: oldQuery } } } = this.props;
    if (newQuery !== oldQuery) {
      this.props.getjson(newQuery);
    }
  }

  componentDidMount() {
    const { match: { params: { query } } } = this.props;
    this.props.getjson(query);
  }

  render() {
    const { match, json } = this.props;
    const { id } = match.params;

    if (json) {
      const {es_response: {hits: { hits }}} = json;
      const item = hits.find(hit => hit._source.id === id);

      if (!item) return null;

      const { _source } = item;
      const { img_url, model } = _source;

      return (
        <div className="viewer">
          <div className="header">
            <img src={img_url}/>
            <div className="name">{ model }</div>
          </div>
          <div className="tree">
            <ReactJson src={item} collapsed={true} theme="monokai"/>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

Viewer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  json: PropTypes.object,
};

const mapStateToProps = (state) => {
  const { json } = state.server;

  return {
    json
  };
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
  mapDispatchToProps,
)(withRouter(Viewer));
