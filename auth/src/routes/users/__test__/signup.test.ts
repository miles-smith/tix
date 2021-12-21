import request from 'supertest';
import { app } from '../../../app';

it('returns a 201 on successful sign up', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test.user@example.com',
      password: 'my-password'
    })
    .expect(201)
});

it('returns a 400 with an missing email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'my-password'
    })
    .expect(400)
});

it('returns a 400 with a blank email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: '',
      password: 'my-password'
    })
    .expect(400)
});

it('returns a 400 with an invalid email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test.user',
      password: 'my-password'
    })
    .expect(400)
});

it('returns a 400 with a duplicated email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test.user@example.com',
      password: 'my-password'
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test.user@example.com',
      password: 'my-password'
    })
    .expect(400);
});


it('returns a 400 with an missing password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test.user@example.com',
    })
    .expect(400)
});

it('returns a 400 with a blank password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test.user@example.com',
      password: ''
    })
    .expect(400)
});

it('returns a 400 with an invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test.user',
      password: 'passwd'
    })
    .expect(400)
});

it('sets session cookie on successful sign up', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test.user@example.com',
      password: 'my-password'
    });

  expect(response.get('Set-Cookie'))
    .toBeDefined();
});
