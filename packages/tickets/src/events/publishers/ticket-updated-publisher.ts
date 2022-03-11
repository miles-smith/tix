import { Publisher, Subjects, TicketUpdatedEvent } from '@elevenhotdogs-tix/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
