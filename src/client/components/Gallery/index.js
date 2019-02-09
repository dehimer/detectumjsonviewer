import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './index.css';

class Gallery extends Component {
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
    const { json } = this.props;

    if (json) {
      console.log('json');
      console.log(json);
      const { es_response: { hits: { hits } } } = json;

      const listel = hits.map(hit => {
        const { _source } = hit;
        const { id, img_url, model } = _source;

        return (
          <div className='item' key={id}>
            <img src={img_url}/>
            <div>{ model }</div>
          </div>
        );
      });

      return (
        <Fragment>
          <div className="gallery">
            {
              listel
            }
          </div>
        </Fragment>
      );
    } else {
      return null;
    }
  }
}

Gallery.defaultProps = {
  match: {
    params: {
      from: null
    }
  }
};

Gallery.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  json: PropTypes.object,
};

const mapStateToProps = (state) => {
  const { json } = state.server;

  return {
    json,
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
  mapDispatchToProps
)(withRouter(Gallery));
