import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { authenticate, validateRequest, RoutingError, NotAuthorizedError } from '@elevenhotdogs-tix/common';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../../events/publishers/ticket-updated-publisher';
import { natsClient} from '../../nats-client';

const router = express.Router();

// TODO: Validation behaviour is duplicated across the codebase; need to DRY it up.
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

router.put('/:id', authenticate, validate, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if(!ticket) {
    throw new RoutingError('Not Found');
  }

  if(ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  const { title, price } = req.body;

  ticket.set({ title, price });
  await ticket.save();

  // TODO: There is a potential point of failure here; the resource could save but the event
  // fail to publish (e.g. perhaps the NATS connection is temporarily lost). This could lead to a
  // data integrity issue. One possible solution is to use a db transaction to save both the
  // resource, and the event (to a local collection), and use an out of band process (i.e. a
  // resilient job queue/worker) to handle event publication.
  new TicketUpdatedPublisher(natsClient.stan).publish({
    id:      ticket.id,
    version: ticket.version,
    title:   ticket.get('title'),
    price:   ticket.get('price').toString(),
    userId:  ticket.get('userId'),
  });

  res
    .status(200)
    .send(ticket);
});

export { router as updateTicketRouter };
