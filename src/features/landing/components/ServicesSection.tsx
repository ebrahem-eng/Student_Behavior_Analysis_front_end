import { useTranslation } from "react-i18next";
import { Siren, HeartHandshake, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function ServicesSection() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const features = [
    {
      icon: Siren,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/15",
      hoverBg: "group-hover:bg-rose-500",
      number: "01",
      title: isAr ? "إشارات الإنذار المبكر" : "Early-Warning Signals",
      description: isAr
        ? "اكتشف التحولات الأكاديمية والسلوكية قبل أن تتحول إلى أزمات. خوارزميتنا تحلل نقاط بيانات متعددة يومياً."
        : "Detect academic and behavioral shifts before they become crises. Our algorithm analyzes multi-dimensional data points daily.",
      stat: isAr ? "تنبيه فوري" : "Real-time Alerts",
      statValue: "24/7",
      accent: "primary",
    },
    {
      icon: HeartHandshake,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/15",
      hoverBg: "group-hover:bg-emerald-500",
      number: "02",
      title: isAr ? "الرعاية التنسيقية المشتركة" : "Collaborative Care",
      description: isAr
        ? "سد الفجوة بين بيانات الفصل وتدخل الأسرة. مشاركة آمنة للرؤى مع أولياء الأمور والمختصين."
        : "Bridge the gap between classroom data and family intervention. Securely share actionable insights with parents and specialists.",
      stat: isAr ? "معدل الاستجابة" : "Response Rate",
      statValue: "96%",
      accent: "primary",
    },
    {
      icon: Sparkles,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      border: "border-violet-500/15",
      hoverBg: "group-hover:bg-violet-500",
      number: "03",
      title: isAr ? "الذكاء التنبؤي" : "Predictive Intelligence",
      description: isAr
        ? "رؤى مدعومة بالذكاء الاصطناعي تبسط دعم الطلاب. الانتقال من العقاب التفاعلي إلى التدخل الاستباقي."
        : "AI-driven insights that simplify student support. Move from reactive discipline to proactive, data-informed intervention strategies.",
      stat: isAr ? "دقة التنبؤ" : "Prediction Accuracy",
      statValue: "94%",
      accent: "primary",
    },
    {
      icon: ShieldCheck,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/15",
      hoverBg: "group-hover:bg-amber-500",
      number: "04",
      title: isAr ? "خصوصية وأمان البيانات" : "Privacy & Compliance",
      description: isAr
        ? "حماية بيانات الطلاب وفقاً لأعلى المعايير. تشفير شامل مع توافق كامل مع FERPA و GDPR."
        : "Student data protection built to the highest standards. End-to-end encryption with full FERPA and GDPR compliance.",
      stat: isAr ? "معايير الأمان" : "Security Standards",
      statValue: "FERPA",
      accent: "primary",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 max-w-[1280px] mx-auto" id="features">
      {/* Section Header */}
      <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/15 rounded-full px-4 py-1.5 mx-auto">
          <span className="text-xs font-semibold text-primary tracking-wide uppercase">
            {isAr ? "القدرات الأساسية" : "Core Capabilities"}
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
          {isAr ? (
            <>أنظمة الدعم{" "}<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">الذكية</span></>
          ) : (
            <>Intelligent{" "}<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Support Systems</span></>
          )}
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {isAr
            ? "أدوات استباقية مصممة لاكتشاف الاحتياجات مبكراً وتنسيق الرعاية بفعالية عبر المنظومة التعليمية."
            : "Proactive tools designed to identify needs early and coordinate care effectively across the entire educational ecosystem."}
        </p>
      </div>

      {/* Features Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      >
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="group relative bg-card border border-border rounded-3xl p-7 sm:p-8 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 overflow-hidden"
            >
              {/* Subtle Background Number */}
              <span className="absolute -bottom-4 -right-2 text-[8rem] font-black text-foreground/[0.02] group-hover:text-foreground/[0.04] leading-none pointer-events-none transition-all duration-500 select-none">
                {feature.number}
              </span>

              {/* Top Row: Icon + Stat Pill */}
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="relative">
                  <div className={`absolute inset-0 ${feature.bg} rounded-2xl scale-[1.35] opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                  <div className={`relative w-14 h-14 ${feature.bg} border ${feature.border} ${feature.color} flex items-center justify-center rounded-2xl ${feature.hoverBg} group-hover:text-white group-hover:shadow-lg group-hover:border-transparent transition-all duration-500`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-secondary/80 border border-border rounded-full px-3 py-1.5">
                  <span className="text-lg font-bold text-foreground leading-none">{feature.statValue}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">{feature.stat}</span>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-primary/50 tracking-wider">{feature.number}</span>
                  <div className="h-px flex-grow bg-border" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Arrow Link */}
              <div className="mt-6 relative z-10">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 cursor-pointer">
                  <span>{isAr ? "اكتشف المزيد" : "Learn more"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
