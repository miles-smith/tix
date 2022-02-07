"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
var base_error_1 = require("./base-error");
var RequestValidationError = /** @class */ (function (_super) {
    __extends(RequestValidationError, _super);
    function RequestValidationError(errors) {
        var _this = _super.call(this, 'Validation failure') || this;
        _this.errors = errors;
        _this.httpStatus = 400;
        Object.setPrototypeOf(_this, RequestValidationError.prototype);
        return _this;
    }
    RequestValidationError.prototype.serialize = function () {
        return this.errors.map(function (error) {
            return { message: error.msg, field: error.param };
        });
    };
    return RequestValidationError;
}(base_error_1.BaseError));
exports.RequestValidationError = RequestValidationError;
