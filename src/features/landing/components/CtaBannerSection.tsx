import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBannerSection() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <section className="py-16 px-4 sm:px-6" id="impact">
      <div className="max-w-[1280px] mx-auto bg-secondary/50 border border-border p-8 sm:p-12 md:p-16 text-center relative overflow-hidden rounded-3xl shadow-sm">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col items-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? "انضم إلى التحول الأكاديمي" : "Join the Academic Transformation"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            {isAr ? "هل أنت مستعد لدعم كل طالب؟" : "Ready to support every student?"}
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {isAr
              ? "انضم إلى مئات المؤسسات التعليمية الرائدة التي تستخدم منصة SBA لخلق بيئات تعليمية أكثر أماناً ودعماً."
              : "Join hundreds of forward-thinking districts using SBA to create safer, more supportive learning environments."}
          </p>

          <div className="pt-4">
            <Button
              asChild
              className="bg-primary text-primary-foreground px-8 py-3.5 h-auto text-sm font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg rounded-full active:scale-95"
            >
              <Link to="/login">
                <span>{isAr ? "ابدأ الآن مجاناً" : "Get Started for Free"}</span>
                <ArrowRight className="w-4 h-4 ml-1.5 rtl:mr-1.5 rtl:ml-0 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
