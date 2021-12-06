'use strict';

const cryptoUtils = require('./crypto');
const argon2 = require('argon2');


describe('utils/crypto', () => {
    describe('hashing', () => {
        it('should return correct hash', async () => {
            const data = 'SuperPuperSecretPasswordBlaBlaBla'
            const result = await cryptoUtils.hashing(data);
            const compare = await argon2.verify(result, data)
            expect(compare).toEqual(true)
        })
    })
    describe('encryptPassword', () => {
        it('should encrypt password', async () => {
            const data = 'mockedData';
            const key = '971c0b5a08ddbcb95ede9f6fe04df884';
            const res = await cryptoUtils.encryptPassword(data, key);
            expect(res).not.toBe(null)
        })
    })
    describe('decryptPassword', () => {
        it('should decrypt password', async () => {
            const data = 'mockedData';
            const key = '971c0b5a08ddbcb95ede9f6fe04df884';
            const encrypted = await cryptoUtils.encryptPassword(data, key);
            const decrypted = await cryptoUtils.decryptPassword(encrypted.encrypted, key, new Uint8Array(encrypted.iv.split(',')))
            expect(decrypted).not.toBe(null)
        })
    })
})