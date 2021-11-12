import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../../errors/request-validation-error';

const router = express.Router();

/**
  TODO: Email uniqueness
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

router.post('/signup', validationChain, (req: Request, res: Response) => {
  const validationErrors = validationResult(req);

  if(!validationErrors.isEmpty()) {
    throw new RequestValidationError(validationErrors.array());
  }

  // const { email, password } = req.body;

  res.send({ message: 'Signed up successfully' });
});

export { router as registrationRouter };
