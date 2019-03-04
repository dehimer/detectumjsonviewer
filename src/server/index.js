const express = require('express');
const request = require('request');
const socketIO = require('socket.io');
const http = require('http');
const Emitter = require('events');
const can = new Emitter();


const config = require('../../config');

// HTTP
const port = config.port || 3000;
const app = express();
const server = http.createServer(app);

app.use(express.static('dist'));

server.listen(port, () => {
  console.log(`Server is ran on : http://localhost:${port}`);
});


// SOCKETIO
const io = socketIO();
io.attach(server);

io.on('connection', (socket) => {
  socket.on('action', (action) => {
    console.log('action');
    console.log(action);
    const { type, data } = action;
    switch (type) {
      case 'server/getjson':
        can.emit('json:sync', socket, data);
        break;
      default: console.log(`Unknown action ${type}`);
    }
  });
});

can.on('json:sync', (socket = io, { tsid, query, offset, limit, categories, params }) => {
  if (query) {
    const qs = {
      q: encodeURIComponent(query),
      id2name: true,
      getrawoutput: true,
      debug: true,
      explain: true,
      offset,
      limit
    };

    if (categories.length) {
      qs.category_id = encodeURIComponent(categories.join(','));
    }

    qs.params = params.length;
    if (params.length) {
      // console.log(params);
      // qs.category_id = encodeURIComponent(categories.join(','));
      // qs.params = 0;

      params.forEach((param, index) => {
        qs[`param_${index}`] = param.name;
        qs[`value_${index}`] = param.value;
      });

      // param_1=vendor&value_1=Disney
    }

    console.log(tsid);
    console.log(qs);

    request.get({
      url: config.searchUrl,
      json: true,
      qs
    }, (err, httpResponse, body) => {
      console.log(`${query} res`);
      if (err) {
        console.error('JSON: Request failed:', err, body);
        socket.emit('action', { type: 'json', data: null });
      } else {
        console.log(body);
        body.q = decodeURIComponent(body.q);
        body.tsid = tsid;
        socket.emit('action', { type: 'json', data: body });
      }
    });
  }
});
