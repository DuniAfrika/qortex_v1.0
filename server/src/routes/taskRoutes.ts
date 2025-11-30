import { Router } from 'express';
import { createTaskHandler, getTaskHandler } from '../controllers/taskController';

const router = Router();

router.post('/', createTaskHandler);
router.get('/:taskId', getTaskHandler);

export default router;
