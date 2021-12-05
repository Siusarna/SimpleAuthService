'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const csurf = require('csurf');
const hpp = require('hpp');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(bodyParser.json({ limit: '5mb' }));
// app.use(csurf({ cookie: true }));
app.use(hpp());
routes(app);

app.use(errorHandler.notFound);
app.use(errorHandler.validation);
app.use(errorHandler.unexpected);

module.exports = app;