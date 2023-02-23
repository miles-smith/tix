import mongoose from 'mongoose';
import { app } from './app';
import { natsClient } from './nats-client';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';

const port = 3000;

const start = async () => {
  if(!process.env.JWT_KEY) {
    throw new Error('Missing environment variable: JWT_KEY');
  }

  if(!process.env.MONGO_URI) {
    throw new Error('Missing environment variable: MONGO_URI');
  }

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

    new TicketCreatedListener(natsClient.stan).listen();
    new TicketUpdatedListener(natsClient.stan).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(port, () => {
    console.log('Listening on port', port);
  });
}

start();
