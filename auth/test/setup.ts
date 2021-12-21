import mongoose from 'mongoose';

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
