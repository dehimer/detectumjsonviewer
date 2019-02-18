import React, { PureComponent } from 'react';
import Input from 'react-toolbox/lib/input';
import SearchIcon from 'mdi-react/SearchIcon'

import styles from './index.css'

export default class Search extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { query: this.props.query };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.query !== nextProps.query) {
      this.setState({ query:  nextProps.query });
    }
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      const { search } = this.props;
      const { query } = this.state;

      search(query);
    }
  }

  render() {
    const { query } = this.state;

    return (
      <Input
        className={styles.search}
        type='text'
        label='Поиск'
        icon={<SearchIcon />}
        value={query}
        onKeyPress={(e) => this.onKeyPress(e)}
        onChange={(value) => this.setState({ query: value.replace(/[^-a-zA-Z0-9 ]/g, '') })}
        floating={false}
      />
    )
  }
}
