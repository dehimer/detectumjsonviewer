import React from 'react';
import ReactJson from 'react-json-view'

import Dialog from 'react-toolbox/lib/dialog';
import CloseIcon from 'mdi-react/CloseIcon'

import styles from './index.css';

export default ({ item, close }) => {
  const { _source: { model, img_url } } = item;
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
          <div className={styles.headerLeftPart}>
            <img src={img_url}/>
            <div className={styles.name}>{model}</div>
          </div>
          <CloseIcon onClick={close} className={styles.close} />
        </div>

        <div className={styles.tree}>
          <ReactJson src={item} collapsed={false} theme="monokai"/>
        </div>
      </div>
    </Dialog>
  )
}
