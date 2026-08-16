import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Play, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const chartData = [
    { day: isAr ? "الإثنين" : "Mon", activeHeight: "75%", targetHeight: "60%" },
    { day: isAr ? "الثلاثاء" : "Tue", activeHeight: "45%", targetHeight: "80%" },
    { day: isAr ? "الأربعاء" : "Wed", activeHeight: "90%", targetHeight: "100%" },
    { day: isAr ? "الخميس" : "Thu", activeHeight: "65%", targetHeight: "70%" },
    { day: isAr ? "الجمعة" : "Fri", activeHeight: "80%", targetHeight: "85%" },
  ];

  return (
    <section className="relative pt-12 sm:pt-16 pb-12 px-4 sm:px-6 max-w-[1280px] mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Headline & Call To Actions */}
        <div className="flex flex-col gap-7">
          {/* Eyebrow Badge */}
          <div className="inline-flex self-start items-center gap-2 bg-primary/5 border border-primary/15 rounded-full px-4 py-1.5 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs font-semibold text-primary tracking-wide">
              {isAr ? "منصة إنذار مبكر ذكية" : "AI-Powered Early Warning"}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-foreground leading-[1.1] tracking-tight">
            {isAr ? (
              <>
                حوّل بيانات الفصول
                <br />
                إلى{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  رؤى تنبؤية ذكية.
                </span>
              </>
            ) : (
              <>
                Transform Classroom
                <br />
                Data into{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Predictive Insights.
                </span>
              </>
            )}
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed">
            {isAr
              ? "نضمن نجاح كل طالب عبر منصة الإنذار المبكر الذكية من SBA — تعاون فوري بين المعلمين، المرشدين، والأسر."
              : "Ensure no student is left behind with SBA's intelligent early-warning platform. Real-time collaboration for educators and families."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 pt-1">
            <Button
              asChild
              className="bg-primary text-primary-foreground px-8 py-3.5 h-auto text-sm font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:shadow-primary/15 rounded-full active:scale-[0.97]"
            >
              <Link to="/login">
                {isAr ? "طلب عرض تجريبي" : "Request a Demo"}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-border hover:border-primary/40 text-foreground hover:text-primary hover:bg-primary/5 px-8 py-3.5 h-auto text-sm font-semibold transition-all flex items-center justify-center gap-2 rounded-full"
            >
              <a href="#features">
                <Play className="w-4 h-4" />
                <span>{isAr ? "شاهد كيف يعمل" : "Watch How It Works"}</span>
              </a>
            </Button>
          </div>

          {/* Floating Stats Pills */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground leading-none">89%</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {isAr ? "معدل النجاح" : "Success Rate"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground leading-none">2.4k+</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {isAr ? "طالب يُراقب" : "Students Tracked"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground leading-none">-34%</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {isAr ? "انخفاض المخاطر" : "Risk Reduction"}
                </div>
              </div>
            </div>
          </div>

          {/* Trust Bar */}
          <div className="flex items-center gap-3 pt-1">
            {/* Stacked Avatars */}
            <div className="flex -space-x-2">
              {["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"].map((color, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: color }}
                >
                  {["SA", "KR", "DJ", "MN"][i]}
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground">
                {isAr ? "موثوق من +50 مؤسسة" : "Trusted by 50+ institutions"}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {isAr ? "مدارس K-12 وجامعات" : "K-12 & Higher-Ed nationwide"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Dashboard Preview Mockup */}
        <div className="relative w-full h-[500px] overflow-hidden shadow-xl border border-border bg-card rounded-2xl">
          <div className="absolute inset-0 bg-card flex flex-col">
            {/* Browser Header Bar */}
            <div className="h-12 border-b border-border flex items-center px-4 gap-2 bg-secondary/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="mx-auto bg-card border border-border px-6 py-1 rounded-full text-[11px] text-muted-foreground font-mono">
                sba-platform.edu/dashboard
              </div>
            </div>

            {/* Dashboard Inner Canvas */}
            <div className="p-6 flex-grow flex flex-col gap-6 overflow-hidden items-center justify-center bg-background/50">
              {/* Centered Student Progress Chart */}
              <div className="bg-card border border-border p-5 h-72 w-full max-w-xl flex flex-col rounded-2xl shadow-sm">
                {/* Chart Header */}
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {isAr ? "تقدم واستجابة الطلاب" : "Student Progress"}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {isAr ? "مقارنة الأداء الفعلي مقابل المستهدف" : "Weekly Active vs Target Performance"}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-sm bg-primary" />
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {isAr ? "الفعلي" : "Active"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-sm bg-primary/25" />
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {isAr ? "المستهدف" : "Target"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="flex-grow relative mt-2">
                  {/* Horizontal Gridlines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                    {["100%", "75%", "50%", "25%", ""].map((label, i) => (
                      <div key={i} className="flex items-center gap-2 w-full">
                        <span className="text-[8px] text-muted-foreground/50 w-7 text-right shrink-0 tabular-nums">
                          {label}
                        </span>
                        <div className="flex-grow h-px bg-border/60" />
                      </div>
                    ))}
                  </div>

                  {/* Grouped Bars */}
                  <div className="absolute inset-0 pl-9 flex items-end gap-3 pb-6">
                    {chartData.map((item, idx) => (
                      <div key={idx} className="flex-grow flex flex-col items-center gap-1.5 h-full group cursor-pointer">
                        {/* Bar Pair Container */}
                        <div className="w-full flex-grow flex items-end justify-center gap-1 relative">
                          {/* Target Bar (Behind) */}
                          <div className="w-[45%] relative h-full flex items-end">
                            <div
                              className="w-full bg-primary/15 rounded-t-lg transition-all duration-700 ease-out relative overflow-hidden"
                              style={{ height: item.targetHeight }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
                            </div>
                          </div>

                          {/* Active Bar (Front) */}
                          <div className="w-[45%] relative h-full flex items-end">
                            <div
                              className="w-full bg-primary rounded-t-lg transition-all duration-700 ease-out shadow-sm group-hover:shadow-md group-hover:shadow-primary/20 relative overflow-hidden"
                              style={{ height: item.activeHeight }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                            </div>
                          </div>

                          {/* Hover Tooltip */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                            <div className="bg-foreground text-background text-[9px] font-bold px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
                              {item.activeHeight}
                            </div>
                          </div>
                        </div>

                        {/* Day Label */}
                        <div className="text-[10px] text-muted-foreground font-medium group-hover:text-primary transition-colors">
                          {item.day}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* High-Impact Metric Cards */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
                <div className="bg-card border border-border p-4 flex items-center gap-3.5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-destructive/10 text-destructive flex items-center justify-center rounded-full shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">03</div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {isAr ? "حالات حرجة اليوم" : "At Risk Today"}
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border p-4 flex items-center gap-3.5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full shrink-0">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">89%</div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {isAr ? "نسبة نجاح التدخل" : "Success Rate"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Abstract Background Blur Orbs */}
      <div className="absolute top-0 right-0 -z-10 w-full h-full overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[80%] rounded-full bg-primary/15 blur-[100px]" />
        <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[60%] rounded-full bg-secondary blur-[80px]" />
      </div>
    </section>
  );
}
