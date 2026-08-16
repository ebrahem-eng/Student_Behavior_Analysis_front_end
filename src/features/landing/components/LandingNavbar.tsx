import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe, Menu, ArrowRight } from "lucide-react";
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
    { label: isAr ? "المميزات" : "Features", href: "#features" },
    { label: isAr ? "الأثر" : "Impact", href: "#impact" },
    { label: isAr ? "الشركاء" : "Partners", href: "#partners" },
  ];

  return (
    <header className="w-full sticky top-0 z-50 transition-colors duration-200 px-4 sm:px-6">
      <div className="flex justify-between items-center h-20 px-6 sm:px-8 max-w-[1280px] mx-auto bg-card/80 dark:bg-card/80 backdrop-blur-md border border-border rounded-full mt-4 shadow-lg">
        {/* Brand Logo */}
        <Link to="/" className="text-2xl font-bold text-primary tracking-wider hover:opacity-90 transition-opacity">
          SBA
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer active:scale-95 px-2 py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
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
            variant="ghost"
            className="hidden md:inline-flex text-sm font-medium text-primary hover:bg-secondary px-4 py-2 transition-colors duration-200 rounded-full"
          >
            <Link to="/login">{isAr ? "تسجيل الدخول" : "Login"}</Link>
          </Button>

          <Button
            asChild
            className="bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg rounded-full active:scale-95 px-6 h-10 text-sm"
          >
            <Link to="/login">
              <span>{isAr ? "ابدأ الآن" : "Get Started"}</span>
              <ArrowRight className="w-4 h-4 ml-1.5 rtl:mr-1.5 rtl:ml-0 rtl:rotate-180" />
            </Link>
          </Button>

          {/* Mobile Menu Trigger */}
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
                  <SheetTitle className="text-left rtl:text-right font-bold text-2xl text-primary">
                    SBA
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col space-y-3 pt-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 rounded-full text-base font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 rounded-full text-base font-medium text-primary hover:bg-secondary transition-colors"
                  >
                    {isAr ? "تسجيل الدخول" : "Login"}
                  </Link>
                </nav>
              </div>

              <div className="space-y-3 pt-6 border-t border-border">
                <Button asChild className="w-full rounded-full bg-primary text-primary-foreground py-6 text-base shadow-md">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    {isAr ? "ابدأ الآن" : "Get Started"}
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
