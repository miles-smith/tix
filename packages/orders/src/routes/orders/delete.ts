import express, { Request, Response } from 'express';
import { authenticate } from '@elevenhotdogs-tix/common';
import { RoutingError, NotAuthorizedError, BadRequestError } from '@elevenhotdogs-tix/common';
import { Order, OrderStatus } from '../../models/order';

const router = express.Router();

router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  const id    = req.params.id;
  const order = await Order.findById(id);

  if(!order) {
    throw new RoutingError();
  }

  if(order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  if(order.status === OrderStatus.Complete) {
    throw new BadRequestError('Cannot cancel a completed order');
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  res
    .status(204)
    .send({});
});

export { router as deleteOrderRouter };
