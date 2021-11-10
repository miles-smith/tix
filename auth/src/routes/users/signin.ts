import express from 'express';

const router = express.Router();

router.post('/signin', (_req, res) => {
  res.send({ message: 'TODO' });
});

export { router as newSessionRouter };
