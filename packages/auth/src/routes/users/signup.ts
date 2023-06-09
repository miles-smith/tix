import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@elevenhotdogs-tix/common';
import { User } from '../../models/user';

const router = express.Router();

/**
  TODO: Email confirmation
  TODO: Enumeration attack guard
**/
const emailValidator =
  body('email')
    .isEmail()
    .withMessage('Email must be valid');

/**
  TODO: Password complexity
  TODO: Password reuse
**/
const passwordMinLength = 10;
const passwordMaxLength = 36;
const passwordValidator =
  body('password')
    .trim()
    .isLength({ min: passwordMinLength, max: passwordMaxLength })
    .withMessage(`Password must be between ${passwordMinLength} and ${passwordMaxLength} characters`)

const validationChain = [
  emailValidator,
  passwordValidator
];

router.post('/signup', validationChain, validateRequest, async (req: Request, res: Response) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  if(await User.exists({ email })) {
    throw new BadRequestError();
  }

  const user = User.build({ email, password });
  await user.save();

  // TODO: DRY up this code.
  const token = jwt.sign({
    id: user.id,
    email: user.email
  }, process.env.JWT_KEY!); // Hush TypeScript! We know JWT_KEY is present if the server started.

  req.session = {
    jwt: token,
  };

  res
    .status(201)
    .send(user);
});

export { router as registrationRouter };
