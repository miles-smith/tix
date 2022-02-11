import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../src/app';

declare global {
  var signUp: (email?: String, passwd?: String) => Promise<void>;
  var signIn: () => string[];
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

afterAll(async () => {
  await mongoose.connection.close();
});

global.signUp = async (email = 'test.user@example.com', passwd = 'my-password') => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: email,
      password: passwd
    })
    .expect(201);
}

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
