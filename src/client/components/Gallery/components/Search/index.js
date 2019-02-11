import React from 'react';
import { ArrowRightRounded } from '@material-ui/icons'

import './index.css'

export default ({ query, change }) => (
  <div className="search">
    <ArrowRightRounded className="arrow"/>
    <input
      className="input"
      type="text"
      value={query}
      onChange={(e) => change(e.target.value)}
      placeholder="Поиск"
    />
  </div>
)
