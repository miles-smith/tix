import express, { Request, Response } from 'express';
import { authenticate, RoutingError, NotAuthorizedError } from '@elevenhotdogs-tix/common';
import { Order } from '../../models/order';

const router = express.Router();

router.get('/:id', authenticate, async (req: Request, res: Response) => {
  const id = req.params.id;
  const order = await Order.findById(id).populate('ticket');

  if(!order) {
    throw new RoutingError();
  }

  if(order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  res
    .status(200)
    .send(order);
});

export { router as showOrderRouter };
