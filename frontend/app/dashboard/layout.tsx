import Header from "../components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-qubic-charcoal text-qubic-cream font-glacial selection:bg-white selection:text-black flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col container mx-auto px-4 pt-24 pb-4 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
