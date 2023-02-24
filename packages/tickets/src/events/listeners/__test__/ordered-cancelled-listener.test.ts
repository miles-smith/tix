import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, Subjects } from '@elevenhotdogs-tix/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Ticket, TicketDocument } from '../../../models/ticket';
import { natsClient } from '../../../nats-client';

describe('OrderCancelledListener', () => {
  let listener: OrderCancelledListener;
  let data: OrderCancelledEvent['data'];
  let message: Message;
  let ticket: TicketDocument;

  beforeEach(async () => {
    ticket = Ticket.build({
      userId: new mongoose.Types.ObjectId().toHexString(),
      title: 'Test Ticket',
      price: '5.00',
    });

    const orderId = new mongoose.Types.ObjectId().toHexString();
    ticket.set({ orderId });
    
    await ticket.save();

    listener = new OrderCancelledListener(natsClient.stan);

    data = {
      id: orderId,
      version: 1,
      ticket: {
        id: ticket.id,
      }
    };

    // @ts-ignore
    message = {
      ack: jest.fn() 
    }
  });

  it('unsets the `orderId` of the `ticket`', async () => {
    await listener.onMessage(data, message);

    const cancelledOrderTicket = await Ticket.findById(data.ticket.id);

    expect(cancelledOrderTicket).toBeDefined();
    expect(cancelledOrderTicket!.orderId).not.toBeDefined();
  });

  it('acknowledges the `message`', async () => {
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });

  it('emits a `TicketUpdated` event', async () => {
    await listener.onMessage(data, message);

    expect(natsClient.stan.publish).toHaveBeenCalledWith(
      Subjects.TicketUpdated,
      expect.anything(),
      expect.anything(),
    );
  });
});
