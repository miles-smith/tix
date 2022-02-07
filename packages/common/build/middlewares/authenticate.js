"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
var not_authorized_error_1 = require("../errors/not-authorized-error");
// NOTE: Expects to be placed after `currentUser` in the middleware statck!
var authenticate = function (req, res, next) {
    if (!req.currentUser) {
        throw new not_authorized_error_1.NotAuthorizedError();
    }
    next();
};
exports.authenticate = authenticate;
