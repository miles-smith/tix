import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";
import currency from "currency.js";
import { authenticate, validateRequest,  OrderStatus } from "@elevenhotdogs-tix/common";
import { BadRequestError, RoutingError, NotAuthorizedError } from "@elevenhotdogs-tix/common";
import { stripe} from "../../stripe";
import { Order } from "../../models/order";
import { Payment } from "../../models/payment";
import { PaymentCreatedPublisher } from "../../events/publishers/payment-created-publisher";
import { natsClient } from "../../nats-client";

const gbp = (value: mongoose.Types.Decimal128) => currency(value.toString(), { symbol: '£' });

const router = express.Router();

const tokenValidator =
  body('token')
    .not()
    .isEmpty();

const orderValidator = 
  body('orderId')
    .not()
    .isEmpty();

const validate = [
  tokenValidator,
  orderValidator,
  validateRequest,
];

router.post('/', authenticate, validate, async (req: Request, res: Response) => {
  const { orderId, token } = req.body;

  const order = await Order.findById(orderId);

  if(!order) {
    throw new RoutingError();
  }

  if(order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  if(order.status === OrderStatus.Cancelled) {
    throw new BadRequestError('Invalid order status');
  }

  const charge = await stripe.charges.create({
    currency: 'gbp',
    amount:   Number(gbp(order.price).multiply(100)), // price in pence
    source:   token,
  });

  const payment = Payment.build({
    orderId:  order.id,
    chargeId: charge.id,
  });

  await payment.save();

  new PaymentCreatedPublisher(natsClient.stan).publish({
    id:       payment.id,
    version:  payment.version,
    orderId:  order.id,
    chargeId: charge.id,
  });

  res
    .status(201)
    .send(payment);
});

export { router as createPaymentRouter };
