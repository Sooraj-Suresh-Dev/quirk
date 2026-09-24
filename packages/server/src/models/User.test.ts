import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../models/User.js';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
}, 120000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('User Model', () => {
  it('creates a user with valid data', async () => {
    const user = await User.create({
      email: 'test@example.com',
      passwordHash: 'hashedpassword123',
    });
    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
    expect(user._id).toBeDefined();
  });

  it('defaults daily digest on at 10:00', async () => {
    const user = await User.create({
      email: 'digest-defaults@example.com',
      passwordHash: 'hashedpassword123',
    });
    expect(user.preferences?.emailDigest).toBe(true);
    expect(user.preferences?.digestTime).toBe('10:00');
  });

  it('requires email to be unique', async () => {
    await User.create({ email: 'dup@example.com', passwordHash: 'hash1' });
    await expect(
      User.create({ email: 'dup@example.com', passwordHash: 'hash2' })
    ).rejects.toThrow();
  });

  it('can set preferences', async () => {
    const user = await User.create({
      email: 'prefs@example.com',
      passwordHash: 'hash',
      preferences: {
        sources: ['github', 'hackernews'],
        preferredProvider: 'openrouter',
      },
    });
    const fetched = await User.findById(user._id);
    expect(fetched?.preferences?.sources).toEqual(['github', 'hackernews']);
    expect(fetched?.preferences?.preferredProvider).toBe('openrouter');
  });
});
