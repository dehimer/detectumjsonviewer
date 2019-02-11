import React from 'react';
import ReactJson from 'react-json-view'

import { Dialog, DialogTitle } from "@material-ui/core";

import './index.css';


export default ({ item: { _source }, close }) => (
  <Dialog open={true} onClose={close} aria-labelledby="simple-dialog-title" maxWidth={false} style={{width: '100vw'}}>
    <DialogTitle style={{ padding: 0 }}>
      <div className="header">
        <img src={_source.img_url}/>
        <div className="name">{ _source.model }</div>
      </div>
    </DialogTitle>
    <div className="viewer">
      <div className="tree">
        <ReactJson src={_source} collapsed={false} theme="monokai"/>
      </div>
    </div>
  </Dialog>
)
