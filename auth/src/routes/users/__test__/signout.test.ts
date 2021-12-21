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

it('clears session cookie on sign out', async () => {
  await createUser('test.user@example.com', 'my-password');

  const response =
    await request(app)
      .delete('/api/users/signout');

  expect(response.statusCode)
    .toEqual(200);

  expect(response.get('Set-Cookie')[0])
    .toMatch(/express\:sess=\;/);
});
