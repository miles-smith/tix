import express, { Request, Response } from 'express';
import { authenticate } from '@elevenhotdogs-tix/common';
import { RoutingError, NotAuthorizedError, BadRequestError } from '@elevenhotdogs-tix/common';
import { Order, OrderDocument, OrderStatus } from '../../models/order';
import { natsClient } from '../../nats-client';
import { OrderCancelledPublisher } from '../../events/publishers/order-cancelled-publisher';

const router = express.Router();

const publishOrderCancelledEvent = (order: OrderDocument) => {
  new OrderCancelledPublisher(natsClient.stan)
    .publish({
      id: order.id,
      ticket: {
        id: order.ticket.id
      }
    });
}

router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  const id    = req.params.id;
  const order = await Order.findById(id).populate('ticket');

  if(!order) {
    throw new RoutingError();
  }

  if(order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  if(order.status === OrderStatus.Complete) {
    throw new BadRequestError('Cannot cancel a completed order');
  }

  // TODO: Probably want to think about short circuiting should a request come in
  // for an already cancelled order.
  order.status = OrderStatus.Cancelled;
  await order.save();
  publishOrderCancelledEvent(order);

  res
    .status(204)
    .send({});
});

export { router as deleteOrderRouter };
