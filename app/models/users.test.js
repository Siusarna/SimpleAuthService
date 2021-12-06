'use strict';

const humps = require('humps');
const model = require('./users');
const { DatabaseValidationError } = require('../exceptions');
const { mockProxyFactory } = require('../utils/testing')

const table = 'users';
let knexMock;

beforeEach(() => {
    knexMock = mockProxyFactory({});
})

describe('models/users', () => {
    describe('selectById', () => {
        it('should get items by id', async () => {
            const result = {
                id: 2,
                email: 'mockedEmail',
                createdAt: new Date()
            }
            knexMock.first.mockResolvedValue(result);
            const res = await model.selectById(knexMock, 2);

            expect(res).toEqual(result);
            expect(knexMock.from).toBeCalledWith(table);
            expect(knexMock.select).toBeCalledWith(['id', 'email', 'created_at']);
            expect(knexMock.where).toBeCalledWith({ id: 2 });
        });
    });
    describe('selectByEmail', () => {
        it('should get user by email', async () => {
            const email = 'mockedEmail';
            const result = {
                id: 2,
                email,
                createdAt: new Date(),
                iv: '3,56,3,6,78',
                password: 'mockedPassword'
            }
            knexMock.first.mockResolvedValue(result);
            const res = await model.selectByEmail(knexMock, { email });

            expect(res).toEqual(result);
            expect(res.email).toEqual(email);
            expect(knexMock.from).toBeCalledWith(table);
            expect(knexMock.select).toBeCalledWith(['id', 'email', 'password', 'iv', 'created_at']);
            expect(knexMock.where).toBeCalledWith({ email });
        });
    });
    describe('create', () => {
        it('creates a new row and returns the row successfully when all fields are passed in', async () => {
            const data = {
                email: 'mockedEmail',
                password: 'mockedPassword',
                iv: 'mockedIv',
            };
            const mockedData = {
                ...data,
                createdAt: new Date()
            }
            knexMock.returning.mockResolvedValue([{ mockedData }]);
            const res = await model.create(knexMock, data);

            expect(res).toEqual({ mockedData });
            expect(knexMock.insert).toBeCalledWith(humps.decamelizeKeys({
                ...data,
                password_version: 'v0'
            }));
            expect(knexMock.insert().into).toBeCalledWith(table);
            expect(knexMock.insert().into().returning).toBeCalledWith('*');
        });

        it('throws a validation error when pass an extra data param is passed in', async () => {
            const data = {
                email: 'mockedEmail',
                password: 'mockedPassword',
                iv: 'mockedIv',
                FAKE_KEY: 'FAKEVALUE'
            };

            const returnValue = model.create(knexMock, data);

            await expect(returnValue).rejects.toThrowError(DatabaseValidationError);
        });
    });
});