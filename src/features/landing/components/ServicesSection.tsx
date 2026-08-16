import { useTranslation } from "react-i18next";
import { AlertTriangle, Users, Brain, LineChart } from "lucide-react";

export function ServicesSection() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <section className="py-20 px-4 sm:px-6 max-w-[1280px] mx-auto" id="features">
      {/* Section Header */}
      <div className="text-center mb-12 max-w-2xl mx-auto space-y-3">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
          {isAr ? "أنظمة الدعم الذكية" : "Intelligent Support Systems"}
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {isAr
            ? "أدوات استباقية مصممة لاكتشاف الاحتياجات مبكراً وتنسيق الرعاية بفعالية عبر المنظومة التعليمية بأكملها."
            : "Proactive tools designed to identify needs early and coordinate care effectively across the entire educational ecosystem."}
        </p>
      </div>

      {/* Features Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Large Early-Warning Signals (Span 2 on MD/LG) */}
        <div className="col-span-1 md:col-span-2 bg-card border border-border p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300 rounded-3xl">
          {/* Watermark Background Graphic */}
          <div className="absolute top-2 right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <LineChart className="w-36 h-36 text-primary" />
          </div>

          <div className="z-10 space-y-4">
            <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-2xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              {isAr ? "إشارات الإنذار المبكر" : "Early-Warning Signals"}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed">
              {isAr
                ? "اكتشف التحولات الأكاديمية والسلوكية قبل أن تتحول إلى أزمات. خوارزميتنا تحلل نقاط بيانات متعددة يومياً لرصد التغيرات الطفيفة في التفاعل أو الأداء."
                : "Detect academic and behavioral shifts before they become crises. Our algorithm analyzes multi-dimensional data points daily to flag subtle changes in engagement or performance."}
            </p>
          </div>

          {/* Decorative Telemetry Graphic */}
          <div className="mt-8 pt-6 z-10">
            <div className="h-32 w-full border border-border bg-background/50 flex items-end p-4 gap-3 relative overflow-hidden rounded-2xl">
              {/* Baseline Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none opacity-20">
                <div className="w-full h-px bg-muted-foreground" />
                <div className="w-full h-px bg-muted-foreground" />
                <div className="w-full h-px bg-muted-foreground" />
              </div>

              {/* Bars */}
              <div className="w-full bg-muted/60 h-[30%] rounded-t-xl transition-all group-hover:h-[35%]" />
              <div className="w-full bg-muted/60 h-[45%] rounded-t-xl transition-all group-hover:h-[50%]" />
              <div className="w-full bg-primary h-[85%] shadow-[0_0_15px_rgba(37,99,235,0.4)] rounded-t-xl" />
              <div className="w-full bg-muted/60 h-[60%] rounded-t-xl transition-all group-hover:h-[65%]" />
              <div className="w-full bg-muted/60 h-[40%] rounded-t-xl transition-all group-hover:h-[45%]" />
            </div>
          </div>
        </div>

        {/* Right Stack: Card 2 & Card 3 */}
        <div className="col-span-1 flex flex-col gap-6">
          {/* Card 2: Collaborative Care */}
          <div className="flex-1 bg-card border border-border p-6 sm:p-8 flex flex-col justify-center hover:shadow-lg transition-all duration-300 rounded-3xl group">
            <div className="w-12 h-12 bg-secondary text-foreground flex items-center justify-center mb-4 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {isAr ? "الرعاية التنسيقية المشتركة" : "Collaborative Care"}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isAr
                ? "سد الفجوة بين بيانات الفصل وتدخل الأسرة. مشاركة آمنة للرؤى القابلة للتنفيذ مع أولياء الأمور والمختصين في الوقت الفعلي."
                : "Bridges the gap between classroom data and family intervention. Securely share actionable insights with parents and specialists in real-time."}
            </p>
          </div>

          {/* Card 3: Predictive Intelligence */}
          <div className="flex-1 bg-card border border-border p-6 sm:p-8 flex flex-col justify-center hover:shadow-lg transition-all duration-300 rounded-3xl group">
            <div className="w-12 h-12 bg-secondary text-foreground flex items-center justify-center mb-4 rounded-2xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {isAr ? "الذكاء التنبؤي" : "Predictive Intelligence"}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isAr
                ? "رؤى مدعومة بالذكاء الاصطناعي تبسط دعم الطلاب. الانتقال من العقاب التفاعلي إلى استراتيجيات التدخل الاستباقية المبنية على البيانات."
                : "AI-driven insights that simplify student support. Move from reactive discipline to proactive, data-informed intervention strategies."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
