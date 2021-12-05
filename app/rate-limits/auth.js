'use strict';

const rateLimit = require("express-rate-limit");

const signUpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minute window
    max: 3, // start blocking after 5 requests
    message:
        "Too many accounts created from this IP, please try again after an 10 minutes"
});

const signInLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minute window
    max: 5, // start blocking after 5 requests
    message:
        "Too many failed sign-ins from this IP, please try again after an 10 minutes"
});

module.exports = {
    signInLimiter,
    signUpLimiter
}