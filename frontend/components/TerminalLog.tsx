import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface TerminalLogProps {
  logs: LogEntry[];
}

export const TerminalLog: React.FC<TerminalLogProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-xs h-64 overflow-y-auto shadow-inner">
      <div className="text-slate-500 mb-2 border-b border-slate-800 pb-1 sticky top-0 bg-slate-900">
        &gt; SYSTEM_LOGS --tail -f
      </div>
      <div className="space-y-1">
        {logs.map((log, idx) => (
          <div key={idx} className="flex gap-2">
            <span className="text-slate-500">[{log.timestamp}]</span>
            <span className={`${
              log.type === 'error' ? 'text-red-500' :
              log.type === 'warning' ? 'text-yellow-500' :
              log.type === 'success' ? 'text-emerald-400' :
              'text-cyan-300'
            }`}>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};