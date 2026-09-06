import { Badge } from "@/components/ui/badge";

export type RiskLevel = "low" | "medium" | "high";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className = "" }: RiskBadgeProps) {
  const styles = {
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    high: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  };

  const labels = {
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk"
  };

  return (
    <Badge variant="outline" className={`${styles[level]} ${className}`}>
      {labels[level]}
    </Badge>
  );
}
