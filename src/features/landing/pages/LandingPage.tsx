import { LandingNavbar } from "../components/LandingNavbar";
import { HeroSection } from "../components/HeroSection";
import { ServicesSection } from "../components/ServicesSection";
import { HowItWorksSection } from "../components/HowItWorksSection";
import { InstitutionsSection } from "../components/InstitutionsSection";
import { ImpactStatsSection } from "../components/ImpactStatsSection";
import { ContactSection } from "../components/ContactSection";
import { LandingFooter } from "../components/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary transition-colors duration-300 relative overflow-x-hidden">
      {/* Floating Modern Navbar */}
      <LandingNavbar />

      {/* Main Sections Content */}
      <main>
        <HeroSection />
        <ServicesSection />
        <HowItWorksSection />
        <InstitutionsSection />
        <ImpactStatsSection />
        <ContactSection />
      </main>

      {/* Modern Detailed Footer */}
      <LandingFooter />
    </div>
  );
}
