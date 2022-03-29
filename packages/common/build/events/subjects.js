"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subjects = void 0;
// TODO: It would be nice if we could break this up and have some kind of composite enum
// that in essence merges smaller enum components (like how we've organised Express routes).
var Subjects;
(function (Subjects) {
    Subjects["TicketCreated"] = "ticket:created";
    Subjects["TicketUpdated"] = "ticket:updated";
    Subjects["OrderCreated"] = "order:created";
    Subjects["OrderCancelled"] = "order:cancelled";
})(Subjects = exports.Subjects || (exports.Subjects = {}));
