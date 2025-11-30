import React from 'react';
import { Miner, MinerResult } from '../types';

interface WorldMapProps {
  miners: Miner[];
  results: Record<string, MinerResult>; // Map minerId -> Result
}

export const WorldMap: React.FC<WorldMapProps> = ({ miners, results }) => {
  // Simple abstract map points. In a real app, use D3 with GeoJSON.
  // We will map lat/long roughly to percentage for a static SVG background.
  
  const project = (lat: number, lng: number) => {
    // Mercator-ish projection for simple display
    const x = (lng + 180) * (100 / 360);
    const y = ((-lat + 90) * (100 / 180)); 
    return { x, y };
  };

  return (
    <div className="relative w-full h-48 bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
      {/* Abstract Map Background Grid */}
      <div className="absolute inset-0 opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }}>
      </div>
      
      {/* World Map Silhouette (simplified SVG) */}
      <svg className="absolute inset-0 w-full h-full text-slate-800 fill-current opacity-50" viewBox="0 0 100 50" preserveAspectRatio="none">
         {/* Very rough world approximation polygons */}
         <path d="M20,10 Q30,5 40,10 T60,15 T80,10 T90,20 L95,40 L50,45 L10,35 Z" />
      </svg>

      {/* Nodes */}
      {miners.map(miner => {
        const { x, y } = project(miner.lat, miner.lng);
        const result = results[miner.id];
        
        let colorClass = "bg-slate-500";
        if (result) {
            colorClass = result.isDissenter ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]";
        } else if (miner.status === 'online') {
            colorClass = "bg-cyan-500";
        }

        return (
          <div 
            key={miner.id}
            className={`absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-slate-900 transition-all duration-500 ${colorClass}`}
            style={{ left: `${x}%`, top: `${y}%` }}
            title={`${miner.name} (${miner.location})`}
          >
             {result && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-slate-900 px-1 rounded whitespace-nowrap text-slate-300 border border-slate-700">
                    {miner.location}
                </div>
             )}
          </div>
        );
      })}
    </div>
  );
};