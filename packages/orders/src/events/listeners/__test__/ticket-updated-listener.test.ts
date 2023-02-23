import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@elevenhotdogs-tix/common';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { Ticket, TicketDocument } from '../../../models/ticket';
import { natsClient } from '../../../nats-client';

describe('TicketUpdatedListener', () => {
  let listener: TicketUpdatedListener;
  let data: TicketUpdatedEvent['data'];
  let message: Message;
  let ticket: TicketDocument;

  beforeEach(async () => {
    ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'Test Ticket',
      price: '5.00',
    });

    await ticket.save();

    listener = new TicketUpdatedListener(natsClient.stan);

    // @ts-ignore
    message = {
      ack: jest.fn() 
    }
  });

  describe('with an in-sequence message', () => {
    beforeEach(() => {
      data = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'Test Ticket (reduced)',
        price: '3.00',
        userId: new mongoose.Types.ObjectId().toHexString(),
      }; 
    });

    it('updates a `ticket`', async () => {
      await listener.onMessage(data, message);

      const updatedTicket = await Ticket.findById(data.id);

      expect(updatedTicket).toBeDefined();
      expect(updatedTicket).toHaveProperty('title', data.title);
      expect(updatedTicket).toHaveProperty('price', mongoose.Types.Decimal128.fromString(data.price));
      expect(updatedTicket).toHaveProperty('version', data.version);
    });

    it('acknowledges the `message`', async () => {
      await listener.onMessage(data, message);

      expect(message.ack).toHaveBeenCalled();
    });
  });

  describe('with an out-of-sequence message', () => {
    beforeEach(() => {
      data = {
        id: ticket.id,
        version: ticket.version + 2,
        title: 'Test Ticket (reduced)',
        price: '1.00',
        userId: new mongoose.Types.ObjectId().toHexString(),
      };
    });

    it('does not update a `ticket`', async () => {
      try {
        await listener.onMessage(data, message);
      } catch (e) {

      }

      const updatedTicket = await Ticket.findById(data.id);

      expect(updatedTicket).toBeDefined();

      expect(updatedTicket).not.toHaveProperty('title', data.title);
      expect(updatedTicket).not.toHaveProperty('price', mongoose.Types.Decimal128.fromString(data.price));
      expect(updatedTicket).not.toHaveProperty('version', data.version);
      
      expect(updatedTicket).toHaveProperty('title', ticket.title);
      expect(updatedTicket).toHaveProperty('price', ticket.price);
      expect(updatedTicket).toHaveProperty('version', ticket.version);
    });

    it('does not acknowledge the `message`', async () => {
      try {
        await listener.onMessage(data, message);
      } catch (e) {

      }

      expect(message.ack).not.toHaveBeenCalled();
    });
  });
 });
