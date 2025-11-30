import IORedis, { RedisOptions } from 'ioredis';
import { env } from './env';

const redisUrl = new URL(env.redisUrl);

const connectionOptions: RedisOptions = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port || 6379),
  password: redisUrl.password || undefined,
  db: redisUrl.pathname ? Number(redisUrl.pathname.replace('/', '')) || 0 : 0,
};

export const redis = new IORedis(env.redisUrl);

export const redisForBull = {
  connection: connectionOptions,
};
