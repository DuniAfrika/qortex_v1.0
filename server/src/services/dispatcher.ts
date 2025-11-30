import { MicrotaskStatus, TaskStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { selectDispatchableMiners } from './minerService';
import { emitEvent } from '../events/eventBus';

export const handleMicrotaskDispatch = async (microtaskId: string) => {
  const microtask = await prisma.microtask.findUnique({
    where: { id: microtaskId },
    include: { task: true },
  });

  if (!microtask || microtask.status !== MicrotaskStatus.pending) {
    return;
  }

  const miners = await selectDispatchableMiners(env.dispatchReplicaCount);
  if (miners.length === 0) {
    console.warn(`[dispatcher] no miners available for microtask ${microtaskId}`);
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.microtask.update({
      where: { id: microtaskId },
      data: {
        status: MicrotaskStatus.assigned,
        assignedAt: new Date(),
        expectedResponses: miners.length,
      },
    });

    if (microtask.task.status === TaskStatus.queued) {
      await tx.task.update({
        where: { id: microtask.taskId },
        data: { status: TaskStatus.verifying },
      });
    }
  });

  emitEvent('microtask.assigned', {
    microtaskId,
    taskId: microtask.taskId,
    minerIds: miners.map((m) => m.id),
  });
};
