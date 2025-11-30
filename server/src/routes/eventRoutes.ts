import { Router } from 'express';
import { eventBus, QortexEvent } from '../events/eventBus';

const router = Router();

router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const taskIdFilter = req.query.taskId as string | undefined;
  const minerIdFilter = req.query.minerId as string | undefined;

  const handler = (event: QortexEvent) => {
    const eventTaskId = (event.data.taskId as string) ?? null;
    const eventMinerIds = (event.data.minerIds as string[]) ?? [];

    if (taskIdFilter && taskIdFilter !== eventTaskId) {
      return;
    }

    if (minerIdFilter && !eventMinerIds.includes(minerIdFilter)) {
      return;
    }

    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  eventBus.on('event', handler);

  req.on('close', () => {
    eventBus.off('event', handler);
    res.end();
  });
});

export default router;
