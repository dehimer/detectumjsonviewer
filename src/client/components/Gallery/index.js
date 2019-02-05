import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './index.css';

class Gallery extends Component {
  state = {
    selected: null
  };

  render() {
    const { selected } = this.state;
    const { config, json, match } = this.props;

    if (json) {
      const { es_response: { hits: { hits } } } = json;

      console.log(hits);
      const listel = hits.map(hit => {
        const { _source } = hit;
        console.log(_source);
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

  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Gallery));
