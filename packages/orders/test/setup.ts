import { randomBytes } from 'crypto';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../src/app';

interface TestUser {
  id: string;
  email: string;
}

declare global {
  var generateTestUser: () => TestUser;
  var signIn: (user: TestUser) => string[];
}

beforeAll(async () => {
  if(!process.env.MONGO_URI) {
    throw new Error('Missing MongoDB connecton string');
  }

  await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for(let collection of collections) {
    await collection.deleteMany({});
  }
});

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close();
});

// Generates a new, minimal user-like object.
global.generateTestUser = () => {
  return {
    id: new mongoose.Types.ObjectId().toString(),
    email: `test-user.${randomBytes(8).toString('hex')}@example.com`
  }
}

// Generates a stubbed JWT and session for the purposes of authenticating without relying on
// external services.
global.signIn = (user: TestUser) => {
  const payload = {
    id:    user.id,
    email: user.email,
    iat:   Date.now()
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const decodedSession = JSON.stringify({ jwt: token });
  const encodedSession = Buffer.from(decodedSession).toString('base64');

  return [`express:sess=${encodedSession}`];
}

jest.mock('../src/nats-client');
