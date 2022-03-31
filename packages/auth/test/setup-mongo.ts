import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export const bootstrapMongo = () => {
  let mongo: MongoMemoryServer;

  beforeAll(async() => {
    mongo = await MongoMemoryServer.create();

    const mongoUri = mongo.getUri();

    process.env.MONGO_URI = mongoUri.slice(0, mongoUri.lastIndexOf('/'));
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections) {
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });
}
