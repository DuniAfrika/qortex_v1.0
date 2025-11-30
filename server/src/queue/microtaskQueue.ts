import { Queue, Worker, JobsOptions } from 'bullmq';
import { redisForBull } from '../config/redis';
import { env } from '../config/env';
import { handleMicrotaskDispatch } from '../services/dispatcher';

export type DispatchJobPayload = {
  microtaskId: string;
};

const queueName = 'microtask-dispatch';

export const microtaskQueue = new Queue<DispatchJobPayload>(queueName, {
  connection: redisForBull.connection,
});

const defaultJobOptions: JobsOptions = {
  removeOnComplete: true,
  removeOnFail: 50,
};

export const enqueueMicrotask = async (microtaskId: string) => {
  await microtaskQueue.add('dispatch', { microtaskId }, defaultJobOptions);
};

if (env.nodeEnv !== 'test') {
  new Worker<DispatchJobPayload>(
    queueName,
    async (job) => {
      await handleMicrotaskDispatch(job.data.microtaskId);
    },
    {
      connection: redisForBull.connection,
    }
  );
}
