import React from 'react';
import { Microtask, Miner } from '../types';

interface MicrotaskHeatmapProps {
  microtasks: Microtask[];
  miners: Miner[];
}

export const MicrotaskHeatmap: React.FC<MicrotaskHeatmapProps> = ({ microtasks, miners }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-left">
        <thead>
          <tr>
            <th className="p-2 text-slate-500 font-normal">Input Sample</th>
            {miners.map(m => (
              <th key={m.id} className="p-2 text-center text-slate-500 font-normal">{m.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {microtasks.map((mt, idx) => (
            <tr key={mt.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
              <td className="p-2 font-mono text-slate-300 truncate max-w-[150px]" title={mt.input}>
                #{idx + 1} {mt.input.substring(0, 20)}...
              </td>
              {miners.map(m => {
                const res = mt.results.find(r => r.minerId === m.id);
                return (
                  <td key={m.id} className="p-2 text-center">
                    {!res ? (
                      <div className="w-2 h-2 rounded-full bg-slate-700 mx-auto" />
                    ) : res.isDissenter ? (
                       <div className="w-3 h-3 rounded-full bg-red-500 mx-auto shadow-[0_0_8px_rgba(239,68,68,0.6)]" title={`Dissenter: ${res.output}`} />
                    ) : (
                       <div className="w-3 h-3 rounded-full bg-emerald-500 mx-auto shadow-[0_0_8px_rgba(16,185,129,0.6)]" title={`Match: ${res.output}`} />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};