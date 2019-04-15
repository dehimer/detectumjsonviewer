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
    const { json } = nextProps;

    if (!json) return null;
    if (!json.es_response) return null;

    const {
      q: query,
      es_response: { hits: { total } },
      stat: { start }
    } = json;

    if (curState.start === start) return null;

    const newState = {
      query,
      total,
      spend: parseInt((new Date())*1 - start*1000),
      start
    };

    if (JSON.stringify(newState) !== JSON.stringify(curState)) {
      return newState;
    }

    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (JSON.stringify(nextState) !== JSON.stringify(this.state));
  }

  render() {
    const { json, limit, offset } = this.props;
    if (!json) return null;

    const { query, total, spend } = this.state;

    return (
      <div className={styles.stats}>
        <div className={styles.queryInfo}>
          <div>Запрос: <b>"{ query }"</b></div>
          <div>Время выполнения: <b>{ spend }мс</b></div>
        </div>

        <div className={styles.totalFound}>
          <div className={styles.rotatedSquareTop}/>
          <div className={styles.rotatedSquareBottom}/>
          <div>{offset+1} - {Math.min(offset + limit, total)} из { total }</div>
        </div>
      </div>
    )
  }
}
