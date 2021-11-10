import express from 'express';

const router = express.Router();

router.post('/signup', (_req, res) => {
  res.send({ message: 'TODO' });
});

export { router as registrationRouter };
