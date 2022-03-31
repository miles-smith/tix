import { Publisher, Subjects, OrderCreatedEvent } from '@elevenhotdogs-tix/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
