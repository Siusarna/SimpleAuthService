'use strict';

const argon2 = require('argon2');
const {BadRequest} = require('../exceptions')
const cryptoUtils = require('../utils/crypto');
const jwtUtils = require('../utils/jwt');
const config = require('../config');
const userModels = require('../models/users');
const {knex} = require('../lib/db');

const signIn = async ({email, password}) => {
    const storedUser = await knex.transaction(trx => {
        return userModels.selectByEmail(trx, {email})
    });
    if (!storedUser) {
        throw new BadRequest('Login failed; Invalid email or password.');
    }
    const {iv, password: storedPassword, ...user} = storedUser;
    const arrIv = new Uint8Array(iv.split(','));
    const decryptedPassword = cryptoUtils.decryptPassword(storedPassword, config.cipherPasswordKey, arrIv);
    if (!(await argon2.verify(decryptedPassword, password))) {
        throw new BadRequest('Login failed; Invalid email or password.');
    }

    const token = jwtUtils.createToken(storedUser.id);

    return {
        user,
        token,
    };
};

const signUp = async ({email, password}) => {
    const hashedPassword = await cryptoUtils.hashing(password);
    const {encrypted: encryptedPassword, iv} = await cryptoUtils.encryptPassword(hashedPassword, config.cipherPasswordKey);
    const {password: storedPassword, iv: storedIv, ...user} = await knex.transaction(trx => {
        return userModels.create(trx, {
            email,
            iv,
            password: encryptedPassword
        })
    })

    const token = jwtUtils.createToken(user.id);

    return {
        user,
        token
    };
}

const isAuth = async (token) => {
    const { id } = jwtUtils.verifyToken(token);
    const user = await knex.transaction(trx => {
        return userModels.selectById(trx, id);
    });

    return {
        user
    }
}

module.exports = {
    signUp,
    signIn,
    isAuth
}