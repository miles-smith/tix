import request from 'supertest';
import { app } from '../../../app';

it('responds with details about the currently signed in user', async () => {
  const email = 'test.user@example.com';

  await signUp(email);

  const cookie = await signIn(email);

  const response =
    await request(app)
      .get('/api/users/current')
      .set('Cookie', cookie)
      .send()
      .expect(200);

  expect(response.body).toHaveProperty('user');
  expect(response.body.user).toHaveProperty('id');
  expect(response.body.user).toHaveProperty('email', email);
  expect(response.body.user).not.toHaveProperty('password');
});

it('responds with nothing unless authenticated', async () => {
  await signUp();

  const response =
    await request(app)
      .get('/api/users/current')
      .send()
      .expect(200);

  expect(response.body).toHaveProperty('user', null);
});
