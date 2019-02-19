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
    const { type, data } = action;
    switch (type) {
      case 'server/getjson':
        can.emit('json:sync', socket, data);
        break;
      default: console.log(`Unknown action ${type}`);
    }
  });
});

can.on('json:sync', (socket = io, { query, offset, limit }) => {
  if (query) {
    const url = `${config.searchUrl}?q=${encodeURIComponent(query)}&id2name=true&getrawoutput&debug=true&explain=true&offset=${offset}&limit=${limit}`;
    console.log(url);
    request.get({
      url,
      json: true,
    }, (err, httpResponse, body) => {
      if (err) {
        console.error('JSON: Request failed:', err, body);
        socket.emit('action', { type: 'json', data: null });
      } else {
        socket.emit('action', { type: 'json', data: body });
      }
    });
  }
});
