import Navbar from "@/components/layout/Navbar";
import { HeroSection } from "@/features/home/components/HeroSection";
import { FeaturesBento } from "@/features/home/components/FeaturesBento";
import { InstructionsTimeline } from "@/features/home/components/InstructionsTimeline";
import { BottomCTA } from "@/features/home/components/BottomCTA";

export default async function Home() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col font-sans">
      <Navbar />
      
      <main className="relative z-10 flex-1 w-full">
        <HeroSection />
        <FeaturesBento />
        <InstructionsTimeline />
        <BottomCTA />
      </main>
    </div>
  );
}
