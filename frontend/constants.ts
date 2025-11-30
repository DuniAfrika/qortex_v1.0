import { Miner, TaskType } from './types';

export const MOCK_MINERS: Miner[] = [
  { id: 'm-01', name: 'Miner #01', location: 'Kenya', lat: -1.2921, lng: 36.8219, status: 'online' },
  { id: 'm-02', name: 'Miner #02', location: 'Canada', lat: 56.1304, lng: -106.3468, status: 'online' },
  { id: 'm-03', name: 'Miner #03', location: 'Germany', lat: 51.1657, lng: 10.4515, status: 'online' },
  { id: 'm-04', name: 'Miner #04', location: 'Japan', lat: 36.2048, lng: 138.2529, status: 'online' },
  { id: 'm-05', name: 'Miner #05', location: 'Brazil', lat: -14.2350, lng: -51.9253, status: 'online' },
];

export const INITIAL_LOGS = [
  { timestamp: '13:00:01', message: 'System initialized. Node network active.', type: 'info' },
  { timestamp: '13:00:05', message: 'Peer discovery: 5 nodes connected.', type: 'info' },
  { timestamp: '13:00:12', message: 'Consensus engine ready. Waiting for tasks...', type: 'success' },
] as const;

export const TASK_PRESETS = {
  [TaskType.SENTIMENT]: [
    "Qubic is the future of compute!",
    "Not sure if Qubic is ready...",
    "Qortex demo looks incredible.",
    "The latency is too high on this network.",
    "Bullish on distributed AI verification!"
  ],
  [TaskType.TOXICITY]: [
    "You are the best!",
    "I hate everything about this.",
    "This is completely useless garbage.",
    "Have a nice day."
  ]
};