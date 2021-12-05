'use strict';

const crypto = require('crypto');
const argon2 = require('argon2');
const { promisify } = require('util');
const config = require('../config');

const promisifiedRandomFill = promisify(crypto.randomFill);

const encryptPassword = async (data, key) => {
    const iv = await promisifiedRandomFill(new Uint8Array(16));
    const aes = crypto.createCipheriv(config.cipherPasswordName, key, iv);
    let encrypted = aes.update(data, 'utf8', 'hex');
    encrypted += aes.final('hex');

    return { encrypted, iv: iv.toString() };
}
 
const encryptData = async (data, key) => {
    const iv = await promisifiedRandomFill(new Uint8Array(16));
    const aes = crypto.createCipheriv(config.cipherDataName, key, iv);
    let encrypted = aes.update(data, 'utf8', 'hex');
    encrypted += aes.final('hex');
    const tag = aes.getAuthTag();

    return { encrypted, iv: iv.toString(), tag: tag.toString('base64') };
}

const decryptData = (data, key, iv, tag) => {
    const aes = crypto.createDecipheriv(config.cipherDataName, key, iv);
    aes.setAuthTag(tag);
    let decrypted = aes.update(data, 'hex', 'utf-8');
    decrypted += aes.final('utf-8');

    return decrypted;
}

const decryptPassword = (data, key, iv) => {
    const aes = crypto.createDecipheriv(config.cipherPasswordName, key, iv);
    let decrypted = aes.update(data, 'hex', 'utf-8');
    decrypted += aes.final('utf-8');

    return decrypted;
}

const hashing = (data) => argon2.hash(data, {
    type: argon2.argon2id,
    memoryCost: 1024 * 37,
    parallelism: 1,
    hashLength: 50,
});

module.exports = {
    encryptPassword,
    hashing,
    decryptPassword,
    encryptData,
    decryptData
}