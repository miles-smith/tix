import express from 'express';
import { RoutingError } from '../errors/routing-error';
import { usersRouter } from './users';

const router = express.Router();

router.use('/users', usersRouter);

router.all('*', () => {
  throw new RoutingError();
})

export default router;
