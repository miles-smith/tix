import request from 'supertest';
import { bootstrapMongo } from './setup-mongo';
import { app } from '../src/app';

declare global {
  var signUp: (email?: String, passwd?: String) => Promise<void>;
  var signIn: (email?: String, passwd?: String) => Promise<string[]>;
}

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

bootstrapMongo();
