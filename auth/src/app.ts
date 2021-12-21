import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import router  from './routes';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.set('trust proxy', true);

app.use(express.json());
app.use(cookieSession({
  signed: false,
  secure: true,
}));

app.use('/api', router);

app.use(errorHandler);

export { app };
