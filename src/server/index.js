const express = require('express');
const request = require('request');
const socketIO = require('socket.io');
const http = require('http');

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
        socket.emit('action', { type: 'json', data: {da: 'net'} });
        break;
      default: console.log(`Unknown action ${type}`);
    }
  });
});
