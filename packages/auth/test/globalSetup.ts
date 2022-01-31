import { MongoMemoryServer }  from 'mongodb-memory-server';
import { randomBytes } from 'crypto';

export = async () => {
  const mongo    = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  (global as any).__MONGO__ = mongo;

  process.env.MONGO_URI = mongoUri.slice(0, mongoUri.lastIndexOf('/'));
  process.env.JWT_KEY   = randomBytes(32).toString();
};
