import { Publisher, ExpirationCompleteEvent, Subjects } from "@elevenhotdogs-tix/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
