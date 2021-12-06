'use strict';

const handlers = require('../handlers/auth');
const controllers = require('./auth')

describe('controllers/auth', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    })
    afterEach(() => {
        jest.clearAllMocks();
    })
    describe('SignIn', () => {
        it('should successfully login', async () => {
            const mockedResult = { mock: 'MockedResult' }
            jest.spyOn(handlers, 'signIn').mockResolvedValue(mockedResult);
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn().mockReturnThis() };
            await controllers.signIn(req,res);
            expect(res.send).toBeCalledWith(mockedResult);
            expect(res.status).toBeCalledWith(200);
        })
    })
    describe('SignUp', () => {
        it('should successfully sign up', async () => {
            const mockedResult = { mock: 'MockedResult' }
            jest.spyOn(handlers, 'signUp').mockResolvedValue(mockedResult);
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn().mockReturnThis() };
            await controllers.signUp(req,res);
            expect(res.send).toBeCalledWith(mockedResult);
            expect(res.status).toBeCalledWith(200);
        })
    })
    describe('IsAuth', () => {
        it('should successfully check isAuth', async () => {
            const mockedResult = { mock: 'MockedResult' }
            jest.spyOn(handlers, 'isAuth').mockResolvedValue(mockedResult);
            const req = { get: jest.fn().mockReturnValue('fakeJwtToken')};
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn().mockReturnThis() };
            await controllers.isAuth(req,res);
            expect(res.send).toBeCalledWith(mockedResult);
            expect(res.status).toBeCalledWith(200);
            expect(req.get).toBeCalledTimes(1);
        })
    })
})