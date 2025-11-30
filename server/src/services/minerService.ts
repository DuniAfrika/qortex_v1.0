import { MinerStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export type RegisterMinerInput = {
  nodeId: string;
  address?: string;
};

export const registerMiner = async ({ nodeId, address }: RegisterMinerInput) => {
  const data: Prisma.MinerUpsertArgs['create'] = {
    nodeId,
    address,
    status: MinerStatus.online,
    reliabilityScore: 1,
    lastSeenAt: new Date(),
  };

  const miner = await prisma.miner.upsert({
    where: { nodeId },
    update: { address, status: MinerStatus.online, lastSeenAt: new Date() },
    create: data,
  });

  return miner;
};

export const selectDispatchableMiners = async (limit: number) => {
  const miners = await prisma.miner.findMany({
    where: { status: MinerStatus.online },
    orderBy: [{ reliabilityScore: 'desc' }, { lastSeenAt: 'desc' }],
    take: limit,
  });
  return miners;
};

export const getMinerById = async (minerId: string) => {
  return prisma.miner.findUnique({ where: { id: minerId } });
};

export const touchMiner = async (minerId: string) => {
  await prisma.miner.update({ where: { id: minerId }, data: { lastSeenAt: new Date(), status: MinerStatus.online } });
};
