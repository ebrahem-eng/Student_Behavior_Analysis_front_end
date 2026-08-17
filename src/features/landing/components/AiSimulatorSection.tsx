import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Brain,
  BellRing,
  UserCheck,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Sliders,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Scenario {
  id: string;
  name: string;
  nameAr: string;
  icon: typeof AlertTriangle;
  attendance: number;
  assignments: number;
  engagement: "low" | "medium" | "high";
  sentiment: "distressed" | "neutral" | "thriving";
  riskScore: number;
  status: "critical" | "warning" | "stable";
  riskFactors: { en: string; ar: string }[];
  aiActions: {
    roleEn: string;
    roleAr: string;
    actionEn: string;
    actionAr: string;
    icon: typeof UserCheck;
    tagEn: string;
    tagAr: string;
  }[];
}

const scenarios: Scenario[] = [
  {
    id: "critical",
    name: "Attendance Cliff & Late Submissions",
    nameAr: "انحدار مفاجئ في الحضور وتأخر الواجبات",
    icon: AlertTriangle,
    attendance: 58,
    assignments: 42,
    engagement: "low",
    sentiment: "distressed",
    riskScore: 84,
    status: "critical",
    riskFactors: [
      { en: "3 consecutive absences in Math & Physics", ar: "3 غيابات متتالية في مادتي الرياضيات والفيزياء" },
      { en: "40% drop in homework submission rate", ar: "انخفاض بنسبة 40% في تسليم الواجبات المنزلية" },
      { en: "Classroom engagement flagged by 2 teachers", ar: "ملاحظات ضعف المشاركة من معلّمين اثنين" }
    ],
    aiActions: [
      {
        roleEn: "Academic Counselor",
        roleAr: "المرشد الطلابي",
        actionEn: "Immediate 1-on-1 supportive counseling session requested",
        actionAr: "جدولة جلسة استماع وتوجيه فردية عاجلة مع الطالب",
        icon: UserCheck,
        tagEn: "Priority High",
        tagAr: "أولوية قصوى"
      },
      {
        roleEn: "Family Portal Alert",
        roleAr: "تنبيه الأسرة الذكي",
        actionEn: "Automated bilingual digest sent to parents with meeting invite",
        actionAr: "إرسال ملخص ذكي لولي الأمر مع رابط لتنسيق اجتماع",
        icon: BellRing,
        tagEn: "Automated",
        tagAr: "مؤتمت فوراً"
      },
      {
        roleEn: "Adaptive Recovery Plan",
        roleAr: "خطة الدعم الأكاديمي",
        actionEn: "Assigned targeted mini-modules to recover core concepts",
        actionAr: "تخصيص وحدات تقوية مساعدة لتعويض المفاهيم الفائتة",
        icon: BookOpen,
        tagEn: "AI Suggested",
        tagAr: "مقترح بالذكاء"
      }
    ]
  },
  {
    id: "warning",
    name: "Academic Fatigue & Quiz Slump",
    nameAr: "إجهاد دراسي وتراجع درجات الاختبارات",
    icon: TrendingDown,
    attendance: 82,
    assignments: 68,
    engagement: "medium",
    sentiment: "neutral",
    riskScore: 56,
    status: "warning",
    riskFactors: [
      { en: "Midterm test scores declined by 18%", ar: "تراجع درجات الاختبار النصفي بنسبة 18%" },
      { en: "Gradual decrease in portal log-in frequency", ar: "تناقص تدريجي في وتيرة تسجيل الدخول للبوابة" },
      { en: "Slight delay in science project milestones", ar: "تأخر طفيف في تسليم مراحل المشروع العلمي" }
    ],
    aiActions: [
      {
        roleEn: "Subject Teacher",
        roleAr: "معلم المادة",
        actionEn: "Provide formative feedback & tutoring office hours",
        actionAr: "توفير ساعات مكتبية إضافية وتوجيه مخصص للطالب",
        icon: BookOpen,
        tagEn: "Tutoring",
        tagAr: "دعم تعليمي"
      },
      {
        roleEn: "Study Group Match",
        roleAr: "ربط بمجموعة دراسية",
        actionEn: "AI paired student with high-performing peer study circle",
        actionAr: "توصية ذكية بالانضمام لمجموعة دراسية تفاعلية من الأقران",
        icon: UserCheck,
        tagEn: "Collaboration",
        tagAr: "تعلم تعاوني"
      }
    ]
  },
  {
    id: "stable",
    name: "Post-Intervention Recovery & Growth",
    nameAr: "استجابة إيجابية للتدخل وتحسن مستمر",
    icon: CheckCircle2,
    attendance: 96,
    assignments: 94,
    engagement: "high",
    sentiment: "thriving",
    riskScore: 16,
    status: "stable",
    riskFactors: [
      { en: "Attendance restored to 96% over past 3 weeks", ar: "استقرار الحضور عند 96% خلال الأسابيع الثلاثة الأخيرة" },
      { en: "All outstanding assignments submitted on time", ar: "تسليم جميع الواجبات في المواعيد المحددة" },
      { en: "Positive classroom participation recorded", ar: "تسجيل تفاعل إيجابي ملحوظ في الأنشطة الصفية" }
    ],
    aiActions: [
      {
        roleEn: "Praise & Encouragement",
        roleAr: "شهادة تقدير وتشجيع",
        actionEn: "Sent milestone certificate to student and family",
        actionAr: "إرسال بطاقة تميز وتقدير للطالب والأسرة لدعم الاستمرارية",
        icon: ShieldCheck,
        tagEn: "Positive Feedback",
        tagAr: "تعزيز إيجابي"
      },
      {
        roleEn: "Longitudinal Monitoring",
        roleAr: "المتابعة الوقائية",
        actionEn: "AI moved profile to routine bi-weekly checkpoint cycle",
        actionAr: "نقل ملف الطالب إلى مسار المتابعة الوقائية الدورية",
        icon: Brain,
        tagEn: "Monitoring",
        tagAr: "متابعة دورية"
      }
    ]
  }
];

