'use strict';

const { Joi } = require('celebrate');

/**
 * @description - This utility allows to mock chained calls of knex instance.
 * It will replace each chained call with jest.fn
 *
 * @returns {{endingCallbacks: *}}
 */
const mockProxyFactory = () => {
    const proxyMock = new Proxy(
        { then: Promise.resolve() },
        {
            get(target, name) {
                if (name in target) {
                    return target[name];
                }
                // eslint-disable-next-line no-undef
                const mock = jest.fn();
                mock.mockReturnValue(proxyMock);
                // eslint-disable-next-line no-param-reassign
                target[name] = mock;
                return mock;
            }
        }
    );
    return proxyMock;
};

const validator = (data, schema, options = {}) => {
    return Joi.object(schema).validate(data, options);
};

module.exports = {
    mockProxyFactory,
    validator
};