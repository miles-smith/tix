import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { TestUser } from '../../../../test/setup';
import { Ticket, TicketDocument } from '../../../models/ticket';
import { Order, OrderStatus } from '../../../models/order';

const createTicket = async (title: string) => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
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
    status: OrderStatus.Complete,
    expiresAt: new Date()
  });

  await order.save();
  return order;
}

describe('as an authenticated user', () => {
  const userOne = global.generateTestUser();
  const userTwo = global.generateTestUser();

  const cookie  = global.signIn(userOne);

  it('returns the order', async () => {
    const ticket = await createTicket('Test Ticket');
    const order  = await createOrder(ticket, userOne);

    const response =
      await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', cookie);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({ id: order.id })
    );
  });

  it('returns an error if the order is not found', async () => {
    const id = new mongoose.Types.ObjectId();

    const response =
      await request(app)
        .get(`/api/orders/${id}`)
        .set('Cookie', cookie);

    expect(response.statusCode).toBe(404);
  });

  it('prevents unauthorized access', async () => {
    const ticket = await createTicket('Test Ticket');
    const order  = await createOrder(ticket, userTwo);

    const response =
      await request(app)
        .get(`/api/orders/${order.id}`)
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
        .get(`/api/orders/${order.id}`);

    expect(response.statusCode)
      .toEqual(401);
  });
});
