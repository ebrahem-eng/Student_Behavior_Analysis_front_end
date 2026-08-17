import { useTranslation } from "react-i18next";
import { GraduationCap, Building2, School, Landmark, Quote, Users, TrendingDown, Award } from "lucide-react";
import { motion } from "framer-motion";

export function InstitutionsSection() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const partners = [
    { name: isAr ? "جامعة أكاديميكا" : "Universitas Academica", icon: GraduationCap },
    { name: isAr ? "كلية إثيلريد" : "Aethelred College", icon: Landmark },
    { name: isAr ? "المعهد التقني العالمي" : "Global Tech Institute", icon: Building2 },
    { name: isAr ? "مجمع مدارس يونيتي" : "Unity School District", icon: School },
  ];

  const stats = [
    {
      value: "44K+",
      label: isAr ? "طالب نشط" : "Active Students",
      icon: Users,
    },
    {
      value: "-40%",
      label: isAr ? "انخفاض التسرب" : "Dropout Reduction",
      icon: TrendingDown,
    },
    {
      value: "50+",
      label: isAr ? "مؤسسة شريكة" : "Partner Institutions",
      icon: Award,
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6" id="partners">
      {/* Full-Width Background Band */}
      <div className="bg-secondary/40 border-y border-border py-20">
        <div className="max-w-[1280px] mx-auto space-y-16">

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/15 rounded-full px-4 py-1.5 mx-auto">
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                {isAr ? "شركاء النجاح" : "Our Partners"}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              {isAr ? (
                <>معتمد من{" "}<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">كبرى المؤسسات</span></>
              ) : (
                <>Trusted by{" "}<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Leading Institutions</span></>
              )}
            </h2>
          </div>

          {/* Logo Strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {partners.map((partner, idx) => {
              const Icon = partner.icon;
              return (
                <div
                  key={idx}
                  className="group flex items-center gap-3 cursor-default opacity-50 hover:opacity-100 transition-all duration-500"
                >
                  <div className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center group-hover:border-primary/30 group-hover:shadow-md transition-all duration-500">
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-500" />
                  </div>
                  <span className="text-base font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-500 whitespace-nowrap">
                    {partner.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Impact Stats Row */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 25, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="group bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg hover:border-primary/20 transition-all duration-500"
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-primary/8 border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent transition-all duration-500">
                    <Icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-foreground mb-1 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Testimonial */}
          <div className="max-w-2xl mx-auto text-center space-y-5">
            <div className="w-10 h-10 mx-auto bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Quote className="w-5 h-5 text-primary-foreground" />
            </div>
            <blockquote className="text-lg sm:text-xl text-foreground leading-relaxed font-medium">
              {isAr
                ? "\"منصة SBA غيّرت طريقة دعمنا للطلاب بشكل جذري. تمكنا من تقليل حالات التسرب بنسبة 40% خلال فصل دراسي واحد فقط.\""
                : "\"SBA has fundamentally changed how we support students. We reduced dropout cases by 40% in just one semester.\""}
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                RH
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">
                  {isAr ? "د. ريتشارد هايدن" : "Dr. Richard Hayden"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isAr ? "عميد شؤون الطلاب — جامعة أكاديميكا" : "Dean of Student Affairs — Universitas Academica"}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
