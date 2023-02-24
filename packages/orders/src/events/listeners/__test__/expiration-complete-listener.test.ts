
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent, OrderStatus, Subjects } from '@elevenhotdogs-tix/common';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Ticket, TicketDocument } from '../../../models/ticket';
import { Order, OrderDocument } from '../../../models/order';
import { natsClient } from '../../../nats-client';

describe('ExpirationCompleteListener', () => {
  let listener: ExpirationCompleteListener;
  let data: ExpirationCompleteEvent['data'];
  let message: Message;
  let ticket: TicketDocument;
  let order: OrderDocument;
  

  beforeEach(async () => {
    listener = new ExpirationCompleteListener(natsClient.stan);

    ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'Test Ticket',
      price: '10.00',
    });

    await ticket.save();

    order = Order.build({
      ticket: ticket,
      userId: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      expiresAt: new Date(),
    });

    await order.save();

    data = {
      orderId: order.id
    };

    // @ts-ignore
    message = {
      ack: jest.fn() 
    }
  });

  it('sets the `order` status', async () => {
    await listener.onMessage(data, message);

    const cancelledOrder = await Order.findById(data.orderId);

    expect(cancelledOrder).toBeDefined();
    expect(cancelledOrder).toHaveProperty('status', OrderStatus.Cancelled);
  });

  it('publishes an `OrderCancelled` event', async () => {
    await listener.onMessage(data, message);

    expect(natsClient.stan.publish).toHaveBeenCalledWith(
      Subjects.OrderCancelled,
      expect.anything(),
      expect.anything(),
    );
  });

  it('acknowledges the `message`', async () => {
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
