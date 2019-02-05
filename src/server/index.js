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
  can.emit('json:sync', socket);

  socket.on('action', (action) => {
    console.log(action);
    const { type, data } = action;
    switch (type) {
      case 'server/getjson':
        can.emit('json:sync', socket);
        break;
      default: console.log(`Unknown action ${type}`);
    }
  });
});

can.on('json:sync', (socket = io) => {
  console.log('json:sync');
  request(config.searchUrl, () => {

  });

  request.get({
    url: `${config.searchUrl}?q=sony&id2name=true&getrawoutput&debug=true&explain=true`,
  }, (err, httpResponse, body) => {
    if (err || body !== 'success') {
      console.error('JSON: Request failed:', err, body);
    } else {
      photo.synced = true;
      console.log('JSON: Request successful!  Server responded with:', body);
    }

    console.log(body);
    socket.emit('action', { type: 'json', data: JSON.parse(body) });
  });

});
