import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TaskStatus } from '@prisma/client';

vi.mock('../config/prisma', () => ({
  prisma: {
    task: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('../queue/microtaskQueue', () => ({
  enqueueMicrotask: vi.fn(),
}));

import { prisma } from '../config/prisma';
import { enqueueMicrotask } from '../queue/microtaskQueue';
import { createTask, getTaskById } from './taskManager';

describe('taskManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates tasks and enqueues microtasks', async () => {
    prisma.task.create.mockResolvedValue({
      id: 'task-1',
      type: 'sentiment',
      status: TaskStatus.queued,
      requiredQuorum: 0.6,
      microtaskCount: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      microtasks: [
        { id: 'm1', index: 0, status: 'pending', expectedResponses: 0, assignedAt: null, completedAt: null, results: [], quorum: null },
        { id: 'm2', index: 1, status: 'pending', expectedResponses: 0, assignedAt: null, completedAt: null, results: [], quorum: null },
      ],
      proofReports: null,
    });

    const response = await createTask({ type: 'sentiment', inputs: ['a', 'b'], requiredQuorum: 0.6 });

    expect(prisma.task.create).toHaveBeenCalled();
    expect(enqueueMicrotask).toHaveBeenCalledTimes(2);
    expect(response.microtask_count).toBe(2);
  });

  it('maps task response shape for getTaskById', async () => {
    const now = new Date();
    prisma.task.findUnique.mockResolvedValue({
      id: 'task-1',
      type: 'sentiment',
      status: TaskStatus.completed,
      requiredQuorum: 0.6,
      microtaskCount: 1,
      createdAt: now,
      updatedAt: now,
      microtasks: [
        {
          id: 'm1',
          index: 0,
          status: 'completed',
          expectedResponses: 3,
          assignedAt: now,
          completedAt: now,
          results: [
            { minerId: 'miner-1', output: { label: 'positive' }, signedHash: 'hash', receivedAt: now },
          ],
          quorum: { id: 'q1', decision: { decision: 'positive' }, taskId: 'task-1', microtaskId: 'm1', finalizedAt: now },
        },
      ],
      proofReports: null,
    });

    const task = await getTaskById('task-1');

    expect(task?.task_id).toBe('task-1');
    expect(task?.microtasks[0].results[0].miner_id).toBe('miner-1');
  });
});
