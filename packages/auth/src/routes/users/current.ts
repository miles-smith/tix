import express from 'express';
import { currentUser } from '@elevenhotdogs-tix/common';

const router = express.Router();

router.get('/current', currentUser, (req, res) => {
  res.send({ user: req.currentUser || null });
});

export { router as currentUserRouter };
