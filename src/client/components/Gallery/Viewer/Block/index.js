import React, { PureComponent } from 'react';

import styles from './index.css';

export default class Block extends PureComponent {
  render() {
    const { children } = this.props;

    return (
      <div className={styles.block}>{children}</div>
    )
  }
}
