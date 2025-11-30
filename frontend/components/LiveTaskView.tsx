import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TaskStatus, MinerResult, Microtask, QortexTask, LogEntry } from '../types';
import { MOCK_MINERS } from '../constants';
import { ConsensusRing } from './ConsensusRing';
import { MinerGrid } from './MinerGrid';
import { MicrotaskHeatmap } from './MicrotaskHeatmap';
import { ProofReport } from './ProofReport';
import { TerminalLog } from './TerminalLog';
import { Loader2, Activity, FileCheck, Server, PieChart } from 'lucide-react';

export const LiveTaskView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { type: string, inputs: string[], quorum: number } | null;

  // -- STATE --
  const [task, setTask] = useState<QortexTask | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentMicrotaskIndex, setCurrentMicrotaskIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'process' | 'results'>('process');
  
  // -- REFS FOR SIMULATION --
  const simulationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -- LOG HELPER --
  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), message, type }]);
  };

  // -- INITIALIZE TASK --
  useEffect(() => {
    if (!state) {
      navigate('/submit');
      return;
    }

    const initialMicrotasks: Microtask[] = state.inputs.map((input, idx) => ({
      id: `mt-${idx}`,
      input,
      results: [],
      consensusOutput: null,
      status: 'pending'
    }));

    setTask({
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      type: state.type as any,
      status: TaskStatus.PENDING,
      createdAt: Date.now(),
      inputData: state.inputs,
      microtasks: initialMicrotasks,
      requiredQuorum: state.quorum
    });

    addLog(`Task initialized. Type: ${state.type}. Samples: ${state.inputs.length}`);
  }, [state, navigate]);


  // -- SIMULATION ENGINE --
  useEffect(() => {
    if (!task || task.status === TaskStatus.COMPLETED) return;

    if (task.status === TaskStatus.PENDING) {
        // Start running
        const t = setTimeout(() => {
            setTask(prev => prev ? { ...prev, status: TaskStatus.RUNNING } : null);
            addLog("Dispatching microtasks to Miner Network...");
        }, 1000);
        return () => clearTimeout(t);
    }

    if (task.status === TaskStatus.RUNNING) {
        // Find next pending microtask
        const nextPendingIdx = task.microtasks.findIndex(m => m.status === 'pending');
        
        if (nextPendingIdx === -1) {
             // All done
             setTask(prev => prev ? { ...prev, status: TaskStatus.COMPLETED, finalResult: 'POSITIVE' } : null); // Simple assumption
             addLog("All microtasks completed. Generating proof...", 'success');
             
             // Auto-switch to results tab after a brief moment
             setTimeout(() => setActiveTab('results'), 1500);
             
             return;
        }

        setCurrentMicrotaskIndex(nextPendingIdx);
        const currentMt = task.microtasks[nextPendingIdx];

        // If no results yet, start dispatching results one by one
        if (currentMt.results.length < MOCK_MINERS.length) {
             const delay = Math.random() * 800 + 400; // 400ms - 1200ms
             const minerIdx = currentMt.results.length;
             const miner = MOCK_MINERS[minerIdx];

             const timer = setTimeout(() => {
                // Generate mocked result
                // Introduce a dissenter for visual interest (Miner 3 usually)
                let output = "Positive";
                if (state?.type.includes("Toxicity")) output = "Clean";
                
                // Miner 3 dissents on even tasks for demo
                const isDissenter = miner.id === 'm-03' && nextPendingIdx % 2 === 0;
                if (isDissenter) output = state?.type.includes("Toxicity") ? "Toxic" : "Negative";
                
                const result: MinerResult = {
                    minerId: miner.id,
                    output,
                    latency: Math.floor(Math.random() * 500 + 200),
                    hash: Math.random().toString(16).substr(2, 8),
                    timestamp: Date.now(),
                    isDissenter
                };

                setTask(prev => {
                    if (!prev) return null;
                    const newMts = [...prev.microtasks];
                    newMts[nextPendingIdx] = {
                        ...newMts[nextPendingIdx],
                        results: [...newMts[nextPendingIdx].results, result]
                    };
                    return { ...prev, microtasks: newMts };
                });

                const logType = isDissenter ? 'warning' : 'info';
                addLog(`Miner ${miner.id} reported: ${output} (${result.latency}ms)`, logType);

             }, delay);
             return () => clearTimeout(timer);
        } else {
            // Microtask complete
             const timer = setTimeout(() => {
                setTask(prev => {
                    if (!prev) return null;
                    const newMts = [...prev.microtasks];
                    newMts[nextPendingIdx] = { ...newMts[nextPendingIdx], status: 'completed', consensusOutput: 'Positive' }; // simplified
                    return { ...prev, microtasks: newMts };
                });
                addLog(`Microtask #${nextPendingIdx+1} Consensus Reached.`, 'success');
             }, 500);
             return () => clearTimeout(timer);
        }
    }
  }, [task, state]);

  if (!task) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto w-10 h-10 text-cyan-500" /></div>;

  const currentMicrotask = task.microtasks[currentMicrotaskIndex];
  
  // Consensus Ring Data Calculation
  // For the Process view, we show the current microtask's status.
  // For the Results view, we might want aggregate or we can keep showing current/latest.
  // Let's aggregate for the Results view.
  const allResults = task.microtasks.flatMap(m => m.results);
  const totalAgree = allResults.filter(r => !r.isDissenter).length;
  const totalDisagree = allResults.filter(r => r.isDissenter).length;
  
  const currentAgree = currentMicrotask.results.filter(r => !r.isDissenter).length;
  const currentDisagree = currentMicrotask.results.filter(r => r.isDissenter).length;

  // Map Results for visualization components
  const currentResultsMap = currentMicrotask.results.reduce((acc, r) => ({...acc, [r.minerId]: r}), {});

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-lg">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-white">Task {task.id}</h1>
                    <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs border border-slate-700">{task.type}</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                        task.status === TaskStatus.RUNNING ? 'bg-cyan-900/50 text-cyan-400 animate-pulse' : 
                        task.status === TaskStatus.COMPLETED ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                        {task.status}
                    </span>
                </div>
                <p className="text-slate-500 text-sm mt-1">
                   {task.status === TaskStatus.COMPLETED 
                      ? "Verification complete. Proof generated." 
                      : `Processing Microtask ${currentMicrotaskIndex + 1} of ${task.microtasks.length}`
                   }
                </p>
            </div>
             {task.status === TaskStatus.RUNNING && (
                <div className="flex items-center gap-2 text-cyan-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Consensus Protocol Active
                </div>
            )}
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-slate-800">
            <button 
                onClick={() => setActiveTab('process')}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'process' 
                    ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5' 
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                }`}
            >
                <Activity className="w-4 h-4" />
                Live Protocol
            </button>
            <button 
                onClick={() => setActiveTab('results')}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'results' 
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                }`}
            >
                <FileCheck className="w-4 h-4" />
                Audit & Results
                {task.status === TaskStatus.COMPLETED && (
                    <span className="ml-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
            </button>
        </div>

        {/* --- VIEW: PROCESS --- */}
        {activeTab === 'process' && (
            <div className="h-[600px] grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                {/* Left Col: Queue */}
                <div className="flex flex-col h-full gap-6">
                     <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex-1 overflow-hidden flex flex-col">
                        <h3 className="text-slate-300 font-semibold mb-4 text-xs uppercase tracking-wider flex items-center gap-2 flex-shrink-0">
                            <Activity className="w-3 h-3 text-cyan-500" />
                            Live Microtask Queue
                        </h3>
                        <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {task.microtasks.map((mt, idx) => (
                                <div key={mt.id} className={`p-3 rounded border text-xs flex justify-between items-center transition-all ${
                                    idx === currentMicrotaskIndex && task.status === TaskStatus.RUNNING ? 'bg-cyan-950/30 border-cyan-900 scale-102 shadow-lg shadow-cyan-900/20' :
                                    mt.status === 'completed' ? 'bg-slate-900 border-slate-800 opacity-50' : 'bg-slate-900 border-slate-800 text-slate-600'
                                }`}>
                                    <span className="truncate max-w-[150px] font-mono">"{mt.input}"</span>
                                    {mt.status === 'completed' ? <span className="text-emerald-500 font-bold">Done</span> : 
                                     idx === currentMicrotaskIndex ? <span className="text-cyan-500 animate-pulse font-bold">Processing</span> : <span>Pending</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col: Logs & Grid */}
                <div className="lg:col-span-2 flex flex-col h-full gap-6">
                     <div className="h-64 flex-shrink-0">
                         {/* Logs moved to top-right */}
                        <TerminalLog logs={logs} />
                    </div>
                    
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex-1 overflow-hidden flex flex-col">
                         <h3 className="text-slate-300 font-semibold mb-4 text-xs uppercase tracking-wider flex items-center gap-2 flex-shrink-0">
                            <Server className="w-3 h-3 text-cyan-500" />
                            Active Miner Status
                        </h3>
                        <div className="overflow-y-auto pr-2 flex-1">
                            <MinerGrid miners={MOCK_MINERS} results={currentResultsMap} />
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- VIEW: RESULTS --- */}
        {activeTab === 'results' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {task.status !== TaskStatus.COMPLETED && (
                     <div className="p-8 border border-dashed border-slate-700 rounded-lg text-center bg-slate-900/50">
                        <Loader2 className="w-8 h-8 text-slate-600 animate-spin mx-auto mb-4" />
                        <h3 className="text-slate-400 font-semibold">Verification in Progress</h3>
                        <p className="text-slate-600 text-sm mt-1">Final reports and heatmap will be available once consensus is reached.</p>
                     </div>
                )}

                {/* Consensus Summary Row */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col relative overflow-hidden">
                        <h3 className="text-slate-300 font-semibold mb-2 text-xs uppercase tracking-wider flex items-center gap-2 z-10">
                            <PieChart className="w-3 h-3 text-emerald-500" />
                            Aggregate Consensus
                        </h3>
                        <div className="flex-1 min-h-[200px] z-10">
                            {/* We show total agree/disagree across all microtasks here */}
                            <ConsensusRing 
                                agreeCount={totalAgree} 
                                disagreeCount={totalDisagree} 
                                total={totalAgree + totalDisagree || 1}
                                subLabel="Avg Confidence" 
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-center">
                         <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wider mb-4">Performance Metrics</h3>
                         <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-slate-950 rounded border border-slate-800">
                                <div className="text-2xl font-bold text-white">{task.microtasks.length}</div>
                                <div className="text-xs text-slate-500 uppercase mt-1">Microtasks</div>
                            </div>
                            <div className="p-4 bg-slate-950 rounded border border-slate-800">
                                <div className="text-2xl font-bold text-cyan-400">{MOCK_MINERS.length}</div>
                                <div className="text-xs text-slate-500 uppercase mt-1">Miners Active</div>
                            </div>
                            <div className="p-4 bg-slate-950 rounded border border-slate-800">
                                <div className="text-2xl font-bold text-emerald-400">{(task.requiredQuorum * 100)}%</div>
                                <div className="text-xs text-slate-500 uppercase mt-1">Quorum Met</div>
                            </div>
                         </div>
                    </div>
                </div>

                {/* Microtask Heatmap - Historical View */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                     <div className="flex items-center justify-between mb-6">
                        <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                            <Activity className="w-3 h-3 text-emerald-500" />
                            Consensus Matrix (Full History)
                        </h3>
                        <span className="text-xs text-slate-500">
                             {task.microtasks.filter(m => m.status === 'completed').length} / {task.microtasks.length} Processed
                        </span>
                     </div>
                     <MicrotaskHeatmap microtasks={task.microtasks} miners={MOCK_MINERS} />
                </div>

                {/* Final Proof */}
                {task.status === TaskStatus.COMPLETED && (
                    <ProofReport task={task} />
                )}
            </div>
        )}
    </div>
  );
};