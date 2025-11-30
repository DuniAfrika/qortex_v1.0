import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Shield, Zap, Globe, Activity, CheckCircle2, ChevronRight } from 'lucide-react';
import RippleGrid from './RippleGrid';
import { CardStack } from './CardStack';

const Counter = ({ end, duration = 2500, suffix = "", decimals = 0, separator = false, className = "" }: { end: number, duration?: number, suffix?: string, decimals?: number, separator?: boolean, className?: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      // Ease out quart
      const percentage = Math.min(progress / duration, 1);
      const ease = 1 - Math.pow(1 - percentage, 4);
      
      setCount(ease * end);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  const formatted = count.toLocaleString('en-US', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals,
      useGrouping: separator
  });

  return (
    <div className={className}>
        {formatted}{suffix}
    </div>
  );
};

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="relative z-50 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-cyan-400 to-emerald-400 p-0.5 rounded-lg">
            <div className="bg-slate-950 p-1.5 rounded-md">
                <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">QORTEX</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Protocol</a>
          <a href="#network" className="hover:text-cyan-400 transition-colors">Network</a>
          <a href="#docs" className="hover:text-cyan-400 transition-colors">Developers</a>
        </div>
        <Link 
            to="/dashboard"
            className="group bg-slate-100 hover:bg-white text-slate-900 px-5 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
            Launch App
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 text-center px-6 overflow-hidden">
        {/* Ripple Grid Background - Localized to Hero */}
        <div className="absolute inset-0 z-0 pointer-events-none">
             <RippleGrid 
              gridColor="#22d3ee"
              opacity={0.4}
              rippleIntensity={0.05}
              gridSize={5}
              gridThickness={8}
              glowIntensity={0.2}
            />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-cyan-400 text-xs font-mono mb-8 animate-in fade-in slide-in-from-top-4 duration-700 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Mainnet Alpha Live
          </div>
          
          <h1 className="max-w-4xl mx-auto text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Decentralized Truth for <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Generative AI</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 drop-shadow-lg">
            Qortex is the consensus layer for the intelligence age. We coordinate a global network of miner nodes to verify AI inference outputs, ensuring trustless, censorship-resistant computation.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
              <Link 
                  to="/dashboard"
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-lg font-bold shadow-[0_0_40px_rgba(8,145,178,0.3)] transition-all transform hover:scale-105"
              >
                  Start Verification
              </Link>
              <button className="w-full md:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 group backdrop-blur-sm">
                  Read Whitepaper
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </button>
          </div>
        </div>
      </section>

      {/* Stats Ticker */}
      <div className="border-y border-slate-800 bg-slate-900/30 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto py-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
                <Counter end={1204} separator={true} className="text-3xl font-bold text-white font-mono" />
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Active Nodes</div>
            </div>
            <div>
                <Counter end={99.9} decimals={1} suffix="%" className="text-3xl font-bold text-emerald-400 font-mono" />
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Consensus Rate</div>
            </div>
            <div>
                <Counter end={1.2} decimals={1} suffix="s" className="text-3xl font-bold text-cyan-400 font-mono" />
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Avg Latency</div>
            </div>
            <div>
                <Counter end={4.2} decimals={1} suffix="M" className="text-3xl font-bold text-white font-mono" />
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Verified Tasks</div>
            </div>
        </div>
      </div>

      {/* Feature Stack */}
      <section id="features" className="bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="mb-12 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">The Trustless Compute Layer</h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Traditional AI is a black box. Qortex opens it up by distributing verification across thousands of independent observers.
                </p>
            </div>

            <CardStack items={[
                {
                    icon: Shield,
                    title: "Censorship Resistant",
                    description: "No single entity controls the output. Distributed consensus ensures that models run exactly as intended, without hidden filters or biases injected by centralized providers."
                },
                {
                    icon: Zap,
                    title: "Verifiable Speed",
                    description: "Optimized for low-latency inference. Our proof-of-compute mechanism verifies results in milliseconds, enabling real-time applications that require both speed and trust."
                },
                {
                    icon: Globe,
                    title: "Global Distribution",
                    description: "Nodes across 40+ countries. Geographic diversity prevents localized outages and regulatory capture, creating a truly resilient intelligence network."
                }
            ]} />
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-900/30 border-t border-slate-900 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-16">How Qortex Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {/* Connector Line */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

                <div className="relative text-center">
                    <div className="w-24 h-24 mx-auto bg-slate-950 border-4 border-slate-800 rounded-full flex items-center justify-center z-10 relative mb-6">
                        <Activity className="w-10 h-10 text-cyan-500" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center font-bold text-white border border-slate-700">1</div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Submit Task</h3>
                    <p className="text-sm text-slate-400">User submits an inference request (Text, Image, Analysis) to the network via API or Dashboard.</p>
                </div>

                <div className="relative text-center">
                    <div className="w-24 h-24 mx-auto bg-slate-950 border-4 border-slate-800 rounded-full flex items-center justify-center z-10 relative mb-6">
                        <Globe className="w-10 h-10 text-emerald-500" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center font-bold text-white border border-slate-700">2</div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Miner Consensus</h3>
                    <p className="text-sm text-slate-400">Selected nodes execute the task independently. Results are hashed and compared for quorum.</p>
                </div>

                <div className="relative text-center">
                    <div className="w-24 h-24 mx-auto bg-slate-950 border-4 border-slate-800 rounded-full flex items-center justify-center z-10 relative mb-6">
                        <CheckCircle2 className="w-10 h-10 text-purple-500" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center font-bold text-white border border-slate-700">3</div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Proof Generation</h3>
                    <p className="text-sm text-slate-400">A cryptographic proof is generated, and the verified result is returned to the user instantly.</p>
                </div>
            </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-20 border-t border-slate-900 text-center px-6 relative z-10 bg-slate-950">
        <div className="max-w-3xl mx-auto">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to verify the future?</h2>
             <p className="text-slate-400 mb-10">Join thousands of developers building on the world's first decentralized verification layer.</p>
             <Link 
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-lg font-bold hover:bg-slate-200 transition-colors"
            >
                Launch Dashboard
                <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="mt-16 flex items-center justify-center gap-8 text-slate-500 text-sm">
                <a href="#" className="hover:text-white transition-colors">Documentation</a>
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">Discord</a>
                <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
            <div className="mt-8 text-slate-600 text-xs">
                © 2024 Qortex Foundation. All rights reserved.
            </div>
        </div>
      </footer>
    </div>
  );
};