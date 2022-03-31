import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { natsClient } from '../../../nats-client';
import { TestUser } from '../../../../test/setup';
import { Ticket, TicketDocument } from '../../../models/ticket';
import { Order, OrderStatus } from '../../../models/order';

const createTicket = async (title: string) => {
  const ticket = Ticket.build({
    title: title,
    price: '1.00'
  });

  await ticket.save();
  return ticket;
};

const createOrder = async (ticket: TicketDocument, user: TestUser) => {
  const order = Order.build({
    ticket: ticket,
    userId: user.id,
    status: OrderStatus.Created,
    expiresAt: new Date()
  });

  await order.save();
  return order;
}

describe('as an authenticated user', () => {
  const user   = global.generateTestUser();
  const cookie = global.signIn(user);

  it('cancels the order', async () => {
    const ticket = await createTicket('Test Ticket');
    const order  = await createOrder(ticket, user);
    const count  = await Order.countDocuments({ status: OrderStatus.Cancelled });

    const response =
      await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', cookie);

    expect(await Order.countDocuments({ status: OrderStatus.Cancelled })).toEqual(count + 1);
    expect(response.statusCode).toEqual(204);
  });

  it('it cannot cancel an already completed order', async () => {
    const ticket = await createTicket('Test Ticket');
    const order  = await createOrder(ticket, user);

    await order.update({ status: OrderStatus.Complete });

    const count  = await Order.countDocuments({ status: OrderStatus.Cancelled });

    const response =
      await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', cookie);

    expect(response.statusCode).toBe(400);
    expect(await Order.countDocuments({ status: OrderStatus.Cancelled })).toEqual(count);
  });

  it('it dispatches an event on cancellation', async () => {
    const ticket = await createTicket('Test Ticket');
    const order  = await createOrder(ticket, user);

    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', cookie);

    expect(natsClient.stan.publish).toHaveBeenCalled();
  });

  it('returns an error if the order is not found', async () => {
    const id = new mongoose.Types.ObjectId();

    const response =
      await request(app)
        .delete(`/api/orders/${id}`)
        .set('Cookie', cookie);

    expect(response.statusCode).toBe(404);
  });

  it('prevents unauthorized access', async () => {
    const ticket = await createTicket('Test Ticket');
    const order  = await createOrder(ticket, global.generateTestUser());

    const response =
      await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', cookie);

    expect(response.statusCode).toEqual(401);
    expect(response.body).not.toEqual(
      expect.objectContaining({ id: order.id })
    );
  });
});

describe('as an unauthenticated user', () => {
  it('prevents unauthorized access', async () => {
    const ticket = await createTicket('Test Ticket');
    const order  = await createOrder(ticket, global.generateTestUser());

    const response =
      await request(app)
        .delete(`/api/orders/${order.id}`);

    expect(response.statusCode)
      .toEqual(401);
  });
});
