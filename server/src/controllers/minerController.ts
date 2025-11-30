import { Request, Response } from 'express';
import { z } from 'zod';
import { registerMiner } from '../services/minerService';

const registerSchema = z.object({
  node_id: z.string().min(3),
  address: z.string().optional(),
});

export const registerMinerHandler = async (req: Request, res: Response) => {
  try {
    const payload = registerSchema.parse(req.body);
    const miner = await registerMiner({ nodeId: payload.node_id, address: payload.address });
    res.json({ miner_id: miner.id, node_id: miner.nodeId, status: miner.status });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid payload', issues: error.issues });
    }
    console.error('Miner registration failed', error);
    res.status(500).json({ message: 'Failed to register miner' });
  }
};
