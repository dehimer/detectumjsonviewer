import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Gallery from './components/Gallery/index';
import Viewer from './components/Viewer/index';

export default () => (
  <div>
    <Switch>
      <Route exact path="/:query" component={Gallery} />
      <Route path="/:query/:id" component={Viewer} />
    </Switch>
  </div>
);
