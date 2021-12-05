'use strict';

const { port } = require('./config');
const app = require ('./app');
const http = require('http');

http.createServer(app).listen(port, () => {
    console.log(`Listening on port ${port}`);
})