import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { authenticate, validateRequest, RoutingError, NotAuthorizedError } from '@elevenhotdogs-tix/common';
import { Ticket } from '../../models/ticket';

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

  res
    .status(200)
    .send(ticket);
});

export { router as updateTicketRouter };
