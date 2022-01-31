import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../src/app';

declare global {
  var signUp: (email?: String, passwd?: String) => Promise<void>;
  var signIn: (email?: String, passwd?: String) => Promise<string[]>;
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

global.signIn = async (email = 'test.user@example.com', passwd = 'my-password') => {
  const response =
    await request(app)
      .post('/api/users/signin')
      .send({
        email: email,
        password: passwd
      })
      .expect(200);

  return response.get('Set-Cookie');
}
