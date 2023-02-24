import Queue from "bull";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  }
});

// TODO:
expirationQueue.process(async (job) => {
  console.log('Publishing expiration:complete for order', job.data.orderId);
});

export { expirationQueue };
