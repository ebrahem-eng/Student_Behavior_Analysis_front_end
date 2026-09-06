import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoImg from "@/assets/sba-logo.png";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showSubtitle?: boolean;
  to?: string;
  className?: string;
  imgClassName?: string;
}

export function BrandLogo({
  size = "md",
  showSubtitle = false,
  to = "/",
  className = "",
  imgClassName = "",
}: BrandLogoProps) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const sizeMap = {
    sm: {
      img: "h-7 w-auto",
      sub: "text-[8px]",
    },
    md: {
      img: "h-8 sm:h-9 w-auto",
      sub: "text-[9px]",
    },
    lg: {
      img: "h-11 sm:h-12 w-auto",
      sub: "text-[10px]",
    },
    xl: {
      img: "h-14 sm:h-16 w-auto",
      sub: "text-xs",
    },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      <div className="relative flex items-center bg-white dark:bg-white/95 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-sm border border-border/50 group-hover:scale-105 transition-transform duration-300">
        <img
          src={logoImg}
          alt="SBA Platform"
          className={`${currentSize.img} object-contain rounded-lg ${imgClassName}`}
        />
      </div>

      {showSubtitle && (
        <div className="hidden sm:flex flex-col justify-center">
          <span className="text-xs font-bold text-foreground tracking-tight leading-none">
            SBA
          </span>
          <span className={`${currentSize.sub} font-semibold text-muted-foreground uppercase tracking-widest mt-0.5 leading-none`}>
            {isAr ? "نظام الإنذار المبكر" : "Early Warning AI"}
          </span>
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
