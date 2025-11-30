export enum TaskStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  CONSENSUS_REACHED = 'CONSENSUS_REACHED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum TaskType {
  SENTIMENT = 'Sentiment Analysis',
  TOXICITY = 'Toxicity Check',
  SPAM = 'Spam Detection'
}

export interface Miner {
  id: string;
  name: string;
  location: string; // e.g., "Kenya", "Canada"
  lat: number;
  lng: number;
  status: 'online' | 'busy' | 'offline';
}

export interface MinerResult {
  minerId: string;
  output: string; // "Positive", "Negative"
  latency: number; // ms
  hash: string;
  timestamp: number;
  isDissenter: boolean;
}

export interface Microtask {
  id: string;
  input: string;
  results: MinerResult[];
  consensusOutput: string | null;
  status: 'pending' | 'completed';
}

export interface QortexTask {
  id: string;
  type: TaskType;
  status: TaskStatus;
  createdAt: number;
  inputData: string[];
  microtasks: Microtask[];
  requiredQuorum: number; // 0.0 to 1.0
  finalResult?: string;
  confidence?: number;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}