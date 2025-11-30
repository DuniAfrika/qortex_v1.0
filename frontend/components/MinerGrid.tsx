import React from 'react';
import { Miner, MinerResult } from '../types';
import { Server, CheckCircle2, XCircle, Activity } from 'lucide-react';

interface MinerGridProps {
  miners: Miner[];
  results: Record<string, MinerResult>;
}

export const MinerGrid: React.FC<MinerGridProps> = ({ miners, results }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {miners.map((miner) => {
        const result = results[miner.id];
        const isCompleted = !!result;
        
        return (
          <div 
            key={miner.id} 
            className={`p-3 rounded border transition-all duration-300 ${
              isCompleted 
                ? result.isDissenter 
                    ? 'bg-red-950/20 border-red-900/50' 
                    : 'bg-emerald-950/20 border-emerald-900/50'
                : 'bg-slate-800/50 border-slate-700'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-sm">{miner.name}</span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase">{miner.location}</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Status:</span>
                <span className={isCompleted ? "text-slate-200" : "text-yellow-500 animate-pulse"}>
                  {isCompleted ? "Completed" : "Processing..."}
                </span>
              </div>
              
              {isCompleted && (
                <>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Output:</span>
                    <span className={`font-mono font-bold ${result.isDissenter ? 'text-red-400' : 'text-emerald-400'}`}>
                      {result.output}
                    </span>
                  </div>
                   <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Latency:</span>
                    <span className="text-cyan-300">{result.latency}ms</span>
                  </div>
                </>
              )}
            </div>
            
            {isCompleted && (
                <div className="mt-2 flex justify-end">
                    {result.isDissenter ? (
                        <XCircle className="w-4 h-4 text-red-500" />
                    ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                </div>
            )}
          </div>
        );
      })}
    </div>
  );
};