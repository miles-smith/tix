import { Publisher, Subjects, PaymentCreatedEvent } from "@elevenhotdogs-tix/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
