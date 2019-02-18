import React from 'react';
import Input from 'react-toolbox/lib/input';
import SearchIcon from 'mdi-react/SearchIcon'

import styles from './index.css'


export default ({ query, change }) => (
  <Input
    className={styles.search}
    type='text'
    label='Поиск'
    icon={<SearchIcon />}
    value={query}
    onChange={(value) => change(value)}
  />
)
