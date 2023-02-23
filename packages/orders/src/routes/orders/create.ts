import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { authenticate, validateRequest } from '@elevenhotdogs-tix/common';
import { RoutingError, BadRequestError } from '@elevenhotdogs-tix/common';
import { Ticket, TicketDocument } from '../../models/ticket';
import { Order, OrderDocument, OrderStatus } from '../../models/order';
import { natsClient } from '../../nats-client';
import { OrderCreatedPublisher } from '../../events/publishers/order-created-publisher';

const router = express.Router();

// TODO: Refactor out configuration details.
const RESERVATION_PERIOD_SECONDS = 15 * 60; // 15 minutes.

// TODO: Expecting a MongoDB document ID does introduce some slight/subtle coupling between
// services. Might want to have a think about that, even if it's not going to be a big issue
// in this toy project.
const ticketValidator =
  body('ticketId')
    .not()
    .isEmpty()
    .custom((ticketId: string) => mongoose.Types.ObjectId.isValid(ticketId))
    .withMessage('Ticket ID is invalid')

const validate = [
  ticketValidator,
  validateRequest
];

const publishOrderCreatedEvent = (order: OrderDocument, ticket: TicketDocument) => {
  new OrderCreatedPublisher(natsClient.stan)
    .publish({
      id: order.id,
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(), // Careful around timezones! Provide everything in UTC.
      ticket: {
        id: ticket.id,
        version: ticket.version,
        price: ticket.price.toString()
      }
    });
}

router.post('/', authenticate, validate, async (req: Request, res: Response) => {
  const { ticketId } = req.body;
  const ticket = await Ticket.findById(ticketId);

  if(!ticket) {
    // Not the best fit, given ticket id is arriving via params, and not a nested RESTful route,
    // but meh (and we might change the routing in the future).
    throw new RoutingError();
  }

  if(await ticket.isReserved()) {
    throw new BadRequestError('Ticket is already reserved');
  }

  const order = Order.build({
    ticket:    ticket,
    userId:    req.currentUser!.id,
    status:    OrderStatus.Created,
    expiresAt: new Date(Date.now() + RESERVATION_PERIOD_SECONDS * 1000)
  });

  await order.save();
  publishOrderCreatedEvent(order, ticket);

  res
    .status(201)
    .send(order);
});

export { router as createOrderRouter };
