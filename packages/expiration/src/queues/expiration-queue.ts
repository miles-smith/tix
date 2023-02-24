import Queue from "bull";
import { natsClient } from "../nats-client";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  }
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsClient.stan).publish({
    orderId: job.data.orderId
  });
});

export { expirationQueue };