export function AiSimulatorSection() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [activeScenarioId, setActiveScenarioId] = useState<string>("critical");
  const [attendanceOverride, setAttendanceOverride] = useState<number | null>(null);
  const [assignmentOverride, setAssignmentOverride] = useState<number | null>(null);

  const selectedScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  const currentAttendance = attendanceOverride !== null ? attendanceOverride : selectedScenario.attendance;
  const currentAssignments = assignmentOverride !== null ? assignmentOverride : selectedScenario.assignments;

  // Dynamic risk calculation based on manual adjustments
  const calculatedRisk = Math.min(
    100,
    Math.max(
      8,
      Math.round(
        100 - (currentAttendance * 0.55 + currentAssignments * 0.45) +
          (selectedScenario.engagement === "low" ? 15 : selectedScenario.engagement === "medium" ? 5 : -10)
      )
    )
  );

  const getStatusColor = (score: number) => {
    if (score >= 70) return { text: "text-rose-500", bg: "bg-rose-500", light: "bg-rose-500/10", border: "border-rose-500/20", ring: "#f43f5e" };
    if (score >= 40) return { text: "text-amber-500", bg: "bg-amber-500", light: "bg-amber-500/10", border: "border-amber-500/20", ring: "#f59e0b" };
    return { text: "text-emerald-500", bg: "bg-emerald-500", light: "bg-emerald-500/10", border: "border-emerald-500/20", ring: "#10b981" };
  };

  const statusTheme = getStatusColor(calculatedRisk);

  const handleScenarioChange = (id: string) => {
    setActiveScenarioId(id);
    setAttendanceOverride(null);
    setAssignmentOverride(null);
  };

  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden" id="simulator">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-primary/8 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-[1280px] mx-auto space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-xs font-bold text-primary tracking-wide uppercase">
              {isAr ? "محاكي الذكاء التنبؤي التفاعلي" : "Interactive AI Intelligence Simulator"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            {isAr ? (
              <>
                شاهد كيف يكتشف الذكاء الاصطناعي{" "}
                <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  مخاطر الطلاب مبكراً
                </span>
              </>
            ) : (
              <>
                See How Our AI Detects{" "}
                <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Student Risk in Real-Time
                </span>
              </>
            )}
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {isAr
              ? "اختر سيناريو واقعي أو غيّر مؤشرات الطالب لتجربة خوارزمية التحليل التنبؤي وتوليد خطط التدخل الفورية."
              : "Select a real-world classroom scenario or tweak parameters to observe predictive risk scoring and automated intervention pathways."}
          </p>
        </div>

        {/* Interactive Scenario Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isSelected = sc.id === activeScenarioId;
            return (
              <button
                key={sc.id}
                onClick={() => handleScenarioChange(sc.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 active:scale-95 border ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-102"
                    : "bg-card hover:bg-secondary text-muted-foreground hover:text-foreground border-border hover:border-primary/30"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{isAr ? sc.nameAr : sc.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Live Playground Window */}
        <div className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border rounded-3xl shadow-2xl overflow-hidden">
          {/* Mockup Toolbar Header */}
          <div className="px-6 py-4 border-b border-border/80 bg-secondary/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="h-4 w-px bg-border mx-1" />
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <Brain className="w-3.5 h-3.5 text-primary" />
                <span>sba-neural-engine://v4.2/realtime-analysis</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {isAr ? "تحليل مباشر متزامن" : "Live Predictive Stream"}
              </span>
              <button
                onClick={() => handleScenarioChange(activeScenarioId)}
                className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground bg-background px-2.5 py-1 rounded-lg border border-border transition-colors"
                title={isAr ? "إعادة تعيين المؤشرات" : "Reset Sliders"}
              >
                <RefreshCw className="w-3 h-3" />
                <span>{isAr ? "إعادة ضبط" : "Reset"}</span>
              </button>
            </div>
          </div>

          {/* Main Simulation Grid */}
          <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* Left Col: Interactive Parameter Sliders (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Sliders className="w-4 h-4 text-primary" />
                <span>{isAr ? "مؤشرات رصد الطالب الحالية" : "Live Student Input Signals"}</span>
              </div>

              {/* Slider 1: Attendance */}
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border/70 space-y-2.5">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-muted-foreground">{isAr ? "نسبة الحضور التراكمي" : "Attendance Rate"}</span>
                  <span className="font-bold text-foreground font-mono bg-card px-2 py-0.5 rounded-md border border-border">
                    {currentAttendance}%
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={currentAttendance}
                  onChange={(e) => setAttendanceOverride(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer h-2 bg-secondary rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>{isAr ? "غياب متكرر (30%)" : "Critical (30%)"}</span>
                  <span>{isAr ? "مثالي (100%)" : "Perfect (100%)"}</span>
                </div>
              </div>

              {/* Slider 2: Assignment Submission */}
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border/70 space-y-2.5">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-muted-foreground">{isAr ? "معدل تسليم الواجبات" : "Assignment Completion"}</span>
                  <span className="font-bold text-foreground font-mono bg-card px-2 py-0.5 rounded-md border border-border">
                    {currentAssignments}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={currentAssignments}
                  onChange={(e) => setAssignmentOverride(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer h-2 bg-secondary rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>{isAr ? "تأخر مستمر (20%)" : "Lagging (20%)"}</span>
                  <span>{isAr ? "مكتمل بالكامل (100%)" : "Complete (100%)"}</span>
                </div>
              </div>

              {/* Behavioral Indicators Readout */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {isAr ? "العوامل المكتشفة بالذكاء الاصطناعي" : "Detected Risk Correlates"}
                </span>
                <div className="space-y-2">
                  {selectedScenario.riskFactors.map((factor, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-card border border-border text-xs text-muted-foreground"
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${statusTheme.bg}`} />
                      <span>{isAr ? factor.ar : factor.en}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: AI Inference Engine Output (7 cols) */}
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
              
              {/* Risk Gauge Card */}
              <div className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-card to-secondary/40 border ${statusTheme.border} shadow-lg relative overflow-hidden transition-all duration-500`}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2 text-center sm:text-left rtl:sm:text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-card border border-border">
                      <span className={`w-2 h-2 rounded-full ${statusTheme.bg}`} />
                      <span className={statusTheme.text}>
                        {calculatedRisk >= 70
                          ? isAr ? "مؤشر حرج — يستلزم التدخل" : "Critical Risk Index"
                          : calculatedRisk >= 40
                          ? isAr ? "مؤشر متوسط — بحاجة لمتابعة" : "Moderate Risk Watch"
                          : isAr ? "مؤشر مستقر — بيئة إيجابية" : "Low Risk — On Track"}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                      {isAr ? "مؤشر احتمالية التعثر السلوكي الأكاديمي" : "AI Behavioral At-Risk Probability"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isAr
                        ? "دقة التنبؤ: 96.4% بناءً على مقارنة الأنماط التاريخية للسلوك الطلابي."
                        : "Confidence Interval: 96.4% based on multi-dimensional temporal pattern analysis."}
                    </p>
                  </div>

                  {/* Circular Score Display */}
                  <div className="relative shrink-0 flex items-center justify-center">
                    <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 ${statusTheme.border} ${statusTheme.light} flex flex-col items-center justify-center shadow-inner`}>
                      <span className={`text-3xl sm:text-4xl font-black font-mono ${statusTheme.text}`}>
                        {calculatedRisk}%
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">
                        {isAr ? "مستوى الخطر" : "Risk Level"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Automated Multi-Role Action Plan */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                    {isAr ? "خطة التدخل التلقائية المقترحة للمنظومة" : "Automated Multi-Stakeholder Action Plan"}
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {isAr ? "تم التوليد فوراً" : "Instant Resolution Route"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <AnimatePresence mode="wait">
                    {selectedScenario.aiActions.map((action, i) => {
                      const ActionIcon = action.icon;
                      return (
                        <motion.div
                          key={`${selectedScenario.id}-${i}`}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.35, delay: i * 0.1 }}
                          className="p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all space-y-2 group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <ActionIcon className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs font-bold text-foreground">
                                {isAr ? action.roleAr : action.roleEn}
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                              {isAr ? action.tagAr : action.tagEn}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {isAr ? action.actionAr : action.actionEn}
                          </p>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom Quick Action Banner */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/15">
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground text-center sm:text-left rtl:sm:text-right">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    {isAr
                      ? "هل ترغب في ربط هذا النموذج الذكي مع قاعدة بيانات مدرستك أو جامعتك؟"
                      : "Ready to deploy this intelligence engine directly into your school's LMS & SIS?"}
                  </span>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 hover:shadow-lg shrink-0"
                >
                  <a href="#contact" className="flex items-center gap-1.5">
                    <span>{isAr ? "طلب تجربة كاملة" : "Request Full Demo"}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </a>
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
