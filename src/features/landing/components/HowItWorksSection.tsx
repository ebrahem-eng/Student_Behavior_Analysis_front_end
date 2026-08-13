import { useTranslation } from "react-i18next";
import { Database, Cpu, Users, Award, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HowItWorksSection() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const steps = [
    {
      step: "01",
      icon: Database,
      color: "from-blue-600 to-cyan-500",
      title: isAr ? "تجميع البيانات اليومية" : "Seamless Data Logging",
      description: isAr
        ? "المعلمون والإدارة يسجلون الحضور اليومي، التقييمات، والتقارير الصفية بنقرة واحدة عبر واجهات سريعة وسهلة."
        : "Faculty and administrators log daily attendance, quiz grades, and classroom behavior notes seamlessly via high-speed interfaces."
    },
    {
      step: "02",
      icon: Cpu,
      color: "from-indigo-600 to-purple-600",
      title: isAr ? "التحليل العصبي للمخاطر" : "AI Neural Risk Scoring",
      description: isAr
        ? "محرك الذكاء الاصطناعي يحلل البيانات في الوقت الفعلي ويكشف أنماط التراجع والسلوك غير المعتاد قبل تفاقمها."
        : "Our AI engine correlates data streams against historical trajectories to calculate risk indices and flag early anomalies."
    },
    {
      step: "03",
      icon: Users,
      color: "from-purple-600 to-pink-600",
      title: isAr ? "التدخل التنسيقي الفوري" : "Multi-Role Intervention",
      description: isAr
        ? "توجيه إشعارات فورية للمرشد الطلابي لجدولة جلسة دعم، مع إشعار ولي الأمر وتوجيه إرشادات للطالب."
        : "Automated alerts route to the assigned academic advisor, sync with parent dashboards, and provide student recovery roadmaps."
    },
    {
      step: "04",
      icon: Award,
      color: "from-emerald-600 to-teal-500",
      title: isAr ? "قياس الأثر والنجاح" : "Closed-Loop Success Tracking",
      description: isAr
        ? "متابعة تطور حالة الطالب، قياس فعالية خطة التدخل، وتحديث السجل التراكمي لضمان استمرارية التفوق."
        : "Continuous tracking of student progress post-intervention, updating the 360 profile to ensure sustained academic excellence."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="outline" className="px-4 py-1.5 rounded-full border-indigo-500/30 text-indigo-500 text-xs uppercase tracking-wider font-semibold">
            {isAr ? "دورة عمل النظام" : "System Architecture & Workflow"}
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            {isAr ? "كيف يحقق النظام النجاح لطلابك؟" : "How SBA Drives Student Retention"}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            {isAr
              ? "مسار عمل ذكي وسلس يبدأ من رصد الملاحظة وينتهي بتحقيق الاستقرار والتميز الأكاديمي."
              : "A transparent, 4-stage pipeline transforming everyday campus records into proactive student success stories."}
          </p>
        </div>

        {/* 4-Step Pipeline Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative p-6 sm:p-7 rounded-2xl bg-card border border-border/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                {/* Step Pill */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md shadow-primary/10 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-muted-foreground/30 group-hover:text-primary/60 transition-colors font-mono">
                    {item.step}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2.5">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom decorative bar */}
                <div className="mt-6 pt-4 border-t border-border/50 flex items-center text-xs font-semibold text-emerald-500 gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>{isAr ? "مؤتمت بالكامل" : "Automated & Verified"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
