export enum OrderStatus {
  // When the order has been created, but the ticket has not been reserved.
  Created = 'created',

  // NOTE: It could be beneficial to treat these as distinct statuses rather then a catch-all.
  // When the ticket trying to be ordered:
  // * has already been reserved, or
  // * when a user cancels the order, or
  // * when the order expires before payment
  Cancelled = 'cancelled',

  // Order has successfully reserved the ticket, but not yet completed the transaction.
  AwaitingPayment = 'awaiting:payment',

  // The order has been reserved and paid for.
  Complete = 'complete',
}
