'use strict';

module.exports = {
    dbConnection: process.env.DB_CONNECTION,
    dbPoolMin: parseInt(process.env.DB_POOL_MIN, 10) || 1,
    dbPoolMax: parseInt(process.env.DB_POOL_MAX, 10) || 2,
    port: parseInt(process.env.SERVER_PORT, 10) || 4000,
    cipherPasswordKey: process.env.CIPHER_PASSWORD_KEY,
    cipherPasswordName: 'aes-256-cbc',
    passwordVersions: process.env.PASSWORD_VERSIONS || 'v0',
}