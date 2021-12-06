'use strict';

const crypto = require('../utils/crypto');
const jwtUtils = require('../utils/jwt');
const userModel = require('../models/users');
const handlers = require('./auth');

jest.mock('../lib/db', () => {
    return {
        knex: {
            transaction: jest.fn(async (callback) => callback({})),
        }
    }
})

describe('handlers/auth', () => {
    describe('signIn', () => {
        it('should throw BadRequest error if user doesn\'t exists', async () => {
            const inputData = {
                email: 'mockedemail@bla.com',
                password: 'SomePassword'
            }
            jest.spyOn(userModel, 'selectByEmail').mockResolvedValue(null)
            const result = handlers.signIn(inputData);
            await expect(result).rejects.toThrowError('Login failed; Invalid email or password.')
        })
        it('should throw BadRequest error if incorrect password', async () => {
            const inputData = {
                email: 'mockedemail@bla.com',
                password: 'SomePassword'
            };
            const user = {
                email: inputData.email,
                password: 'mockedPassword',
                iv: '3,46,34,45,123,243,112'
            };
            jest.spyOn(userModel, 'selectByEmail').mockResolvedValue(user);
            jest.spyOn(crypto, 'decryptPassword').mockReturnValue('$argon2id$v=19$m=16,t=2,p=1$MzI0YWZkMjMzNA$y5SK8IypD7KD8+RZtYWh2mRQ5hqZfQ9dlIDpzWstLcxnwywGARy2rPgXNjEV1U+7vwM')
            const result = handlers.signIn(inputData);
            await expect(result).rejects.toThrowError('Login failed; Invalid email or password.')
        })
        it('should successfully sign in', async () => {
            const inputData = {
                email: 'mockedemail@bla.com',
                password: 'SomePassword'
            };
            const token = 'MockedToken'
            const user = {
                email: inputData.email,
                password: 'mockedPassword',
                iv: '3,46,34,45,123,243,112',
                createdAt: new Date(),
            };
            jest.spyOn(userModel, 'selectByEmail').mockResolvedValue(user);
            jest.spyOn(crypto, 'decryptPassword').mockReturnValue('$argon2id$v=19$m=16,t=2,p=1$MzI0YWZkMjMzNA$KmVd6rOhVBWBFHB9Db9Jawm4wa0XTDklhgiIjn7NmNe7BSNlKAGV49ZNImJGZi7ACXM')
            jest.spyOn(jwtUtils, 'createToken').mockReturnValue('MockedToken')
            const result = await handlers.signIn(inputData);
            expect(result).toEqual({
                user: {
                    email: user.email,
                    createdAt: user.createdAt
                },
                token
            });
        })
    })
    describe('signUp', () => {
        it('should successfully sign up', async () => {
            const inputData = {
                email: 'mockedemail@bla.com',
                password: 'SomePassword'
            };
            const token = 'MockedToken'
            const user = {
                email: inputData.email,
                password: 'mockedPassword',
                iv: '3,46,34,45,123,243,112',
                createdAt: new Date(),
            };
            jest.spyOn(userModel, 'create').mockResolvedValue(user);
            jest.spyOn(crypto, 'encryptPassword').mockReturnValue(user.password)
            jest.spyOn(jwtUtils, 'createToken').mockReturnValue('MockedToken')
            const result = await handlers.signUp(inputData);
            expect(result).toEqual({
                user: {
                    email: user.email,
                    createdAt: user.createdAt
                },
                token
            });
        })
    })
    describe('isAuth', () => {
        it('should successfully check isAuth', async () => {
            const token = 'MockedToken'
            const user = {
                email: 'mockedEmail@a.com',
                createdAt: new Date(),
            };
            jest.spyOn(userModel, 'selectById').mockResolvedValue(user);
            jest.spyOn(jwtUtils, 'verifyToken').mockReturnValue('MockedUserId')
            const result = await handlers.isAuth(token);
            expect(result).toEqual({
                user
            });
        })
    })
})