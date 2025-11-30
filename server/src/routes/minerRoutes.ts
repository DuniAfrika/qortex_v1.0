import { Router } from 'express';
import { registerMinerHandler } from '../controllers/minerController';

const router = Router();

router.post('/register', registerMinerHandler);

export default router;
