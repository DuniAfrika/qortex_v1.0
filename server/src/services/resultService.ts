import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { emitEvent } from '../events/eventBus';
import { evaluateMicrotaskQuorum } from './quorumValidator';
import { touchMiner } from './minerService';

export type MinerResultInput = {
  minerId: string;
  microtaskId: string;
  output: Prisma.JsonValue;
  nonce: string;
  timestamp: string;
  signature: string;
};

const SIGNATURE_SEPARATOR = '|';

const buildSignaturePayload = ({ minerId, microtaskId, output, nonce, timestamp }: MinerResultInput) =>
  [microtaskId, minerId, JSON.stringify(output), nonce, timestamp].join(SIGNATURE_SEPARATOR);

const verifySignature = (input: MinerResultInput) => {
  const expected = crypto
    .createHmac('sha256', env.minerSharedSecret)
    .update(buildSignaturePayload(input))
    .digest('hex');

  return expected === input.signature;
};

const isFreshTimestamp = (timestamp: string) => {
  const diff = Math.abs(Date.now() - new Date(timestamp).getTime());
  return diff <= env.resultTimeoutMs;
};

export const recordMinerResult = async (input: MinerResultInput) => {
  if (!isFreshTimestamp(input.timestamp)) {
    throw new Error('stale_result');
  }

  if (!verifySignature(input)) {
    throw new Error('invalid_signature');
  }

  const miner = await prisma.miner.findUnique({ where: { id: input.minerId } });
  if (!miner) {
    throw new Error('miner_not_found');
  }

  const microtask = await prisma.microtask.findUnique({ where: { id: input.microtaskId }, include: { task: true } });
  if (!microtask) {
    throw new Error('microtask_not_found');
  }

  try {
    await prisma.result.create({
      data: {
        microtaskId: input.microtaskId,
        minerId: input.minerId,
        output: input.output as Prisma.InputJsonValue,
        signedHash: input.signature,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      console.warn(`[result] duplicate submission ignored for ${input.minerId}:${input.microtaskId}`);
      return;
    }
    throw error;
  }

  await touchMiner(input.minerId);

  emitEvent('microtask.result', {
    taskId: microtask.taskId,
    microtaskId: input.microtaskId,
    minerId: input.minerId,
    output: input.output,
  });

  await evaluateMicrotaskQuorum(input.microtaskId);
};
