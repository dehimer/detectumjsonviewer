import React, { Component } from 'react';

import styles from './index.css'

const defaultState = {
  query: '',
  total: 0,
  spend: 0,
  start: 0
};

export default class Stats extends Component {
  state = defaultState;

  static getDerivedStateFromProps(nextProps, curState) {
    console.log('getDerivedStateFromProps');
    console.log(nextProps);

    const { json } = nextProps;

    if (!json) return null;

    const {
      q: query,
      es_response: { hits: { total } },
      stat: { start }
    } = json;

    console.log(`${curState.start} === ${start}`);
    if (curState.start === start) return null;

    const newState = {
      query,
      total,
      spend: parseInt((new Date())*1 - start*1000),
      start
    };

    console.log('newState');
    console.log(newState);

    if (JSON.stringify(newState) !== JSON.stringify(curState)) {
      return newState;
    }

    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (JSON.stringify(nextState) !== JSON.stringify(this.state));
  }



  render() {
    console.log('render Stats');
    console.log(this.state);
    const { json } = this.props;
    if (!json) return null;

    const { query, total, spend } = this.state;

    return (
      <div className={styles.stats}>
        <div>Запрос:<b>{ query }</b></div>
        <div>Найдено:<b>{ total }</b></div>
        <div>Время: <b>{ spend }мс</b></div>
      </div>
    )
  }
}
