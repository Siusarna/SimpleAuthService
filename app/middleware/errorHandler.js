'use strict';

const DEFAULT_ERROR_CODE = 500;
const DEFAULT_ERROR_TYPE = 'Error';
const DEFAULT_ERROR_TITLE = 'System Error';
const DEFAULT_ERROR_DESCRIPTION = DEFAULT_ERROR_TITLE;

exports.notFound = (req, res) => {
    res.status(404);
    console.error(`Unknown URL ${req.url}`);
    return res.send({ error: 'Unknown URL' });
};

exports.validation = (err, req, res, next) => {
    let isValidationError = false;
    let details = {};
    if (err && err.details && err.details.forEach) {
        err.details.forEach(el => {
            if (el.name === 'ValidationError') {
                details = el.details;
                isValidationError = true;
            }
        });
    }
    if (!isValidationError) {
        return next(err);
    }

    res.status(422);
    console.error({ err, message: 'ValidationError' });
    return res.send({ error: details });
};

exports.unexpected = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const { status: code = DEFAULT_ERROR_CODE, details } = err;
    res.status(code);

    let { name: type = DEFAULT_ERROR_TYPE, title = DEFAULT_ERROR_TITLE, message: description = DEFAULT_ERROR_DESCRIPTION } = err;

    if (code > 499) {
        if (details) {
            console.error(details);
        } else {
            console.error(err);
        }
    }

    // return the error in the format clients expect
    return res.send({
        error: {
            code,
            type,
            title,
            description,
            stack: err.stack
        }
    });
};