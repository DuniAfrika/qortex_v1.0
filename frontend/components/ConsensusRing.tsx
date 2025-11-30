import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface ConsensusRingProps {
  agreeCount: number;
  disagreeCount: number;
  total: number;
  label?: string;
  subLabel?: string;
}

export const ConsensusRing: React.FC<ConsensusRingProps> = ({ agreeCount, disagreeCount, total, label, subLabel }) => {
  const pending = total - (agreeCount + disagreeCount);
  
  const data = [
    { name: 'Agree', value: agreeCount, color: '#10b981' }, // Emerald 500
    { name: 'Disagree', value: disagreeCount, color: '#ef4444' }, // Red 500
    { name: 'Pending', value: pending, color: '#334155' }, // Slate 700
  ];

  const percentage = total > 0 ? Math.round((agreeCount / (agreeCount + disagreeCount || 1)) * 100) : 0;

  return (
    <div className="h-64 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-slate-100">{percentage}%</span>
        <span className="text-xs uppercase tracking-widest text-slate-400">{label || 'Consensus'}</span>
        {subLabel && <span className="text-xs text-cyan-500 mt-1">{subLabel}</span>}
      </div>
    </div>
  );
};