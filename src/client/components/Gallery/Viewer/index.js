import React from 'react';
import ReactJson from 'react-json-view'

import Dialog from 'react-toolbox/lib/dialog';
import CloseIcon from 'mdi-react/CloseIcon'

import Block from './Block';
import Explanation from './Explanation';

import styles from './index.css';

const currencyIconMap = {
  rub: '₽',
  usd: '$',
  eur: '€',
  uah: '₴',
  kzt: '₸'
};

export default ({ item, close }) => {
  const {
    _source: {
      model,
      price,
      currency = 'rub',
      descr,
      img_url,
      params_agg
    },
    _explanation
  } = item;

  console.log('_explanation');
  console.log(_explanation);

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

            <div className={styles.price}>
              {price}<span className={styles.currency}>{currencyIconMap[currency]}</span>
            </div>

            <Block>
              {
                params_agg && params_agg.map(({name, value}) => (
                  <div key={name}>{name}: {value}</div>
                ))
              }
            </Block>

            <Block>
              {descr}
            </Block>

            <Explanation explanation={_explanation} />
          </div>

        </div>
      </div>
    </Dialog>
  )
}
