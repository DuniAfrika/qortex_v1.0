import Link from "next/link";

export default function HistoryPage() {
  // Fake history data
  const history = [
    { id: 1, text: "Verify this tweet about Qubic...", result: "POSITIVE", confidence: 98.5, date: "2 mins ago" },
    { id: 2, text: "Check this contract address...", result: "NEGATIVE", confidence: 92.1, date: "1 hour ago" },
    { id: 3, text: "Is this news article real?", result: "POSITIVE", confidence: 89.4, date: "3 hours ago" },
  ];

  return (
    <div className="h-full overflow-y-auto pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-francy text-qubic-cream">Verification History</h1>
          <Link href="/dashboard" className="text-white hover:underline font-glacial">
            &larr; Back to Verify
          </Link>
        </div>

        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="bg-qubic-charcoal-light border border-white/5 p-6 rounded-lg hover:border-white/20 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-sm font-bold px-2 py-1 rounded ${item.result === 'POSITIVE' ? 'bg-white/20 text-white' : 'bg-red-500/10 text-red-400'}`}>
                  {item.result}
                </span>
                <span className="text-qubic-cream/40 text-xs">{item.date}</span>
              </div>
              <p className="text-qubic-cream/80 font-glacial text-lg mb-2 truncate">{item.text}</p>
              <div className="flex items-center gap-4 text-sm text-qubic-cream/50">
                <span>Confidence: {item.confidence}%</span>
                <span className="group-hover:text-white transition-colors">View Proof &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
