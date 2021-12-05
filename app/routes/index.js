'use strict';

const authRoutes = require('./auth');

module.exports = app => {
    authRoutes(app);
}