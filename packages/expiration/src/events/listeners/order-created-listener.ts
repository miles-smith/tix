import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@elevenhotdogs-tix/common";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], message: Message) {
    await expirationQueue.add({
      orderId: data.id
    });

    message.ack();
  }
}
