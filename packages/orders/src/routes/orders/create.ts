import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { authenticate, validateRequest, RoutingError, NotAuthorizedError } from '@elevenhotdogs-tix/common';

const router = express.Router();

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

router.post('/', authenticate, validate, async (req: Request, res: Response) => {
  res
    .status(201)
    .send({});
});

export { router as createOrderRouter };
