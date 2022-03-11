import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsClient } from '../../nats-client';

describe('authenticated users', () => {
  const cookie = global.signIn();

  describe('with valid inputs', () => {
    it('creates a new ticket resource', async () => {
      expect(await Ticket.countDocuments())
        .toEqual(0);

      const response =
        await request(app)
          .post('/api/tickets')
          .set('Cookie', cookie)
          .send({
            title: 'Test',
            price: 100.00
          });

      expect(response.statusCode)
        .toEqual(201);

      expect(response.body).toHaveProperty('title', 'Test');
      expect(response.body).toHaveProperty('price', '100');

      expect(await Ticket.countDocuments())
        .toEqual(1);
    });

    it('publishes an event', async () => {
      await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
          title: 'Test',
          price: 100.00
        });

      expect(natsClient.stan.publish).toHaveBeenCalled();
    });
  });

  describe('with invalid inputs', () => {
    it('returns an error on missing title', async () => {
      const response =
        await request(app)
          .post('/api/tickets')
          .set('Cookie', cookie)
          .send({
            price: 100.00
          });

      expect(response.statusCode)
        .toEqual(400);

      expect(response.body)
        .toHaveProperty('errors');

      expect(response.body.errors)
        .toContainEqual({ message: 'Title is required', field: 'title' });
    });

    it('returns an error on blank title', async () => {
      const response =
        await request(app)
          .post('/api/tickets')
          .set('Cookie', cookie)
          .send({
            title: '',
            price: 100.00
          });

      expect(response.statusCode)
        .toEqual(400);

      expect(response.body)
        .toHaveProperty('errors');

      expect(response.body.errors)
        .toContainEqual({ message: 'Title is required', field: 'title' });
    });

    it('returns an error on missing price', async () => {
      const response =
        await request(app)
          .post('/api/tickets')
          .set('Cookie', cookie)
          .send({
            title: 'Test'
          });

      expect(response.statusCode)
        .toEqual(400);

      expect(response.body)
        .toHaveProperty('errors');

      expect(response.body.errors)
        .toContainEqual({ message: 'Price must be greater than 0', field: 'price' });
    });

    it('returns an error on invalid price', async () => {
      const response =
        await request(app)
          .post('/api/tickets')
          .set('Cookie', cookie)
          .send({
            title: 'Test',
            price: -1
          });

      expect(response.statusCode)
        .toEqual(400);

      expect(response.body)
        .toHaveProperty('errors');

      expect(response.body.errors)
        .toContainEqual({ message: 'Price must be greater than 0', field: 'price' });
    });

    it('does not publish an event', async () => {
      await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({});

      expect(natsClient.stan.publish).not.toHaveBeenCalled();
    });
  });
});

describe('unauthenticated users', () => {
  it('prevents unauthorized access', async () => {
    const response =
      await request(app)
        .post('/api/tickets')
        .send({
          title: 'Test',
          price: 100.00
        });

    expect(response.statusCode)
      .toEqual(401);
  });
});
