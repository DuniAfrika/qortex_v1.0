"use client";

import Image from "next/image";
import VerifyForm from "../components/VerifyForm";
import LiveFeed from "../components/LiveFeed";
import ResultCard from "../components/ResultCard";
import { useVerificationStore } from "../store/verificationStore";
import { Progress } from "@radix-ui/react-progress"; // Or simple div if not installed
// I will use a simple div for progress for now to be safe, or check if I installed it.
// I installed @radix-ui/react-progress.

export default function DashboardPage() {
  const { isVerifying, progress, finalResult, currentQuery } = useVerificationStore();
  const hasStarted = isVerifying || finalResult;

  return (
    <div className="flex flex-col h-full relative">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-32 px-4 scroll-smooth">
        <div className="max-w-5xl mx-auto space-y-8 pt-8">
          
          {/* User Query Bubble */}
          {hasStarted && currentQuery && (
            <div className="flex justify-end animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-qubic-charcoal-light border border-white/10 rounded-2xl rounded-tr-sm px-6 py-4 max-w-[80%] max-h-96 overflow-y-auto no-scrollbar">
                <p className="text-qubic-cream font-glacial text-lg break-words">{currentQuery}</p>
              </div>
            </div>
          )}

          {isVerifying && (
            <div className="w-full space-y-2 animate-in fade-in duration-500">
              <div className="flex justify-between text-xs font-mono text-qubic-cream/50 uppercase tracking-widest">
                <span>Consensus Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-qubic-charcoal-light rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <LiveFeed />
        </div>
      </div>

      {/* Result Popover Overlay */}
      {finalResult && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={() => useVerificationStore.getState().reset()}
              className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <ResultCard />
          </div>
        </div>
      )}

      {/* Input Area - Centered Initial vs Fixed Bottom */}
      <div 
        className={`absolute z-50 transition-all duration-700 ease-in-out px-4 w-full ${
          hasStarted 
            ? "bottom-0 left-0 right-0 bg-gradient-to-t from-qubic-charcoal via-qubic-charcoal to-transparent pt-10 pb-6" 
            : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-5xl"
        }`}
      >
        {!hasStarted && (
          <div className="text-center mb-10 animate-in fade-in zoom-in-95 duration-700">
            <h1 className="text-5xl font-francy text-qubic-cream mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] flex flex-col items-center justify-center gap-4">
              <span>Trustless sentiment analysis powered by</span>
              <div className="relative h-12 w-40">
                <Image 
                  src="/Qubic-Logo-White.svg" 
                  alt="Qubic" 
                  fill 
                  className="object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                />
              </div>
            </h1>
          </div>
        )}
        
        <VerifyForm />
      </div>
    </div>
  );
}
