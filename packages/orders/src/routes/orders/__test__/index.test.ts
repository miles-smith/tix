import mongoose from 'mongoose';
import request from 'supertest';
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

  it('returns the current users tickets', async () => {
    const ticketOne   = await createTicket('Test Ticket #1');
    const ticketTwo   = await createTicket('Test Ticket #2');
    const ticketThree = await createTicket('Test Ticket #3');
    const orderOne    = await createOrder(ticketOne, userOne);
    const orderTwo    = await createOrder(ticketTwo, userOne);
    const orderThree  = await createOrder(ticketThree, userTwo);

    const response =
      await request(app)
        .get('/api/orders')
        .set('Cookie', cookie);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: orderOne.id }),
        expect.objectContaining({ id: orderTwo.id })
      ])
    );
  });
});

describe('as an unauthenticated user', () => {
  it('prevents unauthorized access', async () => {
    const response =
      await request(app)
        .get('/api/orders');

    expect(response.statusCode)
      .toEqual(401);
  });
});
