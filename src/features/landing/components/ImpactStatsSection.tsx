import { useTranslation } from "react-i18next";
import { TrendingUp, Clock, Users, Building, Activity, ShieldCheck } from "lucide-react";

export function ImpactStatsSection() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const stats = [
    {
      icon: TrendingUp,
      value: "94.8%",
      label: isAr ? "معدل استبقاء وتخرج الطلاب" : "Student Retention Rate",
      sublabel: isAr ? "+18% مقارنة بالأنظمة التقليدية" : "+18% compared to traditional SIS",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      icon: Clock,
      value: "3.2x",
      label: isAr ? "سرعة إطلاق التدخل الإرشادي" : "Faster Intervention Speed",
      sublabel: isAr ? "استجابة فورية خلال أقل من 24 ساعة" : "Proactive triage in under 24 hours",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: Users,
      value: "50,000+",
      label: isAr ? "طالب يتم متابعتهم يومياً" : "Students Monitored Daily",
      sublabel: isAr ? "رصد مستمر للدرجات والحضور والسلوك" : "Continuous telemetry across cohorts",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      icon: Building,
      value: "120+",
      label: isAr ? "جامعة ومدرسة معتمدة" : "Partner Institutions",
      sublabel: isAr ? "في مختلف مناطق المملكة والخليج" : "Across regional & international networks",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    }
  ];

  return (
    <section id="impact" className="py-20 md:py-28 relative overflow-hidden bg-background">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" />
            {isAr ? "الأثر التعليمي بالأرقام" : "Measurable Institutional Impact"}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            {isAr ? "أرقام تعكس التحول الحقيقي" : "Results That Speak for Themselves"}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            {isAr
              ? "مؤشرات أداء مثبتة تعزز استقرار المؤسسة التعليمية وتحمي مسار كل طالب."
              : "Proven data-driven outcomes demonstrating lower attrition and higher student wellbeing."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-card border border-border/80 shadow-lg hover:shadow-xl hover:border-primary/40 transition-all flex flex-col justify-between group text-center sm:text-left rtl:sm:text-right"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <ShieldCheck className="w-5 h-5 text-muted-foreground/40" />
                </div>

                <div className="space-y-2">
                  <div className="text-4xl sm:text-5xl font-black tracking-tight text-foreground font-mono">
                    {stat.value}
                  </div>
                  <div className="text-base font-bold text-foreground">
                    {stat.label}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stat.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
