import { useTranslation } from "react-i18next";
import { GraduationCap, Building2, School, Landmark } from "lucide-react";

export function InstitutionsSection() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const partners = [
    {
      name: isAr ? "جامعة أكاديميكا" : "Universitas Academica",
      icon: GraduationCap,
      color: "text-blue-500",
    },
    {
      name: isAr ? "كلية إثيلريد" : "Aethelred College",
      icon: Landmark,
      color: "text-indigo-500",
    },
    {
      name: isAr ? "المعهد التقني العالمي" : "Global Technological Institute",
      icon: Building2,
      color: "text-purple-500",
    },
    {
      name: isAr ? "مجمع مدارس يونيتي" : "Unity School District",
      icon: School,
      color: "text-emerald-500",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-[1280px] mx-auto" id="partners">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
          {isAr ? "معتمد وموثوق من كبرى المؤسسات التعليمية" : "Trusted by Leading Institutions"}
        </h2>
      </div>

      {/* 4 Pill Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {partners.map((partner, idx) => {
          const Icon = partner.icon;
          return (
            <div
              key={idx}
              className="flex flex-col items-center justify-center gap-4 p-8 bg-card border border-border rounded-full hover:shadow-md hover:border-primary/40 transition-all duration-300 group cursor-default"
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className={`w-8 h-8 ${partner.color}`} />
              </div>
              <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors text-center px-4">
                {partner.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
