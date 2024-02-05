const express = require('express');
const app = require('./app');
const port = 3000;

const server = express();

server.use(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});