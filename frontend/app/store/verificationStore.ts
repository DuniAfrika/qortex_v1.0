import { create } from 'zustand';

export type Vote = {
  id: string;
  nodeName: string;
  country: string;
  result: 'POSITIVE' | 'NEGATIVE';
  timestamp: number;
};

type VerificationState = {
  isVerifying: boolean;
  progress: number;
  votes: Vote[];
  finalResult: 'POSITIVE' | 'NEGATIVE' | null;
  confidence: number;
  proofHash: string | null;
  targetNodeCount: number;
  currentQuery: string | null;
  
  startVerification: (text: string, nodeCount?: number) => void;
  addVote: (vote: Vote) => void;
  reset: () => void;
  setFinalResult: (result: 'POSITIVE' | 'NEGATIVE', confidence: number, hash: string) => void;
};

export const useVerificationStore = create<VerificationState>((set) => ({
  isVerifying: false,
  progress: 0,
  votes: [],
  finalResult: null,
  confidence: 0,
  proofHash: null,
  targetNodeCount: 140, // Default
  currentQuery: null,

  startVerification: (text, nodeCount = 140) => set({ 
    isVerifying: true, 
    progress: 0, 
    votes: [], 
    finalResult: null,
    confidence: 0,
    proofHash: null,
    targetNodeCount: nodeCount,
    currentQuery: text
  }),

  addVote: (vote) => set((state) => {
    const newProgress = Math.min(100, state.progress + (100 / state.targetNodeCount));
    return { 
      votes: [vote, ...state.votes],
      progress: newProgress
    };
  }),

  reset: () => set({ 
    isVerifying: false, 
    progress: 0, 
    votes: [], 
    finalResult: null 
  }),

  setFinalResult: (result, confidence, hash) => set({
    isVerifying: false,
    progress: 100,
    finalResult: result,
    confidence,
    proofHash: hash
  })
}));
