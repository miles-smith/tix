import express from 'express';
import { RoutingError } from '@elevenhotdogs-tix/common';
import { usersRouter } from './users';

const router = express.Router();

router.use('/users', usersRouter);

router.all('*', () => {
  throw new RoutingError();
})

export default router;
