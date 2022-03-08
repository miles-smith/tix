// TODO: It would be nice if we could break this up and have some kind of composite enum
// that in essence merges smaller enum components (like how we've organised Express routes).
export enum Subjects {
  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',
}
