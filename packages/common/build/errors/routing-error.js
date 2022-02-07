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
exports.RoutingError = void 0;
var base_error_1 = require("./base-error");
var RoutingError = /** @class */ (function (_super) {
    __extends(RoutingError, _super);
    function RoutingError(message) {
        if (message === void 0) { message = 'Route not found'; }
        var _this = _super.call(this, message) || this;
        _this.httpStatus = 404;
        Object.setPrototypeOf(_this, RoutingError.prototype);
        return _this;
    }
    RoutingError.prototype.serialize = function () {
        return [{ message: 'Not Found' }];
    };
    return RoutingError;
}(base_error_1.BaseError));
exports.RoutingError = RoutingError;
