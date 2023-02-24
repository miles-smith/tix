
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@elevenhotdogs-tix/common';
import { OrderCreatedListener } from '../order-created-listener';
import { Ticket, TicketDocument } from '../../../models/ticket';
import { natsClient } from '../../../nats-client';

describe('OrderCreatedListener', () => {
  let listener: OrderCreatedListener;
  let data: OrderCreatedEvent['data'];
  let message: Message;
  let ticket: TicketDocument;

  beforeEach(async () => {
    ticket = Ticket.build({
      userId: new mongoose.Types.ObjectId().toHexString(),
      title: 'Test Ticket',
      price: '5.00',
    });

    await ticket.save();

    listener = new OrderCreatedListener(natsClient.stan);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    data = {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      status: OrderStatus.Created,
      userId: new mongoose.Types.ObjectId().toHexString(),
      expiresAt: expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: JSON.stringify(ticket.price),
      }
    };

    // @ts-ignore
    message = {
      ack: jest.fn() 
    }
  });

  it('sets the `orderId` of the `ticket`', async () => {
    await listener.onMessage(data, message);

    const reservedTicket = await Ticket.findById(data.ticket.id);

    expect(reservedTicket).toBeDefined();
    expect(reservedTicket).toHaveProperty('orderId', data.id);
  });

  it('acknowledges the `message`', async () => {
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
