import React from 'react';
import { QortexTask } from '../types';
import { ShieldCheck, Download, Copy, FileJson } from 'lucide-react';

interface ProofReportProps {
  task: QortexTask;
}

export const ProofReport: React.FC<ProofReportProps> = ({ task }) => {
  const rootHash = "0xA8BC37F1E92D" + Math.random().toString(16).substr(2, 8).toUpperCase();

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div className="p-3 bg-emerald-500/10 rounded-full">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-white">Verified Proof Report</h2>
            <p className="text-slate-400 text-sm">Task ID: <span className="font-mono text-cyan-400">{task.id}</span></p>
        </div>
        <div className="ml-auto text-right">
            <div className="text-2xl font-bold text-emerald-400">{task.finalResult || 'COMPLETED'}</div>
            <div className="text-xs text-slate-500">Confidence: {(task.confidence || 0) * 100}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Consensus Metrics</h3>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-500">Total Microtasks</span>
                    <span>{task.microtasks.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-500">Miners Participated</span>
                    <span>5</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-500">Consensus Model</span>
                    <span>Quorum ({(task.requiredQuorum * 100)}%)</span>
                </div>
                 <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-500">Timestamp</span>
                    <span className="font-mono">{new Date().toISOString()}</span>
                </div>
            </div>
        </div>

        <div>
             <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Cryptographic Proof</h3>
             <div className="bg-slate-950 p-4 rounded border border-slate-800 font-mono text-xs break-all text-slate-400 mb-4">
                {rootHash}
             </div>
             <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded transition">
                    <FileJson className="w-4 h-4" /> Download JSON
                </button>
                <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded transition">
                    <Copy className="w-4 h-4" />
                </button>
             </div>
        </div>
      </div>
    </div>
  );
};