import request from 'supertest';
import { app } from '../../../app';

it('clears session cookie on sign out', async () => {
  await signUp();

  const cookie = await signIn();

  const response =
    await request(app)
      .delete('/api/users/signout')
      .set('Cookie', cookie);

  expect(response.statusCode)
    .toEqual(200);

  expect(response.get('Set-Cookie')[0])
    .toMatch(/express\:sess=\;/);
});
