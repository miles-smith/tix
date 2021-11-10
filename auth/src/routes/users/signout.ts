import express from 'express';

const router = express.Router();

router.delete('/signout', (_req, res) => {
  res.send({ message: 'TODO' });
});

export { router as deleteSessionRouter };
