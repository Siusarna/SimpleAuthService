'use strict';

const { Joi } = require('celebrate');
const { isCommonPassword } = require('../utils/isCommonPassword');

const loginInfo = Joi.object({
    email: Joi.string().email().required(),
    password: Joi
        .string()
        .regex(/^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)(?=.*[@$!%*?&])[\p{Ll}\p{Lu}\d@$!%*?&]{8,64}$/u)
        .required()
        .label('Minimum eight and maximum 64 characters, at least one uppercase letter, one lowercase letter, one number and one special character')
        .custom((value, helper) => {
            if (isCommonPassword(value)) {
                return helper.message({custom: 'This password is common'});
            }
            return value
        })
})

exports.signIn = {
    body: loginInfo
}

exports.signUp = {
    body: loginInfo
}

exports.isAuth = {
    headers: Joi.object({
        authorization: Joi.string().required(),
    })
}

const defaultOptions = {
    presence: 'required',
    allowUnknown: false,
    abortEarly: false,
    convert: false
};

exports.defaultOptions = defaultOptions

exports.isAuthOptions = {
    ...defaultOptions,
    allowUnknown: true
}