'use strict';

const config = require('./config');

module.exports = {
    client: 'pg',
    connection: config.dbConnection,
    pool: { min: config.dbPoolMin, max: config.dbPoolMax },
}