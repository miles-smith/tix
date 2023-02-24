import { natsClient } from './nats-client';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
  if(!process.env.NATS_URL) {
    throw new Error('Missing environment variable: NATS_URL');
  }

  if(!process.env.NATS_CLUSTER_ID) {
    throw new Error('Missing environment variable: NATS_CLUSTER_ID');
  }

  if(!process.env.NATS_CLIENT_ID) {
    throw new Error('Missing environment variable: NATS_CLIENT_ID');
  }

  try {
    await natsClient.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsClient.stan.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });

    process.on('SIGINT',  () => natsClient.stan.close());
    process.on('SIGTERM', () => natsClient.stan.close());

    new OrderCreatedListener(natsClient.stan).listen();
  } catch (err) {
    console.error(err);
  }
}

start();
