'use strict';

const exception = require('./index');

function testException(errorMsg, errorName, errorCode, fnc, details = {}) {
    expect.assertions(6);
    try {
        fnc();
    } catch (e) {
        expect(e.message).toEqual(errorMsg);
        expect(e.status).toEqual(errorCode);
        expect(e.details).toStrictEqual(details);
        expect(e.name).toEqual(errorName);
        expect(typeof e.toString()).toEqual('string');
        expect(e.stack.indexOf(`${errorName}: ${errorMsg}`)).toBeGreaterThan(-1);
    }
}

let request;
let errorDetails;

beforeEach(() => {
    request = {
        path: '/api/v1',
        method: 'POST',
        data: 'Data'
    };
    errorDetails = {
        request: {
            ...request,
            data: {}
        },
        response: {}
    }
})

describe('exceptions/index', () => {
    describe('DatabaseValidationError', () => {
        it('Should pass a message', () => {
            const errorMsg = 'Database Validation Error';
            const errorName = 'DatabaseValidationError';
            const fnc = () => {
                throw new exception.DatabaseValidationError(errorMsg);
            }

            testException(`Schema validation error: ${errorMsg}`, errorName, 422, fnc);
        })
    })
    describe('DatabaseSaveError', () => {
        it('Should pass a message', () => {
            const errorMsg = 'Database Save Error';
            const errorName = 'DatabaseSaveError';
            const fnc = () => {
                throw new exception.DatabaseSaveError(errorMsg);
            }

            testException(errorMsg, errorName, 409, fnc);
        })
    })
    describe('Unauthorized', () => {
        it('Should pass a message', () => {
            const errorMsg = 'Unauthorized Error';
            const errorName = 'Unauthorized';
            const fnc = () => {
                throw new exception.Unauthorized(errorMsg);
            }

            expect.assertions(5);

            testException(errorMsg, errorName, 401, fnc);
        })
    })
    describe('BadRequest', () => {
        it('Should pass a message', () => {
            const errorMsg = 'BadRequest Error';
            const errorName = 'BadRequest';
            const fnc = () => {
                throw new exception.BadRequest(errorMsg);
            }
            testException(errorMsg, errorName, 400, fnc);
        })
    })
})