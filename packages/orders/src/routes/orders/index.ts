import express, { Request, Response } from 'express';
import { authenticate } from '@elevenhotdogs-tix/common';
import { Order } from '../../models/order';

const router = express.Router();

router.get('/', authenticate, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id
  }).populate('ticket');

  res
    .status(200)
    .send(orders);
});

export { router as indexOrderRouter };
