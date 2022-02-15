import request from 'supertest';
import { app } from '../../app';
import { Ticket, TicketAttributes } from '../../models/ticket';

const createTicket = async (attributes: TicketAttributes) => {
  const ticket = Ticket.build(attributes);

  await ticket.save();
  return ticket;
}

it('should fetch a list of tickets', async () => {
  const ticketOne = await createTicket({
    userId: '62064650b18cd064285bc555',
    title:  'Test Ticket 1',
    price:  '10.00'
  });

  const ticketTwo = await createTicket({
    userId: '62064650b18cd064285bc555',
    title:  'Test Ticket 2',
    price:  '20.00'
  });

  const response =
    await request(app)
      .get('/api/tickets');

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveLength(2);
  expect(response.body).toContainEqual(ticketOne.toJSON());
  expect(response.body).toContainEqual(ticketTwo.toJSON());
});
