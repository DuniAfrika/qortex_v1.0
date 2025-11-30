import { PrismaClient } from '@prisma/client';
import { env } from './env';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClient =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: env.databaseUrl,
      },
    },
    log: env.nodeEnv === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });

if (env.nodeEnv === 'development') {
  global.prisma = prismaClient;
}

export const prisma = prismaClient;
