'use strict';

const { celebrate } = require('celebrate');
const validator = require('../validators/auth');
const rates = require('../rate-limits/auth');

const authController = require('../controllers/auth');
const wrap = require('../middleware/wrap');

module.exports = app => {
    app.post('/api/v1/sign-in', rates.signInLimiter, celebrate(validator.signIn, validator.options), wrap(authController.signIn));
    app.post('/api/v1/sign-up', rates.signUpLimiter, celebrate(validator.signUp, validator.options), wrap(authController.signUp));
}