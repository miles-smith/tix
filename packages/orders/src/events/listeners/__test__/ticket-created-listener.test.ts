import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@elevenhotdogs-tix/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { Ticket } from '../../../models/ticket';
import { natsClient } from '../../../nats-client';

describe('TicketCreatedListener', () => {
  let listener: TicketCreatedListener;
  let data: TicketCreatedEvent['data'];
  let message: Message;

  beforeEach(() => {
    listener = new TicketCreatedListener(natsClient.stan);

    data = {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      title: 'Test Ticket',
      price: '1.00',
      userId: new mongoose.Types.ObjectId().toHexString(),
    };

    // @ts-ignore
    message = {
      ack: jest.fn() 
    }
  });

  it('creates a new `ticket`', async () => {
    await listener.onMessage(data, message);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket).toHaveProperty('title', data.title);
    expect(ticket).toHaveProperty('price', mongoose.Types.Decimal128.fromString(data.price));
    expect(ticket).toHaveProperty('version', data.version);
  });

  it('acknowledges the `message`', async () => {
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
