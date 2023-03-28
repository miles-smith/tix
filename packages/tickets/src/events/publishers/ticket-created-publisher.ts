import { Publisher, Subjects, TicketCreatedEvent } from '@elevenhotdogs-tix/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
