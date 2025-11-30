import React from 'react';
import { Activity, Users, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatsCard = ({ title, value, sub, icon: Icon, color }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <p className={`text-xs mt-1 ${color}`}>{sub}</p>
    </div>
    <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
      <Icon className="w-5 h-5" />
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero / Action */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="z-10">
            <h1 className="text-3xl font-bold text-white mb-2">Decentralized AI Verification</h1>
            <p className="text-slate-400 max-w-xl">
                Submit tasks to the Qortex network. Miners verify outputs via consensus, ensuring trustless AI execution.
            </p>
        </div>
        <Link to="/submit" className="z-10 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all transform hover:scale-105 flex items-center gap-2">
            Submit New Task
            <Activity className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Miners Online" value="5" sub="Network Healthy" icon={Users} color="text-emerald-400" />
        <StatsCard title="Tasks Today" value="42" sub="+12% vs yesterday" icon={CheckCircle} color="text-cyan-400" />
        <StatsCard title="Consensus Acc." value="98.2%" sub="High fidelity" icon={Activity} color="text-purple-400" />
        <StatsCard title="Avg Latency" value="1.2s" sub="Global" icon={Clock} color="text-yellow-400" />
      </div>

      {/* Recent Tasks */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-white">Recent Network Activity</h3>
            <button className="text-xs text-cyan-500 hover:text-cyan-400">View All</button>
        </div>
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-500">
                <tr>
                    <th className="p-4 font-normal">Task ID</th>
                    <th className="p-4 font-normal">Type</th>
                    <th className="p-4 font-normal">Status</th>
                    <th className="p-4 font-normal">Result</th>
                    <th className="p-4 font-normal">Time</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono text-cyan-400">#7f231a</td>
                    <td className="p-4 text-slate-300">Sentiment Analysis</td>
                    <td className="p-4"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">Completed</span></td>
                    <td className="p-4 text-emerald-300">Positive (80%)</td>
                    <td className="p-4 text-slate-500">2 min ago</td>
                </tr>
                 <tr className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono text-cyan-400">#43ae90</td>
                    <td className="p-4 text-slate-300">Toxicity Check</td>
                    <td className="p-4"><span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">Running</span></td>
                    <td className="p-4 text-slate-500">—</td>
                    <td className="p-4 text-slate-500">5 min ago</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono text-cyan-400">#98b3d1</td>
                    <td className="p-4 text-slate-300">Sentiment Analysis</td>
                    <td className="p-4"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">Completed</span></td>
                    <td className="p-4 text-red-300">Negative (60%)</td>
                    <td className="p-4 text-slate-500">12 min ago</td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};