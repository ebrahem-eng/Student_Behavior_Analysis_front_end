import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function LandingFooter() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <footer className="bg-secondary/30 border-t border-border w-full py-12 transition-colors duration-200 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <Link to="/" className="text-2xl font-bold text-primary tracking-wider inline-block">
              SBA
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isAr
                ? "تمكين المعلمين والمرشدين برؤى تنبؤية لضمان تفوق ونجاح كل طالب."
                : "Empowering educators with predictive insights to ensure every student succeeds."}
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Twitter / X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-base font-semibold text-foreground">
              {isAr ? "المنتج" : "Product"}
            </h4>
            <nav className="flex flex-col gap-2">
              <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {isAr ? "المميزات والأنظمة" : "Features"}
              </a>
              <a href="#impact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {isAr ? "تحليل الأثر" : "Impact Analysis"}
              </a>
              <a href="#partners" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {isAr ? "المؤسسات الشريكة" : "Case Studies & Partners"}
              </a>
            </nav>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-base font-semibold text-foreground">
              {isAr ? "المصادر" : "Resources"}
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {isAr ? "دخول البوابة" : "Portal Access"}
              </Link>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {isAr ? "التوثيق الفني" : "Documentation"}
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {isAr ? "مركز المساعدة" : "Help Center"}
              </a>
            </nav>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-base font-semibold text-foreground">
              {isAr ? "الخصوصية والقانون" : "Legal"}
            </h4>
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {isAr ? "شروط الخدمة" : "Terms of Service"}
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {isAr ? "ملفات تعريف الارتباط" : "Cookie Policy"}
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} SBA Early-Warning Platform. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </div>
          <div className="flex gap-4">
            <span>{isAr ? "مصمم للتميز الأكاديمي والتعليمي" : "Built for K-12 & Higher-Ed Excellence"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
