"use client";

import { useVerificationStore } from "../store/verificationStore";
import { CheckCircle, ExternalLink } from "lucide-react";

export default function ResultCard() {
  const { finalResult, confidence, proofHash, votes } = useVerificationStore();

  if (!finalResult) return null;

  const positiveVotes = votes.filter(v => v.result === 'POSITIVE').length;
  const negativeVotes = votes.filter(v => v.result === 'NEGATIVE').length;

  return (
    <div className="w-full max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
      <div className="bg-qubic-charcoal-light border border-white/10 rounded-xl p-8 shadow-[0_0_50px_rgba(255,255,255,0.05)] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-4xl font-francy text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            {positiveVotes} Positive / {negativeVotes} Negative
          </h2>
          
          <p className="text-qubic-cream font-glacial text-xl mb-6">
            Confidence Score: <span className="text-white">{confidence}%</span>
          </p>

          <div className="bg-black/30 rounded-lg p-4 mb-6 inline-block max-w-full overflow-hidden">
            <p className="text-qubic-cream/40 text-xs font-mono mb-1">CRYPTOGRAPHIC PROOF</p>
            <p className="text-qubic-purple font-mono text-sm break-all">{proofHash}</p>
          </div>

          <div>
            <a 
              href="#" 
              className="inline-flex items-center gap-2 text-white hover:text-qubic-cream transition-colors border-b border-white/30 hover:border-white pb-0.5"
            >
              View on Qubic Explorer <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
