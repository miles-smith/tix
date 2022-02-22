import express from 'express';
import { indexTicketRouter } from './index';
import { createTicketRouter } from './create';
import { showTicketRouter } from './show';
import { updateTicketRouter } from './update';

const router = express.Router();

router.use(
  indexTicketRouter,
  createTicketRouter,
  showTicketRouter,
  updateTicketRouter
);

export { router as ticketsRouter };
