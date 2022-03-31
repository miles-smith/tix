import { Publisher, Subjects, OrderCancelledEvent } from '@elevenhotdogs-tix/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
