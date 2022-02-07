"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var base_error_1 = require("../errors/base-error");
var errorHandler = function (err, req, res, next) {
    var status;
    var errors;
    switch (Object.getPrototypeOf(err.constructor)) {
        case base_error_1.BaseError:
            status = err.httpStatus;
            errors = err.serialize();
            break;
        default:
            status = 400;
            errors = [{ message: err.message }];
            break;
    }
    res
        .status(status)
        .send({ errors: errors });
};
exports.errorHandler = errorHandler;
