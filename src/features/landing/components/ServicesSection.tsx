import { useTranslation } from "react-i18next";
import { 
  BrainCircuit, 
  ShieldAlert, 
  BookOpenCheck, 
  Users2, 
  Bot, 
  FileSpreadsheet, 
  Sparkles,
  ArrowUpRight,
  LineChart,
  BellRing
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ServicesSection() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const services = [
    {
      icon: BrainCircuit,
      color: "from-blue-500 to-cyan-500",
      textColor: "text-cyan-500",
      bgGlow: "group-hover:bg-cyan-500/10",
      tag: isAr ? "تحليل تنبؤي" : "Predictive AI",
      title: isAr ? "محرك التنبؤ بالسلوك والمخاطر الأكاديمية" : "AI Behavioral & Academic Risk Engine",
      description: isAr
        ? "خوارزميات تعلم آلي ذكية ترصد أنماط الغياب، تراجع الدرجات، وسلوكيات الفصل لتوقع المخاطر مبكراً بنسبة دقة تفوق 98%."
        : "Advanced neural algorithms continuously correlate attendance patterns, grade drops, and engagement indicators to flag at-risk trends."
    },
    {
      icon: ShieldAlert,
      color: "from-rose-500 to-amber-500",
      textColor: "text-rose-500",
      bgGlow: "group-hover:bg-rose-500/10",
      tag: isAr ? "تدخل فوري" : "Early Intervention",
      title: isAr ? "نظام إدارة الإحالات والتدخلات العلاجية" : "Early-Alert & Caseload Management",
      description: isAr
        ? "مسارات عمل مخصصة للمرشدين لجدولة الجلسات، صياغة خطط الدعم الفردية، وتوثيق استجابة الطالب خطوة بخطوة."
        : "Streamlined advisor workflows for automated triage, session scheduling, individualized intervention plans, and outcome tracking."
    },
    {
      icon: BookOpenCheck,
      color: "from-emerald-500 to-teal-500",
      textColor: "text-emerald-500",
      bgGlow: "group-hover:bg-emerald-500/10",
      tag: isAr ? "رصد الفصول" : "Classroom Telemetry",
      title: isAr ? "الرصد المباشر للحضور والسلوك الصفي" : "Live Attendance & Incident Logging",
      description: isAr
        ? "واجهات سريعة للمعلمين لتسجيل الغياب، التقييمات المستمرة، وتقارير الملاحظات السلوكية الإيجابية والسلبية في ثوانٍ معدودة."
        : "Ultra-fast teacher tools for one-click attendance, daily formative grading, positive reinforcement badges, and disciplinary logging."
    },
    {
      icon: Users2,
      color: "from-purple-500 to-indigo-500",
      textColor: "text-purple-500",
      bgGlow: "group-hover:bg-purple-500/10",
      tag: isAr ? "إشراك الأسرة" : "Family Engagement",
      title: isAr ? "بوابة التواصل الشامل لأولياء الأمور" : "Transparent Parent & Guardian Portal",
      description: isAr
        ? "تمكين أولياء الأمور من متابعة تقارير أبنائهم، إدارة موافقات معالجة البيانات، والتواصل المباشر مع المرشد الأكاديمي."
        : "Empower families with real-time academic summaries, advisor direct messaging, data consent controls, and push notifications."
    },
    {
      icon: Bot,
      color: "from-fuchsia-500 to-pink-500",
      textColor: "text-fuchsia-500",
      bgGlow: "group-hover:bg-fuchsia-500/10",
      tag: isAr ? "مساعد ذكي" : "AI Copilot",
      title: isAr ? "المساعد الذكي للطلاب والمرشدين" : "24/7 AI Guidance Assistant & Chatbot",
      description: isAr
        ? "مساعد ذكاء اصطناعي تفاعلي يقدم نصائح دراسية وإرشادية للطلاب، ويساعد المرشدين في تلخيص التقارير السلوكية المعقدة."
        : "Interactive conversational AI helping students with study strategies and wellness, while assisting counselors in synthesizing case summaries."
    },
    {
      icon: FileSpreadsheet,
      color: "from-amber-500 to-orange-500",
      textColor: "text-amber-500",
      bgGlow: "group-hover:bg-amber-500/10",
      tag: isAr ? "حوكمة وتقارير" : "Auditing & Export",
      title: isAr ? "التقارير التحليلية والحوكمة الشاملة" : "Enterprise Governance & Deep Export",
      description: isAr
        ? "توليد تقارير PDF وإكسل احترافية، سجلات تدقيق أمان كاملة، وضوابط صارمة للخصوصية تتوافق مع المعايير العالمية."
        : "Instant PDF/Excel reports, complete audit logs, multi-tenant school partitioning, and enterprise-grade data privacy."
    }
  ];

  return (
    <section id="services" className="py-20 md:py-32 relative bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/30 text-primary text-xs uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            {isAr ? "خدمات وإمكانيات المنصة" : "Core Capabilities & Services"}
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            {isAr
              ? "حلول متطورة ترتقي ببيئة التعلم والتوجيه"
              : "Intelligent Solutions Built for Modern Education"}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            {isAr
              ? "صممت المنصة لتلبي احتياجات كل ركن في المؤسسة التعليمية، محولة البيانات المتناثرة إلى رؤى استباقية وقرارات حكيمة."
              : "Engineered from the ground up to turn fragmented educational records into continuous, proactive insights and actionable guidance."}
          </p>
        </div>

        {/* Feature Visual Spotlight */}
        <div className="mb-16 rounded-3xl border border-border bg-card overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Visual Graphic Column */}
            <div className="lg:col-span-6 relative p-6 sm:p-8 flex items-center justify-center bg-gradient-to-tr from-card via-card to-secondary/40">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/80 group aspect-square max-w-md w-full">
                <img
                  src="/images/ai-behavior.png"
                  alt="AI Student Learning Analytics Dashboard"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl glass bg-card/90 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <LineChart className="w-5 h-5 text-cyan-400" />
                    <span className="text-xs font-semibold text-foreground">
                      {isAr ? "تحليل مباشر للمشاركة الصفية" : "Live Engagement Telemetry"}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Active Stream
                  </span>
                </div>
              </div>
            </div>

            {/* Description Text Column */}
            <div className="lg:col-span-6 p-8 sm:p-12 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-semibold">
                <BellRing className="w-3.5 h-3.5" />
                {isAr ? "تحليل السلوك المتقدم" : "Deep Behavioral Analytics"}
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-snug">
                {isAr
                  ? "تحويل مؤشرات السلوك إلى خطط تدخل قبل فوات الأوان"
                  : "Turn Subtle Behavioral Cues into Preventive Action Plans"}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                {isAr
                  ? "يرصد النظام التغيرات الدقيقة في وتيرة الحضور، التفاعل، والأداء الأكاديمي، ويعقد مقارنات تلقائية مع الأنماط التاريخية لتنبيه المرشدين بالأولويات القصوى وتفادي تراجع الطلاب."
                  : "By establishing neural baselines for each cohort, SBA identifies behavioral deviations before they result in failed courses, giving academic counselors a vital window to intervene."}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground">3.2x</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {isAr ? "سرعة مضاعفة في التدخل" : "Faster Alert Escalation"}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="text-2xl sm:text-3xl font-extrabold text-cyan-500">98.4%</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {isAr ? "دقة تنبؤ نماذج المخاطر" : "Risk Prediction Precision"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="group relative bg-card border-border/80 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                {/* Subtle Hover Ambient Background Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl transition-colors duration-500 pointer-events-none ${service.bgGlow}`} />

                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${service.color} flex items-center justify-center text-white shadow-md shadow-primary/10 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                      {service.tag}
                    </span>
                  </div>

                  <CardTitle className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{service.title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-primary shrink-0 ml-2" />
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
