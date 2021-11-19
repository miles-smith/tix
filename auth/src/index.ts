import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import router  from './routes';
import { errorHandler } from './middlewares/error-handler';

const app  = express();
const port = 3000;

app.use(express.json());

app.use('/api', router);

app.use(errorHandler);

const start = async () => {
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
