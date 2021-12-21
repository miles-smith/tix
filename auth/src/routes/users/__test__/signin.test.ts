import request from 'supertest';
import { app } from '../../../app';

const createUser = async (email: String, password: String) => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: email,
      password: password
    })
    .expect(201);
}

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

  await createUser(email, 'my-password');

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

  await createUser(email, passwd);

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
