import { v4 as uuid } from 'uuid';

type TaskType = 'sentiment';

interface CreateTaskInput {
  type: TaskType;
  inputs: string[];
  requiredQuorum?: number;
}

interface TaskSummary {
  task_id: string;
  status: 'queued';
  microtask_count: number;
}

const inMemoryTasks: Record<string, TaskSummary & { inputs: string[] }> = {};

export const createTask = async ({ type, inputs, requiredQuorum = 0.6 }: CreateTaskInput): Promise<TaskSummary> => {
  if (type !== 'sentiment') {
    throw new Error('Unsupported task type');
  }

  if (!Array.isArray(inputs) || inputs.length === 0 || inputs.length > 5) {
    throw new Error('inputs must contain 1-5 tweets');
  }

  const taskId = uuid();
  const microtaskCount = inputs.length;

  const task: TaskSummary & { inputs: string[] } = {
    task_id: taskId,
    status: 'queued',
    microtask_count: microtaskCount,
    inputs,
  };

  inMemoryTasks[taskId] = task;

  // TODO: persist task, create microtasks, enqueue jobs
  console.log('Queued task', { taskId, microtaskCount, requiredQuorum });

  return task;
};

export const getTaskById = async (taskId: string): Promise<TaskSummary | null> => {
  return inMemoryTasks[taskId] ?? null;
};
