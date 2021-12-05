'use strict';

const handlers = require('../handlers/auth');

const signIn = async (req, res) => {
    const response = await handlers.signIn(req.body);
    res.status(200).send({
        ...response
    })
};

const signUp = async (req, res) => {
    const response = await handlers.signUp(req.body);
    res.status(200).send({
        ...response
    })
};

module.exports = {
    signIn,
    signUp
}