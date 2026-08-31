import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import { SupportClient } from "@/features/support/components/SupportClient";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col font-sans">
      {/* Abstract Background Orbs for Premium Glassmorphism Feel */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse mix-blend-multiply" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[100px] animate-pulse mix-blend-multiply" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] rounded-full bg-emerald-400/5 blur-[80px] animate-pulse mix-blend-multiply" style={{ animationDuration: '12s' }} />
      </div>

      <Navbar />
      
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
        <SupportClient />
      </Suspense>
    </div>
  );
}
