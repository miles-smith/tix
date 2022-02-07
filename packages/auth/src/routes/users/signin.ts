import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@elevenhotdogs-tix/common';
import { Password } from '../../utils/password';
import { User } from '../../models/user';

const router = express.Router();

const emailValidator =
  body('email')
    .isEmail()
    .withMessage('Email must be valid');

const passwordValidator =
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password must be supplied');

const validationChain = [
  emailValidator,
  passwordValidator,
];

router.post('/signin', validationChain, validateRequest, async (req: Request, res: Response) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  const user = await User.findOne({ email });

  if(!user) {
    throw new BadRequestError();
  }

  const validPassword = await Password.compare(user.password, password);

  if(!validPassword) {
    throw new BadRequestError();
  }

  // TODO: DRY up this code.
  const token = jwt.sign({
    id: user.id,
    email: user.email
  }, process.env.JWT_KEY!); // Hush TypeScript! We know JWT_KEY is present if the server started.

  req.session = {
    jwt: token,
  };

  res
    .status(200)
    .send(user);
});

export { router as newSessionRouter };
