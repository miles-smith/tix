import express from 'express';
import { indexOrderRouter } from './index';
import { createOrderRouter } from './create';
import { showOrderRouter } from './show';
import { deleteOrderRouter } from './delete';

const router = express.Router();

router.use(
  indexOrderRouter,
  createOrderRouter,
  showOrderRouter,
  deleteOrderRouter
);

export { router as ordersRouter };
