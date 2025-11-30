import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import taskRoutes from './routes/taskRoutes';
import { env } from './config/env';

const app = express();
const PORT = env.port;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/tasks', taskRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Qortex backend listening on port ${PORT}`);
});

export default app;
