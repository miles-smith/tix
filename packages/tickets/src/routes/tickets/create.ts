import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { authenticate, validateRequest } from '@elevenhotdogs-tix/common';
import { Ticket } from '../../models/ticket';

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

  res
    .status(201)
    .send(ticket);
});

export { router as createTicketRouter };
