"use client";

import { Header } from "@/src/features/landing/components/Header";
import { HeroSection } from "../features/landing/components/HeroCarrusel";
import { BenefitsSection } from "@/src/features/landing/components/BenefitsSection";
import { HowItWorksSection } from "../features/landing/components/HowItWorkSection";
import { StatsSection } from "@/src/features/landing/components/StatsSection";
import { AboutSection } from "@/src/features/landing/components/AboutSection";
import { ContactSection } from "@/src/features/landing/components/ContactSection";
import { Footer } from "@/src/features/landing/components/Footer";
import { 
  benefits, 
  steps, 
  stats, 
  features, 
  commitments, 
  contactInfo 
} from "@/src/features/landing/data/landing-data";

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen">
      <Header onNavigate={scrollToSection} />
      <HeroSection onNavigate={scrollToSection} />
      <BenefitsSection benefits={benefits} />
      <HowItWorksSection steps={steps} onNavigate={scrollToSection} />
      <StatsSection stats={stats} />
      <AboutSection commitments={commitments} features={features} />
      <ContactSection contactInfo={contactInfo} />
      <Footer />
    </div>
  );
}