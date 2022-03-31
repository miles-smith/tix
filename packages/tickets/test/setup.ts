import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { bootstrapMongo } from './setup-mongo';
import { app } from '../src/app';

declare global {
  var signIn: () => string[];
}

bootstrapMongo();

beforeEach(() => {
  jest.clearAllMocks();
});

// Generates a stubbed JWT and session for the purposes of authenticating without relying on
// external services.
global.signIn = () => {
  const payload = {
    id:    '62064650b18cd064285bc555',
    email: 'test.user@example.com',
    iat:   Date.now()
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const decodedSession = JSON.stringify({ jwt: token });
  const encodedSession = Buffer.from(decodedSession).toString('base64');

  return [`express:sess=${encodedSession}`];
}

jest.mock('../src/nats-client');
