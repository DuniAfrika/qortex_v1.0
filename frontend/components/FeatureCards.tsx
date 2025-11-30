import React from 'react';

type Feature = {
  title: string;
  description: string;
  statLabel: string;
  statValue: string;
  accent: string;
  dot: string;
};

const features: Feature[] = [
  {
    title: 'Fast',
    description:
      "Don't keep users waiting. Qortex finalizes inference batches in milliseconds so hardware—not consensus—is the bottleneck.",
    statLabel: 'Transactions per second',
    statValue: '2,978',
    accent: 'from-cyan-400/80 to-transparent',
    dot: 'bg-cyan-400'
  },
  {
    title: 'Decentralized',
    description:
      'Thousands of independent verifiers reach quorum, keeping results censorship resistant and auditable anywhere on the planet.',
    statLabel: 'Validator nodes',
    statValue: '819',
    accent: 'from-emerald-400/80 to-transparent',
    dot: 'bg-emerald-400'
  },
  {
    title: 'Scalable',
    description:
      'Built for millions of verifications per second so fees stay microscopic and throughput keeps up with frontier AI workloads.',
    statLabel: 'Total proofs',
    statValue: '467,946,447,087',
    accent: 'from-purple-400/80 to-transparent',
    dot: 'bg-purple-400'
  },
  {
    title: 'Energy Efficient',
    description:
      'Useful Proof of Work recycles miner energy for inference, delivering net-neutral verification with detailed lifecycle reporting.',
    statLabel: 'Net carbon impact',
    statValue: '0%',
    accent: 'from-orange-400/80 to-transparent',
    dot: 'bg-orange-400'
  }
];

export const FeatureCards: React.FC = () => {
  return (
    <section
      id="features"
      className="relative z-10 bg-[#020610] py-24 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute right-0 bottom-0 h-[28rem] w-[28rem] rounded-full bg-purple-600/10 blur-[160px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.4em] text-cyan-300 uppercase">
              Live data
            </p>
            <h2 className="text-white text-4xl md:text-5xl font-semibold leading-tight mt-6">
              Made for mass adoption.
            </h2>
            <p className="text-slate-400 text-lg mt-6 max-w-md">
              Qortex fuses real-time verification with the performance envelope
              of purpose-built hardware so global applications feel instant,
              trustless, and carbon aware.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="relative rounded-[28px] bg-gradient-to-br from-slate-950/90 to-slate-900/70 border border-white/5 p-7 shadow-[0_25px_45px_rgba(2,6,23,0.55)]"
              >
                <span
                  className={`absolute left-0 top-6 bottom-6 w-1.5 rounded-full bg-gradient-to-b ${feature.accent}`}
                />
                <div className="pl-4">
                  <h3 className="text-white text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mt-3">
                    {feature.description}
                  </p>
                  <div className="mt-8">
                    <div className="flex items-baseline gap-2 text-white text-3xl font-semibold">
                      <span
                        className={`h-2 w-2 rounded-full ${feature.dot}`}
                      />
                      {feature.statValue}
                    </div>
                    <p className="text-[0.65rem] tracking-[0.35em] uppercase text-slate-500 mt-3">
                      {feature.statLabel}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

