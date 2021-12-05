'use strict';

const { Joi } = require('celebrate');
const { DatabaseValidationError, DatabaseSaveError } = require('../exceptions/index');
const config = require('../config');
const humps = require('humps');

const validateSchema = (schema, data) => {
    if (Array.isArray(data)) {
        data.forEach(obj => validateSchema(schema, obj));
    }
    const v = schema.validate(data);
    if (v.error) {
        const errors = v.error.details.map(err => err.message);
        throw new DatabaseValidationError(errors.join(', '));
    }
}

const table = 'users';

const createSchema = Joi.object({
    email: Joi.string().lowercase().required(),
    password: Joi.string().required(),
    iv: Joi.string().required(),
    passwordVersion: Joi.string().required(),
});

const create = async (trx, data) => {
    const inputData = {
        ...data,
        passwordVersion: config.passwordVersions
    }
    validateSchema(createSchema, inputData);
    const results = await trx
        .insert(humps.decamelizeKeys(inputData))
        .into(table)
        .returning('*')
        .catch(e => {
            if (e.constraint === 'users_email_uindex') {
                const { password, ...rest } = data;
                throw new DatabaseSaveError('User with this email has already exists', undefined, rest);
            }
            throw e;
        });
    return humps.camelizeKeys(results[0]);
}

const selectByEmail = async (trx, data) => {
    const results = await trx
        .select(['id', 'email', 'password', 'iv', 'created_at'])
        .from(table)
        .where({ email: data.email })
    return humps.camelizeKeys(results[0]);
}

module.exports = {
    create,
    selectByEmail
}