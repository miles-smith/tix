import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/current', (req, res) => {
  if(!req.session?.jwt) {
    return res.send({ user: null });
  }

  try {
    const token = jwt.verify(req.session.jwt, process.env.JWT_KEY!);

    res.send({ user: token });
  } catch (error) {
    res.send({ user: null });
  };
});

export { router as currentUserRouter };
