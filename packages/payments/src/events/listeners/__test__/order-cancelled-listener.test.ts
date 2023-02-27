
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderStatus } from "@elevenhotdogs-tix/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsClient } from "../../../nats-client";
import { Order, OrderDocument } from "../../../models/order";

describe('OrderCancelledListener', () => {
  let listener: OrderCancelledListener;
  let data: OrderCancelledEvent['data'];
  let message: Message;
  let order: OrderDocument;

  beforeEach(async () => {
    listener = new OrderCancelledListener(natsClient.stan);

    order = Order.build({
      id:      new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      userId:  new mongoose.Types.ObjectId().toHexString(),
      status:  OrderStatus.Created,
      price:  '10.00',
    });

    await order.save();

    data = {
      id: order.id,
      version: 1,
      ticket: {
        id: new mongoose.Types.ObjectId().toHexString()
      }
    };

    // @ts-ignore
    message = {
      ack: jest.fn() 
    }
  });

  it('marks an `order` as cancelled', async () => {
    await listener.onMessage(data, message);
    
    const cancelledOrder = await Order.findById(data.id);

    expect(cancelledOrder).toBeDefined();
    expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
  });

  it('acknowledges the `message`', async () => {
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
