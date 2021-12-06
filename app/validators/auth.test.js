'use strict';

const { validator } = require('../utils/testing');
const schemas = require('./auth');

describe('validators/auth', () => {
    describe('signIn and signUp', () => {
        it('should fail if empty body send', () => {
            const validation = validator({ body: {} }, schemas.signUp, schemas.defaultOptions);
            expect(validation.error).not.toBe(null);
        });
        it('should fail if no email provided', () => {
            const validation = validator({ body: { bla: 'FAKE_BLA' } }, schemas.signUp, schemas.defaultOptions);
            expect(validation.error).not.toBe(null);
        });
        it('should fail if no password provided', () => {
            const validation = validator({ body: { email: 'bsa' } }, schemas.signUp, schemas.defaultOptions);
            expect(validation.error).not.toBe(null);
        });
        it('should fail if email is invalid', () => {
            const validation = validator({ body: { email: 'FAKE_EMAIL', password: 'Password1!' } }, schemas.signUp, schemas.defaultOptions);
            expect(validation.error).not.toBe(null);
        });
        it('should fail if password is too short', () => {
            const validation = validator({ body: { email: 'fake@email.com', password: 'Pa1@' } }, schemas.signUp, schemas.defaultOptions);
            expect(validation.error).not.toBe(null);
        });
        it('should fail if password without special character', () => {
            const validation = validator({ body: { email: 'fake@email.com', password: 'Password1' } }, schemas.signUp, schemas.defaultOptions);
            expect(validation.error).not.toBe(null);
        });
        it('should fail if password without upper case', () => {
            const validation = validator({ body: { email: 'fake@email.com', password: 'password1!' } }, schemas.signUp, schemas.defaultOptions);
            expect(validation.error).not.toBe(null);
        });
        it('should fail if password without number', () => {
            const validation = validator({ body: { email: 'fake@email.com', password: 'Password!' } }, schemas.signUp, schemas.defaultOptions);
            expect(validation.error).not.toBe(null);
        });
        it('should fail if password is common', () => {
            const validation = validator({ body: { email: 'fake@email.com', password: 'Password1!' } }, schemas.signUp, schemas.defaultOptions);
            expect(validation.error).not.toBe(null);
        });
        it('should not fail if all body are provided', () => {
            const validation = validator({ body: { email: 'fake@email.com', password: 'Password12!' } }, schemas.signIn, schemas.defaultOptions);
            expect(validation.error).toBe(undefined);
        });
    });
    describe('isAuth', () => {
        it('should fail if no headers provided', () => {
            const validation = validator({}, schemas.isAuth, schemas.isAuthOptions);
            expect(validation.error).not.toBe(null);
        })
        it('should fail if no authorization headers provided', () => {
            const validation = validator({ headers: { someHeader: 'bla' } }, schemas.isAuth, schemas.isAuthOptions);
            expect(validation.error).not.toBe(null);
        })
        it('should not fail if authorization headers provided', () => {
            const validation = validator({ headers: { authorization: 'mockedToken' } }, schemas.isAuth, schemas.isAuthOptions);
            expect(validation.error).not.toBe(null);
        })
    })
});