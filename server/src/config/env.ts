import dotenv from 'dotenv';

dotenv.config();

const number = (value: string | undefined, fallback: number) => {
  const parsed = value ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
};

const withFallback = (value: string | undefined, fallback: string, name: string) => {
  if (!value) {
    console.warn(`[env] ${name} missing, falling back to default value`);
    return fallback;
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: number(process.env.PORT, 3000),
  databaseUrl: withFallback(
    process.env.DATABASE_URL,
    'postgresql://postgres:postgres@localhost:5432/qortex?schema=public',
    'DATABASE_URL'
  ),
  redisUrl: withFallback(process.env.REDIS_URL, 'redis://localhost:6379', 'REDIS_URL'),
  apiKeySecret: withFallback(process.env.API_KEY_SECRET, 'local-api-key-secret', 'API_KEY_SECRET'),
  minerSharedSecret: withFallback(
    process.env.MINER_SHARED_SECRET,
    'local-miner-secret',
    'MINER_SHARED_SECRET'
  ),
  dispatchReplicaCount: number(process.env.DISPATCH_REPLICAS, 5),
  resultTimeoutMs: number(process.env.RESULT_TIMEOUT_MS, 1000 * 30),
  quorumCheckIntervalMs: number(process.env.QUORUM_CHECK_INTERVAL_MS, 1000 * 5),
  maxTweetsPerTask: number(process.env.MAX_TWEETS_PER_TASK, 5),
};
