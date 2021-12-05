'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config');

const createToken = id => {
    return jwt.sign({id}, config.tokenKey, { expiresIn: config.tokenExpireTime })
}

module.exports = {
    createToken
}