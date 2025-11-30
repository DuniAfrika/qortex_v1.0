import { Prisma, TaskStatus } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { enqueueMicrotask } from '../queue/microtaskQueue';
import { emitEvent } from '../events/eventBus';

const createTaskSchema = z.object({
  type: z.literal('sentiment'),
  inputs: z.array(z.string().min(1)).min(1).max(env.maxTweetsPerTask),
  requiredQuorum: z.number().min(0.5).max(1).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const createTask = async (input: CreateTaskInput) => {
  const payload = createTaskSchema.parse(input);
  const microtaskCount = payload.inputs.length;
  const requiredQuorum = payload.requiredQuorum ?? 0.6;

  const task = await prisma.task.create({
    data: {
      type: payload.type,
      input: { inputs: payload.inputs },
      microtaskCount,
      requiredQuorum,
      status: TaskStatus.queued,
      microtasks: {
        create: payload.inputs.map((tweet, index) => ({
          index,
          input: { text: tweet },
        })),
      },
    },
    include: { microtasks: true },
  });

  await Promise.all(task.microtasks.map((microtask) => enqueueMicrotask(microtask.id)));

  emitEvent('task.created', { taskId: task.id, microtaskCount });

  return {
    task_id: task.id,
    status: task.status,
    type: task.type,
    required_quorum: task.requiredQuorum,
    microtask_count: task.microtaskCount,
  };
};

export const getTaskById = async (taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      microtasks: {
        include: {
          results: true,
          quorum: true,
        },
        orderBy: { index: 'asc' },
      },
      proofReports: true,
    },
  });

  return task ? formatTaskSummary(task) : null;
};

type TaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    microtasks: {
      include: { results: true; quorum: true };
      orderBy: { index: 'asc' };
    };
    proofReports: true;
  };
}>;

const formatTaskSummary = (task: TaskWithRelations) => ({
  task_id: task.id,
  status: task.status,
  type: task.type,
  required_quorum: task.requiredQuorum,
  microtask_count: task.microtaskCount,
  created_at: task.createdAt,
  updated_at: task.updatedAt,
  microtasks: task.microtasks.map((microtask) => ({
    microtask_id: microtask.id,
    index: microtask.index,
    status: microtask.status,
    expected_responses: microtask.expectedResponses,
    assigned_at: microtask.assignedAt,
    completed_at: microtask.completedAt,
    results: microtask.results.map((result) => ({
      miner_id: result.minerId,
      output: result.output,
      signed_hash: result.signedHash,
      received_at: result.receivedAt,
    })),
    quorum: microtask.quorum,
  })),
  proof_report_id: task.proofReports?.id ?? null,
});
