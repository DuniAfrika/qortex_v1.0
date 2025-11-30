import { Router } from 'express';
import { submitMinerResultHandler } from '../controllers/internalController';

const router = Router();

router.post('/:minerId/result', submitMinerResultHandler);

export default router;
