import express from 'express';
import { RoutingError } from '@elevenhotdogs-tix/common';

const router = express.Router();

router.all('*', () => {
  throw new RoutingError();
})

export default router;
