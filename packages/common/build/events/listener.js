"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
var Listener = /** @class */ (function () {
    function Listener(client) {
        this.ackWait = 5 * 1000; // 5 seconds
        this.client = client;
    }
    Listener.prototype.subscriptionOptions = function () {
        return this.client.subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    };
    Listener.prototype.listen = function () {
        var _this = this;
        var subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
        subscription.on('message', function (message) {
            console.log("[".concat(_this.queueGroupName, "] Message received: ").concat(_this.subject));
            var data = _this.parseMessage(message);
            _this.onMessage(data, message);
        });
    };
    Listener.prototype.parseMessage = function (message) {
        var data = message.getData();
        return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'));
    };
    return Listener;
}());
exports.Listener = Listener;
