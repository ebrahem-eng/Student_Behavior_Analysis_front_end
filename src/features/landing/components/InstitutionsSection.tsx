import { useTranslation } from "react-i18next";
import { 
  Building2, 
  GraduationCap, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Quote, 
  Sparkles,
  School
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function InstitutionsSection() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const partnerInstitutions = [
    { name: isAr ? "جامعة الملك سعود" : "King Saud University", type: isAr ? "جامعة رائدة" : "Premier University", icon: GraduationCap, code: "KSU" },
    { name: isAr ? "أكاديمية المعرفة العالمية" : "Global Knowledge Academy", type: isAr ? "مجمع مدارس دولي" : "K-12 Network", icon: School, code: "GKA" },
    { name: isAr ? "جامعة الملك فهد للبترول" : "KFUPM Tech Institute", type: isAr ? "معهد تقني وبحثي" : "Research Polytech", icon: Building2, code: "KFUPM" },
    { name: isAr ? "مدارس الرواد المتقدمة" : "Advanced Pioneers School", type: isAr ? "مدارس متميزة" : "Excellence Schools", icon: School, code: "APS" },
    { name: isAr ? "تحالف الابتكار التعليمي" : "EdTech Innovation Alliance", type: isAr ? "شريك بحثي دولي" : "Global Consortium", icon: Award, code: "EIA" },
    { name: isAr ? "جامعة الفيصل" : "Alfaisal University", type: isAr ? "مؤسسة أكاديمية" : "Academic College", icon: GraduationCap, code: "ALF" },
  ];

  return (
    <section id="institutions" className="py-20 md:py-32 relative bg-secondary/20 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="outline" className="px-4 py-1.5 rounded-full border-emerald-500/30 text-emerald-500 text-xs uppercase tracking-wider font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            {isAr ? "شركاء النجاح والاعتماد" : "Trusted by Educational Leaders"}
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            {isAr ? "الجامعات والمدارس التي نعتز بالعمل معها" : "Universities & Schools We Empower"}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            {isAr
              ? "تعتمد كبرى المؤسسات التعليمية والأكاديمية على نظامنا لتعزيز التماسك الطلابي ورفع معدلات التخرج والاستبقاء."
              : "Leading higher-ed institutions and high school networks rely on SBA to proactively safeguard student academic wellbeing."}
          </p>
        </div>

        {/* Feature Visual Spotlight with the 3rd Generated Campus Image */}
        <div className="mb-16 rounded-3xl border border-border bg-card overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Text & Institutional Stats Column */}
            <div className="lg:col-span-6 p-8 sm:p-12 space-y-6 order-2 lg:order-1">
              <Badge className="bg-primary/15 text-primary hover:bg-primary/20 border-primary/30">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                {isAr ? "البيئة الجامعية الذكية" : "Smart Campus Synergy"}
              </Badge>
              <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-snug">
                {isAr
                  ? "ربط كافة أركان الحرم الجامعي والمدرسي في منصة موحدة"
                  : "Connecting Faculty, Advisors & Families on One Unified Canvas"}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                {isAr
                  ? "سواء كان حرمك الجامعي يضم آلاف الطلاب أو كنت مجمعاً مدرسياً يطمح لأعلى مستويات الرعاية التربوية، يوفر SBA بنية تحتية سحابية مرنة تتكيف مع هيكلكم التنظيمي."
                  : "From multi-campus state universities to focused K-12 preparatory schools, SBA scales seamlessly to provide granular role-based intelligence and cross-departmental coordination."}
              </p>

              {/* Verified Impact Points */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{isAr ? "مطابقة تامة لمعايير حماية البيانات والخصوصية المدرسية" : "FERPA & GDPR Compliant Data Privacy Architecture"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{isAr ? "تكامل مباشر مع أنظمة إدارة التعلم (Blackboard, Canvas, Moodle)" : "Seamless LMS & SIS Integration APIs"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{isAr ? "دعم تشغيلي وتدريب مخصص للمرشدين والمعلمين" : "Dedicated Advisor Onboarding & Change Management"}</span>
                </div>
              </div>
            </div>

            {/* Smart Campus Image Column */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex items-center justify-center bg-gradient-to-tr from-secondary/40 via-card to-card order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/80 group aspect-square max-w-md w-full">
                <img
                  src="/images/smart-campus.png"
                  alt="Smart Connected University Campus Analytics"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl glass bg-card/90 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">
                      {isAr ? "120+ حرم جامعي ومدرسي نشط" : "120+ Active Campuses"}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    99.8% Retention
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Partner Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {partnerInstitutions.map((inst, index) => {
            const Icon = inst.icon;
            return (
              <div
                key={index}
                className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all text-center flex flex-col items-center justify-center gap-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {inst.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {inst.type}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured Testimonial Quote */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl glass bg-card/80 border border-border shadow-xl relative overflow-hidden">
          <Quote className="absolute top-6 right-6 w-20 h-20 text-primary/10 pointer-events-none" />
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-lg sm:text-2xl font-medium text-foreground italic leading-relaxed">
              {isAr
                ? "«أحدث نظام SBA نقلة نوعية في قدرتنا على التدخل الإرشادي المبكر. انخفضت نسبة التعثر الدراسي بنسبة 35% خلال أول فصل دراسي، وأصبح لدينا رؤية استباقية لم نعهدها من قبل.»"
                : "“The Student Behavior Analysis platform revolutionized our counseling workflows. Early interventions reduced course dropouts by 35% in our first semester. The multi-portal synchronization keeps parents and faculty on the exact same page.”"}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                DR
              </div>
              <div>
                <h5 className="font-bold text-foreground text-base">
                  {isAr ? "د. ريم الهاشمي" : "Dr. Reem Al-Hashemi"}
                </h5>
                <p className="text-xs text-muted-foreground">
                  {isAr ? "عميد شؤون الطلاب والتوجيه الأكاديمي" : "Dean of Academic Guidance & Student Affairs"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
