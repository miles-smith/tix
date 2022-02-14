import express from 'express';
import { createTicketRouter } from './create';
import { showTicketRouter } from './show';

const router = express.Router();

router.use(
  createTicketRouter,
  showTicketRouter
);

export { router as ticketsRouter };
