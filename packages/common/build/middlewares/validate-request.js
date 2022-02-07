"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
var express_validator_1 = require("express-validator");
var request_validation_error_1 = require("../errors/request-validation-error");
var validateRequest = function (req, res, next) {
    var validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        throw new request_validation_error_1.RequestValidationError(validationErrors.array());
    }
    next();
};
exports.validateRequest = validateRequest;
