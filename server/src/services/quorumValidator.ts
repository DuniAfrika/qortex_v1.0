import { MicrotaskStatus, TaskStatus } from '@prisma/client';
import { env } from '../config/env';
import { prisma } from '../config/prisma';
import { emitEvent } from '../events/eventBus';

export type ResultSample = {
  minerId: string;
  label: string;
};

export type QuorumDecision = {
  decision: string;
  confidence: number;
  agreeingMiners: string[];
  dissentingMiners: string[];
};

export const determineQuorumOutcome = (samples: ResultSample[], requiredQuorum: number) => {
  const counts = new Map<string, { count: number; miners: string[] }>();

  samples.forEach((sample) => {
    const existing = counts.get(sample.label) ?? { count: 0, miners: [] };
    existing.count += 1;
    existing.miners.push(sample.minerId);
    counts.set(sample.label, existing);
  });

  let topLabel = 'no_consensus';
  let topCount = 0;
  let topMiners: string[] = [];

  counts.forEach((value, label) => {
    if (value.count > topCount) {
      topLabel = label;
      topCount = value.count;
      topMiners = value.miners;
    }
  });

  const confidence = samples.length === 0 ? 0 : topCount / samples.length;
  const consensus = confidence >= requiredQuorum;

  return {
    consensus,
    decision: topLabel,
    confidence,
    agreeingMiners: topMiners,
    dissentingMiners: samples.filter((sample) => !topMiners.includes(sample.minerId)).map((sample) => sample.minerId),
  };
};

export const evaluateMicrotaskQuorum = async (microtaskId: string) => {
  const microtask = await prisma.microtask.findUnique({
    where: { id: microtaskId },
    include: {
      results: true,
      quorum: true,
      task: true,
    },
  });

  if (!microtask || microtask.quorum) {
    return;
  }

  const expected = microtask.expectedResponses || env.dispatchReplicaCount;
  const minResponses = Math.max(1, Math.ceil(microtask.task.requiredQuorum * expected));

  if (microtask.results.length < minResponses) {
    return;
  }

  const samples: ResultSample[] = microtask.results.map((result) => ({
    minerId: result.minerId,
    label: String((result.output as Record<string, unknown>).label ?? ''),
  }));

  const outcome = determineQuorumOutcome(samples, microtask.task.requiredQuorum);

  if (!outcome.consensus) {
    await prisma.microtask.update({
      where: { id: microtaskId },
      data: { status: MicrotaskStatus.failed, completedAt: new Date() },
    });
    emitEvent('microtask.quorum', {
      taskId: microtask.taskId,
      microtaskId,
      decision: 'no_consensus',
      confidence: outcome.confidence,
      agreeingMiners: outcome.agreeingMiners,
      dissentingMiners: outcome.dissentingMiners,
    });
    await maybeFinalizeTask(microtask.taskId);
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.quorum.create({
      data: {
        taskId: microtask.taskId,
        microtaskId,
        decision: {
          decision: outcome.decision,
          confidence: outcome.confidence,
          agreeing_miners: outcome.agreeingMiners,
          dissenters: outcome.dissentingMiners,
        },
      },
    });

    await tx.microtask.update({
      where: { id: microtaskId },
      data: { status: MicrotaskStatus.completed, completedAt: new Date() },
    });
  });

  emitEvent('microtask.quorum', {
    taskId: microtask.taskId,
    microtaskId,
    decision: outcome.decision,
    confidence: outcome.confidence,
    agreeingMiners: outcome.agreeingMiners,
    dissentingMiners: outcome.dissentingMiners,
  });

  await maybeFinalizeTask(microtask.taskId);
};

const maybeFinalizeTask = async (taskId: string) => {
  const remaining = await prisma.microtask.count({
    where: {
      taskId,
      status: { in: [MicrotaskStatus.pending, MicrotaskStatus.assigned] },
    },
  });

  if (remaining > 0) {
    return;
  }

  const failed = await prisma.microtask.count({ where: { taskId, status: MicrotaskStatus.failed } });
  const status = failed > 0 ? TaskStatus.failed : TaskStatus.completed;

  await prisma.task.update({ where: { id: taskId }, data: { status } });

  emitEvent('task.completed', { taskId, status });
};

