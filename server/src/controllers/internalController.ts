import { Request, Response } from 'express';
import { z } from 'zod';
import { recordMinerResult } from '../services/resultService';

const minerResultSchema = z.object({
  microtask_id: z.string().uuid(),
  output: z.object({ label: z.string() }).catchall(z.any()),
  nonce: z.string().min(6),
  timestamp: z.string(),
  signature: z.string().min(32),
});

export const submitMinerResultHandler = async (req: Request, res: Response) => {
  try {
    const payload = minerResultSchema.parse(req.body);
    const { minerId } = req.params;
    await recordMinerResult({
      minerId,
      microtaskId: payload.microtask_id,
      output: payload.output,
      nonce: payload.nonce,
      timestamp: payload.timestamp,
      signature: payload.signature,
    });
    res.json({ status: 'accepted' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid payload', issues: error.issues });
    }
    if (error instanceof Error) {
      if (error.message === 'invalid_signature') {
        return res.status(401).json({ message: 'Invalid signature' });
      }
      if (error.message === 'stale_result') {
        return res.status(409).json({ message: 'Result timestamp too old' });
      }
      if (error.message === 'microtask_not_found' || error.message === 'miner_not_found') {
        return res.status(404).json({ message: error.message });
      }
    }
    console.error('Failed to record miner result', error);
    res.status(500).json({ message: 'Failed to record result' });
  }
};
