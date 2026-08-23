import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Bell, AlertTriangle, Lightbulb, CheckCircle2, TrendingUp, CalendarDays, RefreshCw, Loader2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function StudentAlertsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [alerts, setAlerts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAlertsData = async () => {
    setIsLoading(true);
    try {
      const [alertsRes, recsRes] = await Promise.allSettled([
        api.get('/alerts'),
        api.get('/academic/recommendations'),
      ]);

      if (alertsRes.status === 'fulfilled') {
        const data = Array.isArray(alertsRes.value.data) ? alertsRes.value.data : (alertsRes.value.data?.data || []);
        setAlerts(data);
      }

      if (recsRes.status === 'fulfilled') {
        const data = Array.isArray(recsRes.value.data) ? recsRes.value.data : (recsRes.value.data?.data || []);
        setRecommendations(data);
      }
    } catch (e) {
      console.warn("Student alerts load error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAlertsData();
  }, []);

  const handleMarkRead = async (id: number | string) => {
    try {
      await api.patch(`/alerts/${id}/read`);
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, is_read: true } : a)));
    } catch (e) {
      // ignore
    }
  };

  const hasCriticalAlerts = alerts.some((a) => (a.level === 'critical' || a.level === 'high') && !a.is_read);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" />
            {isAr ? "مركز الإنذارات والتوصيات الأكاديمية" : "Alerts & Academic Recommendations"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "متابعة الإنذارات المبكرة وتوصيات الدعم الأكاديمي المباشرة من MySQL."
              : "Stay on track with personalized early warnings and direct recommendations from your advisors."}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadAlertsData}
          disabled={isLoading}
          className="rounded-full text-xs font-semibold px-4 h-9 border-border bg-secondary/60 hover:bg-secondary flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isAr ? "تحديث" : "Refresh"}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Risk Standing & Notifications */}
        <div className="lg:col-span-1 space-y-6">
          {/* Risk Standing */}
          <Card className={`bg-card/85 backdrop-blur-xl border rounded-3xl p-6 shadow-sm ${hasCriticalAlerts ? 'border-rose-500/40 bg-rose-500/5' : 'border-border'}`}>
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                {hasCriticalAlerts ? <AlertTriangle className="h-4 w-4 text-rose-500" /> : <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                <span>{isAr ? "الوضع الأكاديمي الحالي" : "Current Risk Status"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-3 ${hasCriticalAlerts ? 'border-rose-500 bg-rose-500/10 text-rose-500' : 'border-emerald-500 bg-emerald-500/10 text-emerald-500'}`}>
                  <span className="text-lg font-black">{hasCriticalAlerts ? (isAr ? "تنبيه" : "Action") : (isAr ? "مستقر" : "Clear")}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {hasCriticalAlerts
                    ? (isAr ? "تم رصد مؤشرات تراجع في الحضور أو الواجبات تستوجب المتابعة." : "Indicators detected requiring immediate review.")
                    : (isAr ? "مؤشرات الحضور والواجبات ممتازة ومطابقة للخطة." : "Your attendance compliance and assignment tracks are in good standing.")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts Feed */}
          <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-sm">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <span>{isAr ? "سجل الإشعارات والتنبيهات" : "Recent Alert Feed"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="py-8 text-center text-muted-foreground text-xs">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                  {isAr ? "جارٍ جلب التنبيهات من MySQL..." : "Loading alerts from MySQL..."}
                </div>
              ) : alerts.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  {isAr ? "لا توجد تنبيهات جديدة في قاعدة البيانات." : "No active alerts in database."}
                </p>
              ) : (
                <div className="divide-y divide-border/60">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-foreground">{alert.title || "Alert"}</h4>
                        {!alert.is_read && (
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] font-bold rounded-full">
                            {isAr ? "جديد" : "New"}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{alert.message || alert.description}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" /> {alert.created_at || (isAr ? "مؤخراً" : "Recent")}
                        </span>
                        {!alert.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkRead(alert.id)}
                            className="h-6 px-2 text-[10px] text-primary hover:text-primary"
                          >
                            {isAr ? "تحديد كمقروء" : "Mark Read"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-sm h-full">
            <CardHeader className="p-0 pb-5">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span>{isAr ? "توصيات الدعم الأكاديمي المخصصة" : "Personalized AI Recommendations"}</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    {isAr ? "اقتراحات مولدة بناءً على نمط استذكارك ومستواك في المقررات." : "Targeted action steps generated to maximize your course performance."}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold rounded-full">
                  <TrendingUp className="h-3 w-3 mr-1" /> {isAr ? "خطط الدعم" : "Support Plan"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                  {isAr ? "جارٍ جلب التوصيات من MySQL..." : "Loading recommendations from MySQL..."}
                </div>
              ) : recommendations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground bg-secondary/30 rounded-2xl border border-border text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
                  {isAr ? "لا توجد توصيات تدخل معلقة حالياً." : "No pending intervention recommendations."}
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-2xl bg-secondary/40 border border-border/70 hover:border-primary/30 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-foreground">
                            {rec.action || rec.suggestion || rec.title || (isAr ? "توصية أكاديمية" : "Academic Recommendation")}
                          </h3>
                          <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] rounded-full">
                            {rec.status || "Active"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {rec.description || (isAr ? "جدولة جلسة استذكار مشتركة ومراجعة الواجبات المسجلة." : "Schedule revision session and complete assignments.")}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        className="rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0"
                      >
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                        <span>{isAr ? "تطبيق التوصية" : "Take Action"}</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
