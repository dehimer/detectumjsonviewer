import React from 'react';
import ReactJson from 'react-json-view'

import Dialog from 'react-toolbox/lib/dialog';
// import FontIcon from 'react-toolbox/lib/font_icon';
import CloseIcon from 'mdi-react/CloseIcon'


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
          <div className={styles.headerLeftPart}>
            <img src={_source.img_url}/>
            <div className={styles.name}>{ _source.model }</div>
          </div>
          <CloseIcon onClick={close} className={styles.close} />
        </div>

        <div className={styles.tree}>
          <ReactJson src={_source} collapsed={false} theme="monokai"/>
        </div>
      </div>
    </Dialog>
  )
}
