import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket, TicketAttributes } from '../../models/ticket';
import { natsClient } from '../../nats-client';

const createTicket = async (attributes: TicketAttributes) => {
  const ticket = Ticket.build(attributes);

  await ticket.save();
  return ticket;
}

describe('as an authenticated user', () => {
  const cookie = global.signIn();

  it('returns a 404 error if not found', async () => {
    const objectId = new mongoose.Types.ObjectId();
    const payload = {
      userId: '62064650b18cd064285bc555', // TODO: Magic strings; Clean this up.
      title:  'Test Ticket',
      price:  '1.00'
    }

    await request(app)
      .put(`/api/tickets/${objectId.toHexString()}`)
      .set('Cookie', cookie)
      .send(payload)
      .expect(404);
  });

  describe('as the ticket owner', () => {
    describe('with valid inputs', () => {
      describe('unreserved ticket', () => {
        it('should update the resource', async () => {
          const ticket = await createTicket({
            userId: '62064650b18cd064285bc555', // TODO: Magic strings; Clean this up.
            title:  'Test Ticket',
            price:  '1.00'
          });

          const payload = {
            userId: ticket.get('userId'),
            title: 'Tested Ticket',
            price: '2.00'
          }

          const response =
            await request(app)
              .put(`/api/tickets/${ticket.id}`)
              .set('Cookie', cookie)
              .send(payload);

          const updatedTicket = await Ticket.findById(ticket.id);

          expect(response.statusCode).toBe(200);
          expect(response.body).toHaveProperty('title', payload.title);
          expect(response.body).toHaveProperty('price', payload.price);

          expect(updatedTicket!.get('title')).toBe(payload.title);
          expect(updatedTicket!.get('price').toString()).toBe(payload.price);
        });

        it('publishes an event', async () => {
          const ticket = await createTicket({
            userId: '62064650b18cd064285bc555', // TODO: Magic strings; Clean this up.
            title:  'Test Ticket',
            price:  '1.00'
          });

          const payload = {
            userId: ticket.get('userId'),
            title: 'Tested Ticket',
            price: '2.00'
          }

          await request(app)
            .post('/api/tickets')
            .set('Cookie', cookie)
            .send(payload);

          expect(natsClient.stan.publish).toHaveBeenCalled();
        });
      });

      describe('reserved ticket', () => {
        it('does not update the resource', async () => {
          const ticket = await createTicket({
            userId: '62064650b18cd064285bc555', // TODO: Magic strings; Clean this up.
            title:  'Test Ticket',
            price:  '1.00',
          });

          ticket.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
          await ticket.save();

          const payload = {
            userId: ticket.get('userId'),
            title: 'Tested Ticket',
            price: '2.00'
          }

          const response =
            await request(app)
              .put(`/api/tickets/${ticket.id}`)
              .set('Cookie', cookie)
              .send(payload);

          const updatedTicket = await Ticket.findById(ticket.id);

          expect(response.statusCode).toBe(400);
          expect(response.body).toHaveProperty('errors');

          expect(updatedTicket!.get('title')).not.toBe(payload.title);
          expect(updatedTicket!.get('price').toString()).not.toBe(payload.price);
        });

        it('does not publish an event', async () => {
          const ticket = await createTicket({
            userId: '62064650b18cd064285bc555', // TODO: Magic strings; Clean this up.
            title:  'Test Ticket',
            price:  '1.00'
          });

          ticket.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
          await ticket.save();

          const payload = {
            userId: ticket.get('userId'),
            title: 'Tested Ticket',
            price: '2.00'
          }

          await request(app)
            .put(`/api/tickets/${ticket.id}`)
            .set('Cookie', cookie)
            .send(payload);

          expect(natsClient.stan.publish).not.toHaveBeenCalled();
        });
      });
    });

    describe('with invalid inputs', () => {
      it('should not allow owner reassignment', async () => {
        const ticket = await createTicket({
          userId: '62064650b18cd064285bc555', // TODO: Magic strings; Clean this up.
          title:  'Test Ticket',
          price:  '1.00'
        });

        const payload = {
          userId: '71064650b18cd064285bc523',
          title:  ticket.get('title'),
          price:  ticket.get('price', String)
        }

        const response =
          await request(app)
            .put(`/api/tickets/${ticket.id}`)
            .set('Cookie', cookie)
            .send(payload);

        const updatedTicket = await Ticket.findById(ticket.id);

        expect(response.statusCode).toBe(200);
        expect(response.body).not.toHaveProperty('userId', payload.userId);

        expect(updatedTicket!.get('userId')).not.toBe(payload.title);
      });

      it('should not update', async () => {
        const ticket = await createTicket({
          userId: '62064650b18cd064285bc555', // TODO: Magic strings; Clean this up.
          title:  'Test Ticket',
          price:  '1.00'
        });

        const payload = {
          userId: ticket.get('userId'),
          title:  '',
          price:  '-1.00'
        }

        const response =
          await request(app)
            .put(`/api/tickets/${ticket.id}`)
            .set('Cookie', cookie)
            .send(payload);

        const updatedTicket = await Ticket.findById(ticket.id);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors');

        expect(updatedTicket!.get('title')).not.toBe(payload.title);
        expect(updatedTicket!.get('price').toString()).not.toBe(payload.price);
      });

      it('does not publish an event', async () => {
        const ticket = await createTicket({
          userId: '62064650b18cd064285bc555', // TODO: Magic strings; Clean this up.
          title:  'Test Ticket',
          price:  '1.00'
        });

        const payload = {
          userId: ticket.get('userId'),
          title: '',
          price: '-1.00'
        }

        await request(app)
          .post('/api/tickets')
          .set('Cookie', cookie)
          .send(payload);

        expect(natsClient.stan.publish).not.toHaveBeenCalled();
      });
    });
  });

  describe('as a user that is not the ticket owner', () => {
    it('returns a 401 error', async () => {
      const ticket = await createTicket({
        userId: '71064650b18cd064285bc523', // TODO: Magic strings; Clean this up.
        title:  'Test Ticket',
        price:  '1.00'
      });

      const payload = {
        userId: ticket.get('userId'),
        title:  'Tested Ticket',
        price:  '2.00'
      }

      const response =
        await request(app)
          .put(`/api/tickets/${ticket.id}`)
          .set('Cookie', cookie)
          .send(payload);

      const updatedTicket = await Ticket.findById(ticket.id);

      expect(response.statusCode).toBe(401);
      expect(response.body).not.toHaveProperty('title', payload.title);
      expect(response.body).not.toHaveProperty('price', payload.price);

      expect(updatedTicket!.get('title')).not.toBe(payload.title);
      expect(updatedTicket!.get('price').toString()).not.toBe(payload.price);
    });
  });
});

describe('as an unauthenticated user', () => {
  it('returns a 401 error', async () => {
    const ticket = await createTicket({
      userId: '62064650b18cd064285bc555', // TODO: Magic strings; Clean this up.
      title:  'Test Ticket',
      price:  '1.00'
    });

    const payload = {
      userId: ticket.get('userId'),
      title:  'Tested Ticket',
      price:  '2.00'
    }

    const response =
      await request(app)
        .put(`/api/tickets/${ticket.id}`)
        .send(payload);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(response.statusCode).toBe(401);
    expect(response.body).not.toHaveProperty('title', payload.title);
    expect(response.body).not.toHaveProperty('price', payload.price);

    expect(updatedTicket!.get('title')).not.toBe(payload.title);
    expect(updatedTicket!.get('price').toString()).not.toBe(payload.price);
  });
});
