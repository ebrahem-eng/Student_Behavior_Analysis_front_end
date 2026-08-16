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
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15] tracking-tight">
            {isAr ? (
              <>
                تحويل بيانات الفصول الدراسية إلى{" "}
                <span className="text-primary">رؤى تنبؤية ذكية.</span>
              </>
            ) : (
              <>
                Transform Classroom Data into{" "}
                <span className="text-primary">Predictive Insights.</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
            {isAr
              ? "نضمن عدم تخلف أي طالب عن الركب عبر منصة الإنذار المبكر الذكية من SBA. تعاون مباشر بين المعلمين، المرشدين، والأسرة."
              : "Ensure no student is left behind with SBA's intelligent early-warning platform. Real-time collaboration for educators and families."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              asChild
              className="bg-primary text-primary-foreground px-8 py-3.5 h-auto text-sm font-semibold hover:opacity-90 transition-all shadow-sm rounded-full active:scale-95"
            >
              <Link to="/login">
                {isAr ? "طلب عرض تجريبي" : "Request a Demo"}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-secondary px-8 py-3.5 h-auto text-sm font-semibold transition-colors flex items-center justify-center gap-2 rounded-full"
            >
              <a href="#features">
                <Play className="w-4 h-4 fill-current" />
                <span>{isAr ? "كيف يعمل النظام" : "Watch How It Works"}</span>
              </a>
            </Button>
          </div>

          <div className="pt-4 flex items-center gap-2 text-muted-foreground">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-xs sm:text-sm font-medium tracking-wide uppercase">
              {isAr ? "معتمد وموثوق من المدارس والجامعات" : "Trusted by K-12 Districts nationwide"}
            </span>
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
              <div className="bg-card border border-border p-5 h-64 w-full max-w-xl flex flex-col rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-base font-semibold text-foreground">
                    {isAr ? "تقدم واستجابة الطلاب" : "Student Progress"}
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {isAr ? "نشط" : "Active"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {isAr ? "المستهدف" : "Target"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bars */}
                <div className="flex-grow flex items-end gap-4 px-2 pb-1">
                  {chartData.map((item, idx) => (
                    <div key={idx} className="flex-grow flex flex-col justify-end gap-2 h-full group cursor-pointer">
                      <div className="w-full bg-primary/10 rounded-full h-full relative overflow-hidden flex items-end">
                        <div
                          className="w-full bg-primary rounded-full transition-all duration-500 group-hover:brightness-110"
                          style={{ height: item.activeHeight }}
                        />
                      </div>
                      <div className="text-[10px] text-center text-muted-foreground font-medium">
                        {item.day}
                      </div>
                    </div>
                  ))}
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
