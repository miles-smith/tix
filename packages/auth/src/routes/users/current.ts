import express from 'express';
import { currentUser } from '../../middlewares/current-user';

const router = express.Router();

router.get('/current', currentUser, (req, res) => {
  res.send({ user: req.currentUser || null });
});

export { router as currentUserRouter };
