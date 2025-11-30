import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import taskRoutes from './routes/taskRoutes';
import minerRoutes from './routes/minerRoutes';
import internalMinerRoutes from './routes/internalRoutes';
import eventRoutes from './routes/eventRoutes';
import { env } from './config/env';
import './queue/microtaskQueue';

const app = express();
const PORT = env.port;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/miners', minerRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/internal/miner', internalMinerRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Qortex backend listening on port ${PORT}`);
});

export default app;
