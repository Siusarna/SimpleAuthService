'use strict';

const middleware = require('./errorHandler');

describe('middleware/errorHandler', () => {
    describe('validation', () => {
        it('passes error through if not a validation error', () => {
            const err = {name: 'SystemError', details: 'Big problem!'};
            const next = jest.fn();
            const send = jest.fn();
            const status = jest.fn().mockReturnThis();

            expect.assertions(3);
            middleware.validation(err, {}, {send, status}, next);
            expect(status.mock.calls.length).toBe(0);
            expect(send.mock.calls.length).toBe(0);
            expect(next.mock.calls.length).toBe(1);
        });

        it('handles a Validation Error', () => {
            const err = {
                name: 'ValidationError', details: {
                    forEach: jest.fn().mockImplementation(cb => {
                        cb({
                            name: 'ValidationError',
                            detail: 'MockedDetails'
                        })
                    })
                }
            };
            const next = jest.fn();
            const send = jest.fn().mockReturnThis();
            const status = jest.fn().mockReturnThis();

            expect.assertions(4);
            middleware.validation(err, {}, {send, status}, next);
            expect(status.mock.calls.length).toBe(1);
            expect(status.mock.calls[0][0]).toBe(422);
            expect(send.mock.calls.length).toBe(1);
            expect(next.mock.calls.length).toBe(0);
        });
    });
    describe('unexpected', () => {
        const errorMessage = 'Foobar';

        it('headersSent calls next', () => {
            const err = {name: errorMessage, details: 'Big problem!'};
            const next = jest.fn();
            const send = jest.fn();
            const status = jest.fn().mockReturnThis();

            middleware.unexpected(err, {}, {send, status, headersSent: true}, next);
            expect(status.mock.calls.length).toBe(0);
            expect(send.mock.calls.length).toBe(0);
            expect(next.mock.calls.length).toBe(1);
            expect(next.mock.calls[0][0]).toBe(err);
        });

        it('headersSent doesnt calls next without details, with name, title and message', () => {
            const err = {name: errorMessage, title: 'SomeTitle', message: 'SomeMessage'};
            const next = jest.fn();
            const send = jest.fn();
            const status = jest.fn().mockReturnThis();

            middleware.unexpected(err, {}, {send, status}, next);
            expect(status.mock.calls.length).toBe(1);
            expect(send.mock.calls.length).toBe(1);
            expect(next.mock.calls.length).toBe(0);
        });

        it('headersSent doesnt calls next', () => {
            const err = {name: errorMessage, details: 'Big problem!'};
            const next = jest.fn();
            const send = jest.fn();
            const status = jest.fn().mockReturnThis();

            middleware.unexpected(err, {}, {send, status, headersSent: false}, next);

            expect(status.mock.calls.length).toBe(1);
            expect(send.mock.calls.length).toBe(1);
            expect(next.mock.calls.length).toBe(0);
        });
    });
    describe('notFound', () => {
        it('returns 404 message', () => {
            const err = {error: 'Unknown URL'};
            const next = jest.fn();
            const send = jest.fn().mockReturnThis();
            const status = jest.fn().mockReturnThis();

            middleware.notFound({}, {send, status});
            expect(status.mock.calls.length).toBe(1);
            expect(status.mock.calls[0][0]).toBe(404);
            expect(send.mock.calls.length).toBe(1);
            expect(send.mock.calls[0][0].error).toBe(err.error);
            expect(next.mock.calls.length).toBe(0);
        });
    });
});