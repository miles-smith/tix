import request from 'supertest';
import { app } from '../../../app';

it('fails with an unknown email', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'unknown.user@example.com',
      password: 'password'
    })
    .expect(400);
});

it('fails with an incorrect password', async () => {
  const email = 'test.user@example.com';

  await signUp(email, 'my-password');

  await request(app)
    .post('/api/users/signin')
    .send({
      email: email,
      password: 'not-my-password'
    })
    .expect(400);
});

it('succeeds with valid credentials', async () => {
  const email  = 'test.user@example.com';
  const passwd = 'my-password';

  await signUp(email, passwd);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: email,
      password: passwd
    });

  expect(response.statusCode)
    .toEqual(200);

  expect(response.get('Set-Cookie'))
    .toBeDefined();
});
