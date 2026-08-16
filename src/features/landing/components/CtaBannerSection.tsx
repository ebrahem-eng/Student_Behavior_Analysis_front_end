import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBannerSection() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-[1280px] mx-auto">
        {/* Gradient Border Wrapper */}
        <div className="relative rounded-[2rem] p-px bg-gradient-to-br from-primary/40 via-primary/10 to-transparent">
          {/* Inner Card */}
          <div className="relative bg-card rounded-[calc(2rem-1px)] overflow-hidden">
            {/* Floating Decorative Orbs */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/[0.04] rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-primary/[0.06] rounded-full blur-2xl pointer-events-none" />

            {/* Dot Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.35]"
              style={{
                backgroundImage: "radial-gradient(circle, hsl(var(--primary) / 0.15) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Content */}
            <div className="relative z-10 px-8 sm:px-12 md:px-20 py-16 sm:py-20 md:py-24 flex flex-col items-center text-center space-y-8">
              {/* Large Number Accent */}
              <div className="flex items-center gap-4">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-primary/30" />
                <span className="text-xs font-bold text-primary tracking-[0.25em] uppercase">
                  {isAr ? "الخطوة التالية" : "Next Step"}
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-primary/30" />
              </div>

              {/* Headline */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1] max-w-3xl">
                {isAr ? (
                  <>ابدأ في دعم طلابك<br /><span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">من اليوم</span></>
                ) : (
                  <>Start supporting your<br />students{" "}<span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">today</span></>
                )}
              </h2>

              {/* Description */}
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                {isAr
                  ? "انضم إلى مئات المؤسسات التعليمية الرائدة. إعداد سريع خلال دقائق وبدون أي تعقيدات تقنية."
                  : "Join hundreds of forward-thinking institutions. Quick setup in minutes with no technical complexity."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Button
                  asChild
                  className="bg-primary text-primary-foreground px-10 py-4 h-auto text-base font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 rounded-full active:scale-[0.97] group"
                >
                  <Link to="/login" className="flex items-center gap-2.5">
                    <span>{isAr ? "ابدأ مجاناً" : "Get Started Free"}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary px-8 py-4 h-auto text-base font-semibold transition-all rounded-full group"
                >
                  <a href="#features" className="flex items-center gap-2">
                    <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{isAr ? "شاهد عرضاً توضيحياً" : "Watch a Demo"}</span>
                  </a>
                </Button>
              </div>

              {/* Trust Avatars Row */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-2.5">
                  {["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"].map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-[2.5px] border-card flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: color }}
                    >
                      {["JK", "AM", "LS", "RH", "TW"][i]}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{isAr ? "+2,400" : "2,400+"}</span>{" "}
                  {isAr ? "معلم يثق بنا" : "educators trust SBA"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
