import express from 'express';
import { currentUserRouter }   from './current';
import { registrationRouter }  from './signup';
import { newSessionRouter }    from './signin';
import { deleteSessionRouter } from './signout';

const router = express.Router();

router.use(
  currentUserRouter,
  registrationRouter,
  newSessionRouter,
  deleteSessionRouter
);

export { router as usersRouter };
