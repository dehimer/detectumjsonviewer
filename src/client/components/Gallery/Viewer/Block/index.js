import React, { PureComponent } from 'react';

import styles from './index.css';

export default class Block extends PureComponent {
  state = {
    collapsed: true
  };

  render() {
    const { children, uncollapsable } = this.props;
    const { collapsed } = this.state;

    return (
      <div
        onClick={() => this.setState({ collapsed: !collapsed })}
        className={styles.block}
      >
        <div className={collapsed && !uncollapsable ? styles.collapsed : styles.content}>
          {children}
        </div>
        {collapsed && !uncollapsable ? <div>...</div> : null}
      </div>
    )
  }
}
