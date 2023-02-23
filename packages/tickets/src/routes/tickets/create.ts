import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { authenticate, validateRequest } from '@elevenhotdogs-tix/common';
import { Ticket } from '../../models/ticket';
import { TicketCreatedPublisher } from '../../events/publishers/ticket-created-publisher';
import { natsClient} from '../../nats-client';

const router = express.Router();

const titleValidator =
  body('title')
    .notEmpty()
    .withMessage('Title is required');

const priceValidator =
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0');

const validate = [
  titleValidator,
  priceValidator,
  validateRequest
];

router.post('/', authenticate, validate, async (req: Request, res: Response) => {
  const { title, price } = req.body;
  const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });

  await ticket.save();

  // TODO: There is a potential point of failure here; the resource could save but the event
  // fail to publish (e.g. perhaps the NATS connection is temporarily lost). This could lead to a
  // data integrity issue. One possible solution is to use a db transaction to save both the
  // resource, and the event (to a local collection), and use an out of band process (i.e. a
  // resilient job queue/worker) to handle event publication.
  new TicketCreatedPublisher(natsClient.stan).publish({
    id:      ticket.id,
    version: ticket.version,
    title:   ticket.get('title'),
    price:   ticket.get('price').toString(),
    userId:  ticket.get('userId'),
  });

  res
    .status(201)
    .send(ticket);
});

export { router as createTicketRouter };
