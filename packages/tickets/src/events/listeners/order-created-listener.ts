import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@elevenhotdogs-tix/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from '../../models/ticket';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], message: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if(!ticket) {
      throw new Error('Ticket not found');
    }
    
    ticket.set({ orderId: data.id });

    // FIXME: We now need to emit a `TicketUpdated` event! If we don't then we're likely
    // to run into deadlocking scenarios where ticket versions are out-of-sync across
    // services and waiting for events/versions that will never arrive...
    await ticket.save();

    message.ack();
  }
}
