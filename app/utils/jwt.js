'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config');
const { Unauthorized } = require('../exceptions/index');

const createToken = id => {
    return jwt.sign({id}, config.tokenKey, { expiresIn: config.tokenExpireTime })
}

const verifyToken = (token) => {
    if (!token) {
        throw new Unauthorized('A token is required for authentication');
    }
    try {
        return jwt.verify(token, config.tokenKey)
    } catch (err) {
        throw new Unauthorized('Invalid Token');
    }
};

module.exports = {
    createToken,
    verifyToken
}