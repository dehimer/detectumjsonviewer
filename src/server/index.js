const express = require('express');
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
