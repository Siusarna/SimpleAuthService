'use strict';

const { celebrate } = require('celebrate');
const validator = require('../validators/auth');
const rates = require('../rate-limits/auth');

const authController = require('../controllers/auth');
const wrap = require('../middleware/wrap');

module.exports = app => {
    app.post('/api/v1/sign-in', rates.signInLimiter, celebrate(validator.signIn, validator.defaultOptions), wrap(authController.signIn));
    app.post('/api/v1/sign-up', rates.signUpLimiter, celebrate(validator.signUp, validator.defaultOptions), wrap(authController.signUp));
    app.get('/api/v1/is-auth', celebrate(validator.isAuth, validator.isAuthOptions), wrap(authController.isAuth));
}