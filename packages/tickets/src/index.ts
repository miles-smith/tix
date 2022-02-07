import mongoose from 'mongoose';
import { app } from './app';

const port = 3000;

const start = async () => {
  if(!process.env.JWT_KEY) {
    throw new Error('Missing environment variable: JWT_KEY');
  }

  if(!process.env.MONGO_URI) {
    throw new Error('Missing environment variable: MONGO_URI');
  }

  try {
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
