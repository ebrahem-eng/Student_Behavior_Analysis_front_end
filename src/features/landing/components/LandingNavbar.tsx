import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe, Menu, Sparkles, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

export function LandingNavbar() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  const navLinks = [
    { label: i18n.language === "ar" ? "المميزات والخدمات" : "Services & Features", href: "#services" },
    { label: i18n.language === "ar" ? "كيف يعمل النظام" : "How It Works", href: "#how-it-works" },
    { label: i18n.language === "ar" ? "الشركاء والجامعات" : "Institutions", href: "#institutions" },
    { label: i18n.language === "ar" ? "الأثر والنتائج" : "Impact & Metrics", href: "#impact" },
    { label: i18n.language === "ar" ? "اتصل بنا" : "Contact Us", href: "#contact" },
  ];

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 rounded-full glass bg-card/60 backdrop-blur-xl border border-border shadow-xl transition-all duration-300">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              SBA Platform
            </span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest hidden sm:inline">
              Student Behavior Analysis
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/70 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle className="rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary" />

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary"
            title="Switch Language"
          >
            <Globe className="w-4 h-4" />
          </Button>

          <Button
            asChild
            className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 px-5 hidden sm:inline-flex group"
          >
            <Link to="/login">
              <span>{i18n.language === "ar" ? "تسجيل الدخول" : "Sign In"}</span>
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
            </Link>
          </Button>

          {/* Mobile Navigation Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full text-muted-foreground hover:text-foreground"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-border text-foreground flex flex-col justify-between">
              <div className="space-y-6 mt-6">
                <SheetHeader>
                  <SheetTitle className="text-left rtl:text-right flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white">
                      <Activity className="w-5 h-5" />
                    </div>
                    <span>SBA Platform</span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col space-y-2 pt-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="space-y-3 pt-6 border-t border-border">
                <Button asChild className="w-full rounded-xl bg-primary text-primary-foreground py-6 text-base shadow-md">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    {i18n.language === "ar" ? "تسجيل الدخول إلى البوابة" : "Access Portal"}
                  </Link>
                </Button>
                <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure Cloud AI
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> v2.4 Enterprise
                  </span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
}
