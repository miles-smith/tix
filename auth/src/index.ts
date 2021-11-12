import express from 'express';
import router  from './routes';
import { errorHandler } from './middlewares/error-handler';

const app  = express();
const port = 3000;

app.use(express.json());

app.use('/api', router);

app.use(errorHandler);

app.listen(port, () => {
  console.log('Listening on port', port);
})
