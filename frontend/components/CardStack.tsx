import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface CardProps {
  i: number;
  title: string;
  description: string;
  icon: any;
  progress: MotionValue<number>;
  range: number[];
  targetScale: number;
}

const Card: React.FC<CardProps> = ({ i, title, description, icon: Icon, progress, range, targetScale }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  const scale = useTransform(progress, range, [1, targetScale]);
  
  return (
    <div ref={container} className="h-[60vh] min-h-[600px] flex items-center justify-center sticky top-0">
      <motion.div 
        style={{ scale, top: `calc(${i * 25}px)` }} 
        className="flex flex-col relative h-[500px] w-full max-w-4xl rounded-3xl p-10 bg-slate-900 border border-slate-800 shadow-2xl origin-top overflow-hidden"
      >
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col h-full gap-8">
            <div className="flex items-center justify-between border-b border-slate-800/50 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center border border-slate-700/50">
                        <Icon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-3xl font-bold text-white tracking-tight">{title}</h3>
                </div>
                <div className="text-6xl font-bold text-slate-800 font-mono select-none">
                    0{i + 1}
                </div>
            </div>
            <p className="text-slate-400 text-xl leading-relaxed max-w-2xl">
                {description}
            </p>
            <div className="mt-auto pt-6 flex items-center gap-2 text-cyan-500 font-mono text-sm uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                Protocol Feature
            </div>
        </div>
      </motion.div>
    </div>
  )
}

export const CardStack = ({ items }: { items: any[] }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  return (
    <div ref={container} className="w-full">
      {items.map((item, i) => {
        const targetScale = 1 - ( (items.length - i) * 0.05);
        return (
            <Card 
                key={i} 
                i={i} 
                {...item} 
                progress={scrollYProgress}
                range={[i * 0.25, 1]}
                targetScale={targetScale}
            />
        )
      })}
    </div>
  )
}