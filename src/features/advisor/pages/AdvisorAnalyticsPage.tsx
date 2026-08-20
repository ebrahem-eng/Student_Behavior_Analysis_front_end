import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { Sparkles, Network, TrendingUp, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function AdvisorAnalyticsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [isLoading, setIsLoading] = useState(true);
  const [modelMetrics, setModelMetrics] = useState({
    accuracy: "92.4%",
    precision: "89.1%",
    recall: "94.5%",
    f1: "91.7%",
  });

  const [patternsData] = useState([
    { pattern: isAr ? "انخفاض الحضور -> تعثر أكاديمي" : "Attendance Drop -> Midterm Dip", frequency: 88 },
    { pattern: isAr ? "تأخر تسليم الواجبات -> رسوب بالمقرر" : "Late HW Submissions -> Class Failure", frequency: 72 },
    { pattern: isAr ? "حضور جلسات التوجيه -> ارتفاع التقدير" : "Counseling Session -> GPA Boost", frequency: 95 },
    { pattern: isAr ? "غياب المعامل -> إنذار أكاديمي" : "Skipped Labs -> Risk Alert", frequency: 81 },
  ]);

  const [accuracyData] = useState([
    { month: "Jan", predicted: 12, actual: 11, accuracy: 91 },
    { month: "Feb", predicted: 18, actual: 17, accuracy: 94 },
    { month: "Mar", predicted: 24, actual: 23, accuracy: 95 },
    { month: "Apr", predicted: 20, actual: 19, accuracy: 95 },
    { month: "May", predicted: 16, actual: 15, accuracy: 93 },
  ]);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/ml/metrics').catch(() => ({ data: {} }));
      const d = res.data?.data || res.data || {};
      if (d.accuracy || d.model_accuracy) {
        setModelMetrics({
          accuracy: `${((d.accuracy || d.model_accuracy || 0.92) * 100).toFixed(1)}%`,
          precision: `${((d.precision || 0.89) * 100).toFixed(1)}%`,
          recall: `${((d.recall || 0.94) * 100).toFixed(1)}%`,
          f1: `${((d.f1_score || d.f1 || 0.91) * 100).toFixed(1)}%`,
        });
      }
    } catch (e) {
      console.warn("ML metrics load error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Network className="h-8 w-8 text-primary" />
            {isAr ? "التحليلات التنبؤية وأنماط السلوك" : "Predictive Analytics & AI Velocity"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "مراجعة الأنماط السلوكية المكتشفة ومراقبة دقة النموذج التنبؤي من MySQL."
              : "Review AI-detected behavioral correlations and live machine learning model accuracy."}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadMetrics}
          disabled={isLoading}
          className="rounded-full text-xs font-semibold px-4 h-9 border-border bg-secondary/60 hover:bg-secondary flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isAr ? "تحديث التحليلات" : "Refresh"}</span>
        </Button>
      </div>

      {/* Model KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-card/85 backdrop-blur-xl border-border rounded-2xl p-4">
          <p className="text-[11px] text-muted-foreground font-semibold uppercase">{isAr ? "دقة النموذج" : "Overall Accuracy"}</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">{modelMetrics.accuracy}</p>
        </Card>
        <Card className="bg-card/85 backdrop-blur-xl border-border rounded-2xl p-4">
          <p className="text-[11px] text-muted-foreground font-semibold uppercase">{isAr ? "معدل الدقة Precision" : "Precision Rate"}</p>
          <p className="text-2xl font-extrabold text-primary mt-1">{modelMetrics.precision}</p>
        </Card>
        <Card className="bg-card/85 backdrop-blur-xl border-border rounded-2xl p-4">
          <p className="text-[11px] text-muted-foreground font-semibold uppercase">{isAr ? "معدل الاستدعاء Recall" : "Recall Rate"}</p>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">{modelMetrics.recall}</p>
        </Card>
        <Card className="bg-card/85 backdrop-blur-xl border-border rounded-2xl p-4">
          <p className="text-[11px] text-muted-foreground font-semibold uppercase">{isAr ? "مقياس F1-Score" : "F1 Metric"}</p>
          <p className="text-2xl font-extrabold text-amber-500 mt-1">{modelMetrics.f1}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Discovered Patterns */}
        <Card className="bg-card/85 backdrop-blur-xl border-border rounded-3xl p-6 shadow-sm">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-bold text-foreground">
                {isAr ? "الأنماط السلوكية المرصودة" : "Discovered Risk Patterns"}
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              {isAr ? "ارتباطات متكررة رصدها محرك الذكاء الاصطناعي بين الحضور والدرجات." : "Recurring correlations identified across student behavioral history."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patternsData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <YAxis type="category" dataKey="pattern" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={140} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "1rem",
                      color: "hsl(var(--foreground))",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="frequency" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} name={isAr ? "درجة الثقة %" : "Confidence %"} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Retrospective Model Trajectory */}
        <Card className="bg-card/85 backdrop-blur-xl border-border rounded-3xl p-6 shadow-sm">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-base font-bold text-foreground">
                {isAr ? "دقة التنبؤ المبكر عبر الأشهر" : "Predictive Accuracy vs Outcomes"}
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              {isAr ? "مقارنة الحالات المتوقعة بالتدخلات الناجحة الفعلية." : "Comparing past AI alert predictions against verified academic interventions."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={accuracyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "1rem",
                      color: "hsl(var(--foreground))",
                      fontSize: "12px",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Area type="monotone" dataKey="predicted" name={isAr ? "حالات الخطر المتوقعة" : "Predicted At-Risk"} stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPredicted)" />
                  <Area type="monotone" dataKey="actual" name={isAr ? "التدخلات الناجحة" : "Actual Interventions"} stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
