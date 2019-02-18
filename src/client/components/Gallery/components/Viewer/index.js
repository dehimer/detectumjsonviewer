import React from 'react';
import ReactJson from 'react-json-view'

import Dialog from 'react-toolbox/lib/dialog';

import styles from './index.css';

export default ({ item: { _source }, close }) => {
  return (
    <Dialog
      className={styles.dialog}
      active={true}
      onEscKeyDown={close}
      onOverlayClick={close}
      type="fullscreen"
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <img src={_source.img_url}/>
          <div className={styles.name}>{ _source.model }</div>
        </div>

        <div className={styles.tree}>
          <ReactJson src={_source} collapsed={false} theme="monokai"/>
        </div>
      </div>
    </Dialog>
  )
}
