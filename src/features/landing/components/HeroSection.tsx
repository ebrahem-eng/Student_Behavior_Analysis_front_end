import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  BrainCircuit, 
  Users, 
  GraduationCap 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/15 to-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Centered Hero Content */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold tracking-wide shadow-sm animate-in fade-in duration-700">
            <Sparkles className="w-4 h-4 text-primary animate-spin-slow" />
            <span>
              {isAr
                ? "الجيل القادم من أنظمة تحليل السلوك والأداء الأكاديمي المدعومة بالذكاء الاصطناعي"
                : "Next-Gen AI-Powered Student Behavior & Academic Intelligence"}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.15] sm:leading-[1.12]">
            {isAr ? (
              <>
                تحويل المسارات التعليمية عبر{" "}
                <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  الذكاء الاصطناعي التنبؤي
                </span>
              </>
            ) : (
              <>
                Empowering Student Trajectories with{" "}
                <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  Predictive Intelligence
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {isAr
              ? "منظومة متكاملة تربط بين الإدارة المدرسية، المعلمين، المرشدين الطلابيين، الطلاب وأولياء الأمور لتحديد مخاطر التعثر مبكراً وتقديم التدخلات العلاجية الفعالة في الوقت المناسب."
              : "A unified analytical ecosystem connecting administrators, faculty, academic advisors, students, and parents. Detect early behavioral anomalies, automate risk alerts, and drive timely academic interventions."}
          </p>

          {/* Dual Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-13 px-8 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-base shadow-xl shadow-blue-500/25 hover:shadow-indigo-500/35 transition-all group"
            >
              <Link to="/login">
                <span>{isAr ? "دخول البوابة والمتابعة" : "Launch SBA Portal"}</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-13 px-8 rounded-full border-border bg-card/60 backdrop-blur-md hover:bg-secondary text-foreground font-semibold text-base shadow-sm"
            >
              <a href="#services">
                <BrainCircuit className="w-4 h-4 mr-2 text-primary" />
                <span>{isAr ? "استكشاف إمكانيات المنصة" : "Explore Capabilities"}</span>
              </a>
            </Button>
          </div>

          {/* Supported Roles Tags */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
            <span className="opacity-70">{isAr ? "أدوار النظام المترابطة:" : "Unified Ecosystem for:"}</span>
            <Badge variant="secondary" className="rounded-full px-3 py-1 font-medium bg-secondary/80">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-500" /> Admin
            </Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1 font-medium bg-secondary/80">
              <GraduationCap className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Teacher
            </Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1 font-medium bg-secondary/80">
              <TrendingUp className="w-3.5 h-3.5 mr-1 text-purple-500" /> Advisor
            </Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1 font-medium bg-secondary/80">
              <Users className="w-3.5 h-3.5 mr-1 text-amber-500" /> Student
            </Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1 font-medium bg-secondary/80">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-rose-500" /> Parent
            </Badge>
          </div>
        </div>

        {/* Hero Visual Mockup Container with Glassmorphism Overlays */}
        <div className="mt-12 sm:mt-16 relative mx-auto max-w-6xl">
          <div className="relative rounded-2xl lg:rounded-3xl p-2 sm:p-4 bg-gradient-to-b from-white/15 via-white/5 to-transparent border border-white/20 shadow-2xl backdrop-blur-md overflow-hidden group">
            {/* Ambient inner rim glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-transparent pointer-events-none rounded-2xl" />

            {/* Generated Hero Analytics Graphic */}
            <div className="relative rounded-xl lg:rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] bg-slate-950 flex items-center justify-center">
              <img
                src="/images/hero-analytics.png"
                alt="Student Behavior Analysis AI Dashboard"
                className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
                loading="eager"
              />

              {/* Gradient Vignette Overlay for Premium Blend */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Live Metric Card 1 (Top Left) */}
            <div className="absolute -top-4 left-6 sm:left-10 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl glass bg-card/85 backdrop-blur-xl border border-border shadow-xl animate-bounce-gentle">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {isAr ? "دقة رصد التعثر المبكر" : "Early Risk Detection"}
                </p>
                <p className="text-base font-bold text-foreground flex items-center gap-1.5">
                  <span>98.4%</span>
                  <span className="text-xs font-normal text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                    +14.2% YoY
                  </span>
                </p>
              </div>
            </div>

            {/* Floating Live Metric Card 2 (Bottom Right) */}
            <div className="absolute -bottom-4 right-6 sm:right-10 hidden sm:flex items-center gap-3.5 p-4 rounded-2xl glass bg-card/85 backdrop-blur-xl border border-border shadow-xl">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {isAr ? "زمن استجابة التدخل الإرشادي" : "Intervention Speed"}
                </p>
                <p className="text-base font-bold text-foreground">
                  &lt; 24 {isAr ? "ساعة لكل حالة حرجة" : "Hours per Critical Case"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
