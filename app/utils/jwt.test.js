'use strict';

const jwtUtils = require('./jwt');


describe('utils/jwt', () => {
    describe('createToken', () => {
        it('should return correct token', async () => {
            const id = 2
            const result = await jwtUtils.createToken(id);
            expect(typeof result).toEqual('string')
        })
    })
    describe('verity', () => {
        it('should throw error if no token is provided', () => {
            try {
                jwtUtils.verifyToken()
            } catch (e) {
                expect(e.name).toEqual('Unauthorized')
            }
        })
        it('should throw error if token is invalid', () => {
            try {
                jwtUtils.verifyToken(2)
            } catch (e) {
                expect(e.name).toEqual('Unauthorized')
            }
        })
        it('should successfully verify token', async () => {
            const id = 2
            const token = await jwtUtils.createToken(id)
            const res = jwtUtils.verifyToken(token)
            expect(res.id).toEqual(id)
        })
    })
})