"use client";

import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import QualitySection from "@/components/home/QualitySection";
import TeamSection from "@/components/home/TeamSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#060B16] font-sans selection:bg-[#007BFF] selection:text-white">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <QualitySection />
      <TeamSection />
      <Footer />
    </main>
  );
}
