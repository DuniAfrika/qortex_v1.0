import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { createTask, getTaskById } from '../services/taskManager';

export const createTaskHandler = async (req: Request, res: Response) => {
  try {
    const { type, inputs, required_quorum: requiredQuorum } = req.body;
    const task = await createTask({ type, inputs, requiredQuorum });
    res.status(202).json(task);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: 'Invalid payload', issues: error.issues });
    }
    console.error('Failed to create task', error);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

export const getTaskHandler = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const task = await getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Failed to fetch task', error);
    res.status(500).json({ message: 'Failed to fetch task' });
  }
};
