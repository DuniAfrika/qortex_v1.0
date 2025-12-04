import { Activity, Server, Globe } from "lucide-react";

export default function StatsBar() {
  return (
    <div className="h-14 bg-qubic-charcoal-light flex items-center justify-center gap-12 border-b border-qubic-charcoal/50 shadow-md z-10 relative">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Server className="w-5 h-5 text-qubic-purple" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-qubic-lime rounded-full animate-pulse"></span>
        </div>
        <span className="text-qubic-cream/70 font-francy text-sm">Nodes Online</span>
        <span className="text-qubic-lime font-francy text-lg">676</span>
      </div>

      <div className="w-px h-6 bg-white/10"></div>

      <div className="flex items-center gap-3">
        <Activity className="w-5 h-5 text-qubic-neon" />
        <span className="text-qubic-cream/70 font-francy text-sm">24h Verifications</span>
        <span className="text-qubic-lime font-francy text-lg">14,209</span>
      </div>

      <div className="w-px h-6 bg-white/10"></div>

      <div className="flex items-center gap-3">
        <Globe className="w-5 h-5 text-qubic-lime" />
        <span className="text-qubic-cream/70 font-francy text-sm">Network Load</span>
        <span className="text-qubic-lime font-francy text-lg">42%</span>
      </div>
    </div>
  );
}
