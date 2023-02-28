
import request from 'supertest';
import mongoose from 'mongoose';
import { stripe } from '../../../stripe';
import { app } from '../../../app';
import { Order, OrderDocument, OrderStatus } from '../../../models/order';
import { Payment } from '../../../models/payment';

const createOrder = async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: '10.00'
  });

  await order.save();
  return order;
};

describe('authenticated users', () => {
  const user   = global.generateTestUser();
  const cookie = global.signIn(user);

  describe('existing order', () => {
    let order: OrderDocument;
    let token: string;
     
    beforeEach(async () => {
      token = '3ff3a6ca49b98863650694ebe9a1351e013651a17909e6755e495d3caa3d867a';
      order = await createOrder();
    });

    describe('in a purchasable state', () => {
      describe('user is the order owner', () => {
        beforeEach(async () => {
          order.set({ userId: user.id });
          await order.save();
        });

        describe('invalid inputs', () => {
          describe('missing token', () => {
            it('returns a 400 error', async () => {
              const response = 
                await request(app)
                  .post('/api/payments')
                  .set('Cookie', cookie)
                 .send({ orderid: order.id });

              expect(response.statusCode).toEqual(400);
            });
          });

          describe('missing orderId', () => {
            it('returns a 400 error', async () => {
              const response = 
                await request(app)
                  .post('/api/payments')
                  .set('Cookie', cookie)
                  .send({ token });

              expect(response.statusCode).toEqual(400);
            });
          });
        });

        describe('valid inputs', () => {
          const token = 'tok_visa';

          it('returns a 201 response', async () => {
            const response =
              await request(app)
                .post('/api/payments')
                .set('Cookie', cookie)
                .send({
                  orderId: order.id,
                  token
                });

            expect(response.statusCode).toEqual(201);
          });

          it('triggers a Stripe charge', async () => {
            await request(app)
              .post('/api/payments')
              .set('Cookie', cookie)
              .send({
                orderId: order.id,
                token
              });

            expect(stripe.charges.create).toHaveBeenCalledWith(
              expect.objectContaining({
                amount: 1000,
                currency: 'gbp',
                source: token
              })
            );
          });

          it('creates a `payment`', async () => {
            await request(app)
              .post('/api/payments')
              .set('Cookie', cookie)
              .send({
                orderId: order.id,
                token
              });

            const payment = await Payment.findOne({ orderId: order.id });

            expect(payment).not.toBeNull();
            expect(payment!.chargeId).not.toBeNull();
            expect(payment!.chargeId).toBeDefined();
          });
        });
      });

      describe('user is not the order owner', () => {
        it('returns a 401 error', async () => {
          const response =
            await request(app)
              .post('/api/payments')
              .set('Cookie', cookie)
              .send({
                orderId: order.id,
                token
              });

          expect(response.statusCode).toEqual(401);
        });
      });
    });

    describe('not in a purchasable state', () => {
      beforeEach(async () => {
        order.set({ status: OrderStatus.Cancelled });
        await order.save();
      });
      
      describe('user is the order owner', () => {
        beforeEach(async () => {
          order.set({ userId: user.id });
          await order.save();
        });

        it('returns a 400 error', async () => {
          const response =
            await request(app)
              .post('/api/payments')
              .set('Cookie', cookie)
              .send({
                orderId: order.id,
                token
              });

          expect(response.statusCode).toEqual(400);
        });
      });
    });
  });

  describe('non-existent order', () => {
    describe('unknown orderId parameter', () => {
      it('returns a 404 error', async () => {
        const response = 
          await request(app)
            .post('/api/payments')
            .set('Cookie', cookie)
            .send({
              orderId: new mongoose.Types.ObjectId().toHexString(),
              token:  '8a0eddcbe4f358d3121d3f38610f83d612fd02ddb6e57745d3c65a94cde02c9c',
            });

        expect(response.statusCode).toEqual(404); 
      });
    });
  });
});

describe('unauthenticated users', () => {
  it('prevents unauthorized access', async () => {
    const order = await createOrder();

    const response =
      await request(app)
        .post('/api/payments')
        .send({ 
          token: '3ff3a6ca49b98863650694ebe9a1351e013651a17909e6755e495d3caa3d867a',
          ordertId: order.id
      });

    expect(response.statusCode).toEqual(401);
  });
});
