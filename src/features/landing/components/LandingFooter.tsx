import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Activity, 
  ShieldCheck, 
  ArrowUp, 
  Sparkles
} from "lucide-react";

export function LandingFooter() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-card border-t border-border pt-16 pb-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-border">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-foreground">
                SBA Platform
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {isAr
                ? "المنصة الرائدة في التحليل التنبؤي لسلوك وأداء الطلاب، مصممة لربط الحرم المدرسي والجامعي بنظام بيئي ذكي يحقق التميز الأكاديمي والتدخل المبكر."
                : "The leading AI predictive platform for student behavioral and academic intelligence. Empowering institutions with early intervention pipelines and unified portal synergy."}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> FERPA & ISO 27001
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-primary" /> AI Powered
              </span>
            </div>
          </div>

          {/* Column 1: Five Roles Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {isAr ? "بوابات النظام الخمس" : "5 Role Portals"}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  {isAr ? "بوابة الإدارة المدرسية" : "Administrator Portal"}
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  {isAr ? "بوابة المعلم والرصد الصفي" : "Teacher Classroom Hub"}
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  {isAr ? "بوابة المرشد الأكاديمي" : "Academic Advisor Roster"}
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  {isAr ? "بوابة الطالب والتسجيل" : "Student Dashboard"}
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  {isAr ? "بوابة الأسرة وولي الأمر" : "Family & Parent Portal"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform Capabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {isAr ? "قدرات المنصة" : "Capabilities"}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#services" className="hover:text-primary transition-colors">
                  {isAr ? "التنبؤ الذكي بالمخاطر" : "Predictive Risk Engine"}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary transition-colors">
                  {isAr ? "رصد الحضور والسلوك" : "Attendance & Telemetry"}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary transition-colors">
                  {isAr ? "المساعد الإرشادي الذكي" : "AI Copilot & Chatbot"}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary transition-colors">
                  {isAr ? "التقارير التحليلية والتصدير" : "Deep Analytical Exports"}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary transition-colors">
                  {isAr ? "مسار عمل التدخل" : "Intervention Pipeline"}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Institutional & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {isAr ? "المؤسسات والاعتماد" : "Institutional"}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#institutions" className="hover:text-primary transition-colors">
                  {isAr ? "الجامعات والمدارس الشريكة" : "Partner Campuses"}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary transition-colors">
                  {isAr ? "طلب عرض تجريبي" : "Schedule a Live Demo"}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary transition-colors">
                  {isAr ? "دعم الشركاء الفني" : "Enterprise Support"}
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  {isAr ? "توثيق حسابات التجربة" : "Mock Test Accounts"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} Student Behavior Analysis (SBA) Platform. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <span>{isAr ? "العودة للأعلى" : "Back to top"}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
