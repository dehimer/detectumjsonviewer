import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './index.css';

// import Viewer from './components/Viewer/index';
import List from './components/List'

class Gallery extends Component {
  state = {
    query: ''
  };

  // todo: to know what sence of shapshot argument
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { query: newQuery } = prevState;
    const { query: oldQuery } = this.state;

    if (newQuery !== oldQuery) {
      this.props.getjson(newQuery);
    }
  }

  onSelect = (id) => {
    console.log('onSelect');
    console.log(id);
    // const { history, match: { params: { query } } } = this.props;
    //
    // history.push(`/${query}/${id}`);
  };

  render() {
    const { json } = this.props;

    return (
      <div className="gallery">
        <input type="text"
               value={this.state.query}
               onChange={(e) => this.setState({ query: e.target.value })}
        />
        <List json={json} select={(id) => this.onSelect(id)}/>
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
