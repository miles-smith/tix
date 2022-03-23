import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { natsClient } from '../../../nats-client';
import { Ticket } from '../../../models/ticket';
import { Order, OrderStatus } from '../../../models/order';

const createTicket = async () => {
  const ticket = Ticket.build({
    title: 'Test Ticket',
    price: '1.00'
  });

  await ticket.save();
  return ticket;
};

describe('authenticated users', () => {
  const user   = global.generateTestUser();
  const cookie = global.signIn(user);

  describe('with valid inputs', () => {
    it('creates a new order', async () => {
      const ticket = await createTicket();

      const response =
        await request(app)
          .post('/api/orders')
          .set('Cookie', cookie)
          .send({ ticketId: ticket.id });

      expect(response.statusCode)
        .toEqual(201);

      expect(await Order.countDocuments())
        .toEqual(1);
    });

    it('returns an error if ticket is reserved', async () => {
      const ticket = await createTicket();
      const order  = Order.build({
        ticket,
        userId: new mongoose.Types.ObjectId().toString(),
        status: OrderStatus.Created,
        expiresAt: new Date(),
      });

      await order.save();

      const response =
        await request(app)
          .post('/api/orders')
          .set('Cookie', cookie)
          .send({ ticketId: ticket.id });

      expect(response.statusCode)
        .toEqual(400);

      expect(await Order.countDocuments())
        .toEqual(1);
    });

    it('publishes an event', async () => {
      const ticket = await createTicket();

      await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: ticket.id });

      expect(natsClient.stan.publish).toHaveBeenCalled();
    });
  });

  describe('with invalid inputs', () => {
    const ticketId = new mongoose.Types.ObjectId();

    it('returns an error if ticket cannot be found', async () => {
      const response =
        await request(app)
          .post('/api/orders')
          .set('Cookie', cookie)
          .send({ ticketId });

      expect(response.statusCode)
        .toEqual(404);
    });

    it('does not publish an event', async () => {
      const ticketId = new mongoose.Types.ObjectId();

      await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId });

      expect(natsClient.stan.publish).not.toHaveBeenCalled();
    });
  });
});

describe('unauthenticated users', () => {
  it('prevents unauthorized access', async () => {
    const ticket = await createTicket();

    const response =
      await request(app)
        .post('/api/orders')
        .send({ ticketId: ticket.id });

    expect(response.statusCode)
      .toEqual(401);

    expect(await Order.countDocuments())
      .toEqual(0);
  });
});
