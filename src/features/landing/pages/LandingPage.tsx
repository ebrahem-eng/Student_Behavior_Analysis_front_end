import { LandingNavbar } from "../components/LandingNavbar";
import { HeroSection } from "../components/HeroSection";
import { ServicesSection } from "../components/ServicesSection";
import { AiSimulatorSection } from "../components/AiSimulatorSection";
import { InstitutionsSection } from "../components/InstitutionsSection";
import { CtaBannerSection } from "../components/CtaBannerSection";
import { ContactSection } from "../components/ContactSection";
import { LandingFooter } from "../components/LandingFooter";
import { ScrollReveal } from "../components/ScrollReveal";
import { ScrollProgressBar } from "../components/ScrollProgressBar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary transition-colors duration-200 relative">
      {/* Top Reading Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Top Floating Pill Navigation */}
      <LandingNavbar />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Hero: fades in from below immediately */}
        <ScrollReveal direction="up" duration={0.8} distance={50}>
          <HeroSection />
        </ScrollReveal>

        {/* Services / Core Capabilities: slides up on scroll */}
        <ScrollReveal direction="up" delay={0.1}>
          <ServicesSection />
        </ScrollReveal>

        {/* Interactive AI Early-Warning Intelligence Simulator */}
        <ScrollReveal direction="up" delay={0.1}>
          <AiSimulatorSection />
        </ScrollReveal>

        {/* Institutions & Partners: slides up on scroll */}
        <ScrollReveal direction="up" delay={0.1}>
          <InstitutionsSection />
        </ScrollReveal>

        {/* CTA Banner: fades in from below */}
        <ScrollReveal direction="up" delay={0.15} distance={30}>
          <CtaBannerSection />
        </ScrollReveal>

        {/* Contact Us: slides up on scroll */}
        <ScrollReveal direction="up" delay={0.1}>
          <ContactSection />
        </ScrollReveal>
      </main>

      {/* Footer: subtle fade in */}
      <ScrollReveal direction="none" duration={0.5}>
        <LandingFooter />
      </ScrollReveal>
    </div>
  );
}
