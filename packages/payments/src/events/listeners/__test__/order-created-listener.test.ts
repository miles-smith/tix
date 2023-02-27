import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@elevenhotdogs-tix/common";
import { OrderCreatedListener } from "../order-created-listener";
import { natsClient } from "../../../nats-client";
import { Order } from "../../../models/order";

describe('OrderCreatedListener', () => {
  let listener: OrderCreatedListener;
  let data: OrderCreatedEvent['data'];
  let message: Message;

  beforeEach(async () => {
    listener = new OrderCreatedListener(natsClient.stan);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    data = {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      status: OrderStatus.Created,
      userId: new mongoose.Types.ObjectId().toHexString(),
      expiresAt: expiresAt.toISOString(), 
      ticket: {
        id: new mongoose.Types.ObjectId().toHexString(),
        price: '10.00',
      }
    };

    // @ts-ignore
    message = {
      ack: jest.fn() 
    }
  });

  it('replicates an `order`', async () => {
    await listener.onMessage(data, message);
    
    const order = await Order.findById(data.id);

    expect(order).toBeDefined();
    expect(order!.version).toEqual(data.version);
    expect(order!.userId).toEqual(data.userId);
    expect(order!.status).toEqual(data.status);
    expect(order!.price).toEqual(mongoose.Types.Decimal128.fromString(data.ticket.price));
  });

  it('acknowledges the `message`', async () => {
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
