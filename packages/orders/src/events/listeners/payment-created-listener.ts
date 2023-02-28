import { Listener, Subjects, PaymentCreatedEvent, OrderStatus } from "@elevenhotdogs-tix/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], message: Message) {
    const order = await Order.findById(data.orderId);

    if(!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Complete });

    await order.save();

    // FIXME: Should emit an event here to signal the update of the order...

    message.ack();
  }
}
