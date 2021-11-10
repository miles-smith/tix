import express from 'express';

const router = express.Router();

router.get('/current', (_req, res) => {
  res.send({ message: 'Hello Current User' });
});

export { router as currentUserRouter };
