import { randomBytes } from 'crypto';

export = async () => {
  process.env.JWT_KEY   = randomBytes(32).toString();
};
