import express from 'express';
import { createTicketRouter } from './create';

const router = express.Router();

router.use(
  createTicketRouter
);

export { router as ticketsRouter };
