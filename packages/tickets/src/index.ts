import { randomBytes } from 'crypto';
import mongoose from 'mongoose';
import { app } from './app';
import { natsClient } from './nats-client';

const port = 3000;

const start = async () => {
  if(!process.env.JWT_KEY) {
    throw new Error('Missing environment variable: JWT_KEY');
  }

  if(!process.env.MONGO_URI) {
    throw new Error('Missing environment variable: MONGO_URI');
  }

  try {
    await natsClient.connect('tix', `tickets-${randomBytes(6).toString('hex')}`, 'http://nats-srv:4222');

    natsClient.stan.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });

    process.on('SIGINT',  () => natsClient.stan.close());
    process.on('SIGTERM', () => natsClient.stan.close());

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
