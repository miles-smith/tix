import express, { Request, Response } from 'express';
import { RoutingError } from '@elevenhotdogs-tix/common';
import { Ticket } from '../../models/ticket';

const router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if(!ticket) {
    throw new RoutingError('Not Found');
  }

  res
    .status(200)
    .send(ticket);
});

export { router as showTicketRouter };
