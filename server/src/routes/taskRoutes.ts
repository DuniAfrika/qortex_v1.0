import { Router } from 'express';
import { createTaskHandler, getTaskHandler } from '../controllers/taskController';
import { apiKeyAuth } from '../middleware/apiKey';

const router = Router();

router.use(apiKeyAuth);

router.post('/', createTaskHandler);
router.get('/:taskId', getTaskHandler);

export default router;
