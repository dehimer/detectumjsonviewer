import React from 'react';
import { TextField } from '@material-ui/core'

import './index.css'

export default ({ query, change }) => (
  <TextField
    className="search"
    label="Поиск"
    helperText="Введите поисковый запрос"
    value={query}
    onChange={(e) => change(e.target.value)}
    margin="none"
    variant="filled"
    fullWidth={true}
  />
)
