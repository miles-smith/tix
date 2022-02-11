import express from 'express';
import { RoutingError } from '@elevenhotdogs-tix/common';
import { ticketsRouter } from './tickets/router';

const router = express.Router();

router.use('/tickets', ticketsRouter);

router.all('*', () => {
  throw new RoutingError();
})

export default router;
