import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('returns the ticket', async () => {
  const ticket = Ticket.build({
    userId: '62064650b18cd064285bc555',
    title:  'Test Ticket',
    price:  '100.00'
  });

  await ticket.save();

  const response =
    await request(app)
      .get(`/api/tickets/${ticket.id}`);

  expect(response.statusCode)
    .toBe(200);

  expect(response.body)
    .toHaveProperty('title', 'Test Ticket');

    expect(response.body)
      .toHaveProperty('price', '100.00');
});

it('returns a 404 if not found', async () => {
  const objectId = new mongoose.Types.ObjectId();

  await request(app)
    .get(`/api/tickets/${objectId.toHexString()}`)
    .expect(404);
});
