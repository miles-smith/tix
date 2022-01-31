import express from 'express';

const router = express.Router();

router.delete('/signout', (req, res) => {
  req.session = null;
  res.send({});
});

export { router as deleteSessionRouter };
