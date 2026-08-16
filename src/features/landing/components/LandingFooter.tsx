import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, MapPin } from "lucide-react";

export function LandingFooter() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  interface FooterLink {
    label: string;
    href: string;
    isRoute?: boolean;
  }

  interface FooterSection {
    title: string;
    links: FooterLink[];
  }

  const footerLinks: Record<string, FooterSection> = {
    product: {
      title: isAr ? "المنتج" : "Product",
      links: [
        { label: isAr ? "المميزات" : "Features", href: "#features" },
        { label: isAr ? "تحليل الأثر" : "Impact Analysis", href: "#impact" },
        { label: isAr ? "المؤسسات الشريكة" : "Partners", href: "#partners" },
        { label: isAr ? "التسعير" : "Pricing", href: "#" },
      ],
    },
    resources: {
      title: isAr ? "المصادر" : "Resources",
      links: [
        { label: isAr ? "دخول البوابة" : "Portal Access", href: "/login", isRoute: true },
        { label: isAr ? "التوثيق الفني" : "Documentation", href: "#" },
        { label: isAr ? "مركز المساعدة" : "Help Center", href: "#" },
        { label: isAr ? "المدونة" : "Blog", href: "#" },
      ],
    },
    legal: {
      title: isAr ? "القانون" : "Legal",
      links: [
        { label: isAr ? "سياسة الخصوصية" : "Privacy Policy", href: "#" },
        { label: isAr ? "شروط الخدمة" : "Terms of Service", href: "#" },
        { label: isAr ? "ملفات الارتباط" : "Cookie Policy", href: "#" },
        { label: isAr ? "FERPA التوافق" : "FERPA Compliance", href: "#" },
      ],
    },
  };

  return (
    <footer className="relative border-t border-border w-full mt-auto overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.25]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--primary) / 0.08) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Top Section */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand Column - Wider */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-extrabold tracking-wider">S</span>
              </div>
              <span className="text-xl font-extrabold text-foreground tracking-wide">SBA</span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {isAr
                ? "تمكين المعلمين والمرشدين برؤى تنبؤية ذكية لضمان تفوق ونجاح كل طالب في بيئة تعليمية آمنة."
                : "Empowering educators with predictive intelligence to ensure every student thrives in a safe and supportive learning environment."}
            </p>

            {/* Contact Info */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>support@sba-platform.edu</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{isAr ? "سان فرانسيسكو، كاليفورنيا" : "San Francisco, California"}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-2 pt-2">
              {[
                { label: "X", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                { label: "GitHub", path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-secondary/80 border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md hover:shadow-primary/15 transition-all duration-300"
                  aria-label={social.label}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section, idx) => (
            <div key={idx} className="lg:col-span-2 lg:col-start-auto">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-[0.15em] mb-5">
                {section.title}
              </h4>
              <nav className="flex flex-col gap-3">
                {section.links.map((link, linkIdx) => (
                  link.isRoute ? (
                    <Link
                      key={linkIdx}
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={linkIdx}
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  )
                ))}
              </nav>
            </div>
          ))}

          {/* Newsletter Column */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-[0.15em] mb-5">
              {isAr ? "النشرة البريدية" : "Stay Updated"}
            </h4>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {isAr
                ? "اشترك للحصول على آخر أخبار المنصة والتحديثات."
                : "Subscribe for platform updates and education insights."}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={isAr ? "بريدك الإلكتروني" : "you@school.edu"}
                className="flex-grow bg-secondary/60 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
              />
              <button className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm">
                {isAr ? "اشتراك" : "Join"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SBA Early-Warning Platform. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isAr ? "جميع الأنظمة تعمل بكفاءة" : "All systems operational"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
