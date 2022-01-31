import { MongoMemoryServer } from 'mongodb-memory-server';

export = async () => {
  const mongo: MongoMemoryServer = (global as any).__MONGO__;

  await mongo.stop();
}
