'use strict';

const authRoutes = require('./auth');
// const userRoutes = require('./user');
// const authMiddleware = require('../middleware/auth');

module.exports = app => {
    authRoutes(app);
    // app.use(authMiddleware);
    // userRoutes(app)
}