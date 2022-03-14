import express from 'express';
import { RoutingError } from '@elevenhotdogs-tix/common';
import { ordersRouter } from './orders/router';

const router = express.Router();

router.use('/orders', ordersRouter);

router.all('*', () => {
  throw new RoutingError();
})

export default router;
