"use client";

import { useEffect, useRef } from "react";
import { useVerificationStore } from "../store/verificationStore";
import { Check, X } from "lucide-react";

export default function LiveFeed() {
  const { votes, isVerifying, addVote, setFinalResult, targetNodeCount } = useVerificationStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fake vote streaming logic
  useEffect(() => {
    if (!isVerifying) return;

    let count = 0;
    const maxVotes = targetNodeCount;
    
    const interval = setInterval(() => {
      count++;
      
      const isPositive = Math.random() > 0.05; // 5% chance of negative (outlier)
      const country = ["Germany", "Japan", "USA", "Korea", "Brazil", "France"][Math.floor(Math.random() * 6)];
      const nodeName = `Node ${Math.floor(Math.random() * 1000)}`;

      addVote({
        id: Math.random().toString(36).substr(2, 9),
        nodeName,
        country,
        result: isPositive ? "POSITIVE" : "NEGATIVE",
        timestamp: Date.now(),
      });

      if (count >= maxVotes) {
        clearInterval(interval);
        setFinalResult("POSITIVE", 96.2, "0x" + Math.random().toString(16).substr(2, 40));
      }
    }, 150); // Fast stream

    return () => clearInterval(interval);
  }, [isVerifying, addVote, setFinalResult, targetNodeCount]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0; // Scroll to top since we prepend votes
    }
  }, [votes]);

  if (!isVerifying && votes.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h3 className="text-qubic-cream/50 font-francy mb-2">Live Node Consensus</h3>
      <div className="h-64 bg-qubic-charcoal-light/50 rounded-lg border border-white/5 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto p-4 space-y-2 no-scrollbar" ref={scrollRef}>
          {votes.map((vote) => (
            <div 
              key={vote.id} 
              className="flex items-center justify-between p-2 rounded bg-qubic-charcoal/50 border border-white/5 animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div className="flex items-center gap-3">
                <span className="text-qubic-cream/60 text-sm font-mono">{vote.nodeName}</span>
                <span className="text-qubic-cream/40 text-xs">({vote.country})</span>
              </div>
              <div className={`flex items-center gap-2 ${vote.result === 'POSITIVE' ? 'text-white' : 'text-red-400 line-through opacity-70'}`}>
                {vote.result === 'POSITIVE' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                <span className="font-glacial text-sm">{vote.result}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
