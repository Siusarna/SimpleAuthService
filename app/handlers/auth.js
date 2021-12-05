'use strict';

const argon2 = require('argon2');
const {BadRequest} = require('../exceptions')
const {encryptPassword, hashing, decryptPassword, encryptData, decryptData} = require('../utils/crypto');
const { decrypt } = require('../lib/aws')
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
    const {iv, password: storedPassword, address, phone, ...user} = storedUser;
    const arrIv = new Uint8Array(iv.split(','));
    const decryptedPassword = decryptPassword(storedPassword, config.cipherPasswordKey, arrIv);
    if (!(await argon2.verify(decryptedPassword, password))) {
        throw new BadRequest('Login failed; Invalid email or password.');
    }
    return {
        user,
    };
};

const signUp = async ({email, password}) => {
    const hashedPassword = await hashing(password);
    const {encrypted: encryptedPassword, iv} = await encryptPassword(hashedPassword, config.cipherPasswordKey);
    const {password: storedPassword, iv: storedIv, ...user} = await knex.transaction(trx => {
        return userModels.create(trx, {
            email,
            iv,
            password: encryptedPassword
        })
    })



    return {
        user
    };
}

module.exports = {
    signUp,
    signIn
}