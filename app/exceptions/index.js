'use strict';

class BaseError extends Error {
    constructor(message, status, details) {
        super(message);

        this.status = status;
        this.details = details;
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }

    toString() {
        return `${this.name}(message="${this.message}", status="${this.status}")\n${JSON.stringify(this.details, null, 4)}`;
    }
}

class DatabaseValidationError extends BaseError {
    constructor(message, status = 422, details = {}) {
        super(message, status, details);
    }
}

class DatabaseSaveError extends BaseError {
    constructor(message, status = 409, details = {}) {
        super(message, status, details);
    }
}

class BadRequest extends BaseError {
    constructor(message, status = 400, details = {}) {
        super(message, status, details);
    }
}

module.exports = {
    DatabaseValidationError,
    DatabaseSaveError,
    BadRequest
}