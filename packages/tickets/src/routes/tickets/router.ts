import express from 'express';
import { indexTicketRouter } from './index';
import { createTicketRouter } from './create';
import { showTicketRouter } from './show';

const router = express.Router();

router.use(
  indexTicketRouter,
  createTicketRouter,
  showTicketRouter
);

export { router as ticketsRouter };
