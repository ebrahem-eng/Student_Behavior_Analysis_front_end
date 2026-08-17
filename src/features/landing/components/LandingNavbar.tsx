import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe, Menu, ArrowRight, Sparkles, LogIn, Shield, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

export function LandingNavbar() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const isAr = i18n.language === "ar";

  const toggleLanguage = () => {
    const newLang = isAr ? "en" : "ar";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  const navLinks = [
    { label: isAr ? "المميزات والأنظمة" : "Features", href: "#features", icon: Sparkles },
    { label: isAr ? "المؤسسات الشريكة" : "Partners", href: "#partners", icon: Shield },
    { label: isAr ? "تحليل الأثر" : "Impact", href: "#impact", icon: Users },
    { label: isAr ? "تواصل معنا" : "Contact", href: "#contact", icon: Mail },
  ];

  return (
    <header className="w-full sticky top-0 z-50 transition-all duration-300 px-3 sm:px-6 pt-3 sm:pt-4">
      <div className="flex justify-between items-center h-16 sm:h-20 px-4 sm:px-7 max-w-[1280px] mx-auto bg-card/85 dark:bg-card/80 backdrop-blur-xl border border-border/80 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)] transition-all duration-300">
        
        {/* Brand Logo & Tag */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-extrabold text-base tracking-wider shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
              SBA
            </span>
            <span className="hidden sm:inline-block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest -mt-1">
              {isAr ? "نظام الإنذار المبكر" : "Early Warning AI"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-secondary/50 border border-border/60 rounded-full p-1.5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card hover:shadow-xs px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer active:scale-95"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls & CTAs */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Theme Toggle */}
          <ThemeToggle className="rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" />

          {/* Language Switcher Pill */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary border border-border/70 transition-all duration-200 active:scale-95"
            title={isAr ? "Switch to English" : "التبديل إلى العربية"}
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span>{isAr ? "EN" : "العربية"}</span>
          </button>

          {/* Login Button */}
          <Button
            asChild
            variant="ghost"
            className="hidden lg:inline-flex text-xs sm:text-sm font-semibold text-foreground hover:text-primary hover:bg-secondary/70 px-4 py-2 rounded-full transition-colors"
          >
            <Link to="/login" className="flex items-center gap-1.5">
              <LogIn className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{isAr ? "تسجيل الدخول" : "Login"}</span>
            </Link>
          </Button>

          {/* Primary CTA */}
          <Button
            asChild
            className="bg-primary text-primary-foreground font-semibold hover:opacity-95 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 rounded-full active:scale-95 px-5 sm:px-6 h-9 sm:h-11 text-xs sm:text-sm group"
          >
            <Link to="/login" className="flex items-center gap-1.5">
              <span>{isAr ? "ابدأ الآن" : "Get Started"}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-transform duration-200" />
            </Link>
          </Button>

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary"
                aria-label="Open Menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-border text-foreground flex flex-col justify-between p-6 w-[300px] sm:w-[360px]">
              <div className="space-y-6 mt-4">
                <SheetHeader className="text-left rtl:text-right">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-sm shadow-md">
                      S
                    </div>
                    <div>
                      <SheetTitle className="text-xl font-bold text-foreground">
                        SBA Platform
                      </SheetTitle>
                      <p className="text-xs text-muted-foreground">
                        {isAr ? "المنظومة التعليمية الذكية" : "Smart Behavioral Analytics"}
                      </p>
                    </div>
                  </div>
                </SheetHeader>

                {/* Mobile Nav Links */}
                <nav className="flex flex-col space-y-2 pt-4">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/70 border border-transparent hover:border-border transition-all duration-200"
                      >
                        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{link.label}</span>
                      </a>
                    );
                  })}
                  
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-foreground hover:bg-secondary/70 border border-border/60 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-xl bg-secondary text-foreground flex items-center justify-center">
                      <LogIn className="w-4 h-4" />
                    </div>
                    <span>{isAr ? "تسجيل الدخول" : "Login"}</span>
                  </Link>
                </nav>
              </div>

              {/* Mobile Drawer Footer Controls */}
              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {isAr ? "المظهر واللغة" : "Preferences"}
                  </span>
                  <div className="flex items-center gap-2">
                    <ThemeToggle className="rounded-full" />
                    <button
                      onClick={toggleLanguage}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground bg-secondary border border-border transition-colors"
                    >
                      {isAr ? "EN" : "العربية"}
                    </button>
                  </div>
                </div>

                <Button asChild className="w-full rounded-full bg-primary text-primary-foreground py-6 text-sm font-bold shadow-lg shadow-primary/20">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2">
                    <span>{isAr ? "ابدأ الآن مجاناً" : "Get Started Free"}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
