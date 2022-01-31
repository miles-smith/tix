import mongoose from 'mongoose';
import { app } from './app';

const port = 3000;

const start = async () => {
  if(!process.env.JWT_KEY) {
    throw new Error('Missing environment variable: JWT_KEY');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(port, () => {
    console.log('Listening on port', port);
  });
}

start();
