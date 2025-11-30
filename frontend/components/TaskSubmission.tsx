import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskType } from '../types';
import { TASK_PRESETS } from '../constants';
import { Play } from 'lucide-react';

export const TaskSubmission: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<TaskType>(TaskType.SENTIMENT);
  const [inputText, setInputText] = useState(TASK_PRESETS[TaskType.SENTIMENT].join('\n'));
  const [quorum, setQuorum] = useState(0.6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would POST to backend.
    // Here we just navigate to live view with state.
    const inputs = inputText.split('\n').filter(s => s.trim().length > 0);
    navigate(`/live`, { state: { type: selectedType, inputs, quorum } });
  };

  const handleTypeChange = (type: TaskType) => {
    setSelectedType(type);
    if (TASK_PRESETS[type]) {
      setInputText(TASK_PRESETS[type].join('\n'));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          Submit Verification Task
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Type */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Task Type</label>
            <div className="flex gap-3">
              {Object.values(TaskType).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                    selectedType === type
                      ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(8,145,178,0.4)]'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Input Data */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Input Samples (One per line)
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-40 bg-slate-950 border border-slate-800 rounded p-3 text-slate-300 font-mono text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none"
            />
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Required Quorum</label>
                <select 
                    value={quorum} 
                    onChange={(e) => setQuorum(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300 focus:border-cyan-500 outline-none"
                >
                    <option value={0.5}>50% (Fastest)</option>
                    <option value={0.6}>60% (Standard)</option>
                    <option value={0.8}>80% (High Security)</option>
                    <option value={1.0}>100% (Unanimous)</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Priority Fee</label>
                <div className="text-slate-500 text-sm mt-2">0.05 QUBIC (Standard)</div>
             </div>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            <Play className="w-4 h-4" />
            Launch Task
          </button>
        </form>
      </div>
    </div>
  );
};