"use client";

import { useState, useRef } from "react";
import { useVerificationStore } from "../store/verificationStore";
import { Send, Plus } from "lucide-react";

export default function VerifyForm() {
  const { startVerification, isVerifying } = useVerificationStore();
  const [text, setText] = useState("");
  const [nodeCount, setNodeCount] = useState(140);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVerify = () => {
    if (!text) return;
    startVerification(text, nodeCount);
    setText("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <div className="relative bg-qubic-charcoal-light border border-white/10 rounded-2xl shadow-lg overflow-hidden focus-within:border-white focus-within:ring-1 focus-within:ring-white transition-all flex flex-col">
        
        {/* Top Bar with Node Controls */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
            <span className="text-sm text-qubic-cream font-mono uppercase tracking-wider">Nodes Online: <span className="text-white font-bold text-base">676</span></span>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-sm text-qubic-cream font-glacial uppercase tracking-wider">Select Nodes:</label>
            <input 
              type="number" 
              value={nodeCount}
              onChange={(e) => setNodeCount(Number(e.target.value))}
              className="bg-black/20 border border-white/10 rounded px-3 py-1 text-base text-white font-mono w-20 text-center focus:outline-none focus:border-white"
              min="1"
              max="676"
            />
          </div>
        </div>

        <div className="flex items-end w-full">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 m-2 text-qubic-cream/50 hover:text-qubic-cream hover:bg-white/5 rounded-lg transition-colors"
            title="Upload CSV or Text file"
          >
            <Plus className="w-5 h-5" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.txt,.json"
            className="hidden"
          />

        <div className="relative w-full">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleVerify();
              }
            }}
            placeholder="Message Qortex..."
            className={`w-full py-4 pr-16 bg-transparent text-qubic-cream font-glacial placeholder:text-qubic-cream/30 focus:outline-none resize-none no-scrollbar transition-all duration-300 ${
              isExpanded ? "h-96 overflow-y-auto" : "h-32 overflow-hidden"
            }`}
            rows={1}
          />
          
          {text.length > 200 && !isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-qubic-charcoal-light to-transparent flex items-end justify-center pb-2 pointer-events-none">
              <button 
                onClick={() => setIsExpanded(true)}
                className="pointer-events-auto bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-1 rounded-full backdrop-blur-sm transition-colors"
              >
                Read More
              </button>
            </div>
          )}

          {isExpanded && (
             <button 
                onClick={() => setIsExpanded(false)}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-1 rounded-full backdrop-blur-sm transition-colors z-10"
              >
                Show Less
              </button>
          )}
          
          <button
            onClick={handleVerify}
            disabled={isVerifying || !text}
            className={`absolute bottom-2 right-2 p-2 bg-white rounded-lg text-black transition-all duration-300 z-20 ${
              isVerifying || !text
                ? "opacity-50 cursor-not-allowed bg-white/10 text-white/50"
                : "hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        </div>
      </div>
      
      <div className="text-center mt-2">
        <p className="text-[10px] text-qubic-cream/30 font-glacial">
          Qortex can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
