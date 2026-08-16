import { LandingNavbar } from "../components/LandingNavbar";
import { HeroSection } from "../components/HeroSection";
import { ServicesSection } from "../components/ServicesSection";
import { InstitutionsSection } from "../components/InstitutionsSection";
import { CtaBannerSection } from "../components/CtaBannerSection";
import { LandingFooter } from "../components/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary transition-colors duration-200">
      {/* Top Floating Pill Navigation */}
      <LandingNavbar />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <HeroSection />
        <ServicesSection />
        <InstitutionsSection />
        <CtaBannerSection />
      </main>

      {/* Structured Modern Footer */}
      <LandingFooter />
    </div>
  );
}
