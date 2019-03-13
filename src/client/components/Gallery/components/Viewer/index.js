import React from 'react';
import ReactJson from 'react-json-view'

import Dialog from 'react-toolbox/lib/dialog';
import CloseIcon from 'mdi-react/CloseIcon'

import styles from './index.css';

export default ({ item, close }) => {
  const {
    _source: {
      model,
      descr,
      img_url,
      params_agg
    }
  } = item;


  return (
    <Dialog
      className={styles.dialog}
      active={true}
      onEscKeyDown={close}
      onOverlayClick={close}
      type="fullscreen"
    >
      <div className={styles.wrapper}>

        <CloseIcon onClick={close} className={styles.close} />

        <div className={styles.content}>
          <div className={styles.left}>
            <img src={img_url}/>
          </div>

          <div className={styles.right}>
            <div className={styles.name}>{model}</div>

            <div className={styles.part}>
              {
                params_agg && params_agg.map(({name, value}) => (
                  <div>{name}: {value}</div>
                ))
              }
            </div>

            <div className={styles.part}>
              {descr}
            </div>


            <ReactJson src={item} collapsed={false} theme="monokai"/>
          </div>

        </div>
      </div>
    </Dialog>
  )
}
