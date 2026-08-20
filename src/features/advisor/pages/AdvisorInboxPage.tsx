import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Inbox,
  AlertOctagon,
  CheckCircle2,
  Search,
  FileText,
  ChevronRight,
  Loader2,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { api, getApiErrorMessage } from "@/lib/api";

export default function AdvisorInboxPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | number | null>(null);

  const loadInboxData = async () => {
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
      console.warn("Advisor inbox load error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInboxData();
  }, []);

  const handleApproveRecommendation = async (id: number | string) => {
    setActionLoadingId(id);
    try {
      await api.patch(`/academic/recommendations/${id}/approve`);
      loadInboxData();
    } catch (err) {
      alert(getApiErrorMessage(err, isAr));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleMarkAlertRead = async (id: number | string) => {
    try {
      await api.patch(`/alerts/${id}/read`);
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, is_read: true } : a)));
    } catch (e) {
      // ignore
    }
  };

  const unreadAlertsCount = alerts.filter((a) => !a.is_read).length;

  const filteredAlerts = alerts.filter((a) => {
    const title = a.title || a.type || "";
    const msg = a.message || a.description || "";
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Inbox className="h-8 w-8 text-primary" />
            {isAr ? "صندوق التنبيهات وخطط التدخل" : "Early-Alert Inbox & Interventions"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "مراجعة إشعارات الخطر الواردة واعتماد خطط التدخل الموصى بها من الذكاء الاصطناعي."
              : "Review incoming student alerts and approve AI-generated academic intervention plans."}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadInboxData}
          disabled={isLoading}
          className="rounded-full text-xs font-semibold px-4 h-9 border-border bg-secondary/60 hover:bg-secondary flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isAr ? "تحديث الصندوق" : "Refresh"}</span>
        </Button>
      </div>

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="bg-card/80 border border-border p-1 rounded-2xl mb-6">
          <TabsTrigger value="alerts" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative text-xs font-bold px-4 py-2">
            <AlertOctagon className="w-4 h-4 mr-2" />
            <span>{isAr ? "التنبيهات الواردة" : "Incoming Alerts"}</span>
            {unreadAlertsCount > 0 && (
              <span className="ml-2 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {unreadAlertsCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-bold px-4 py-2">
            <FileText className="w-4 h-4 mr-2" />
            <span>{isAr ? "خطط وتوصيات التدخل" : "Intervention Review"}</span>
            {recommendations.length > 0 && (
              <span className="ml-2 px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                {recommendations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Incoming Alerts */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="relative w-full sm:w-80 mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isAr ? "بحث في التنبيهات..." : "Search alerts..."}
              className="pl-9 h-9 rounded-full bg-secondary/60 border-border text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-muted-foreground text-xs">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
              {isAr ? "جارٍ جلب التنبيهات من MySQL..." : "Loading alerts from MySQL..."}
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground bg-card/60 rounded-3xl border border-border text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
              {isAr ? "لا توجد تنبيهات جديدة في قاعدة البيانات." : "No incoming alerts in database."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredAlerts.map((alert) => {
                const isCritical = alert.level === 'critical' || alert.level === 'high' || alert.severity === 'danger';
                return (
                  <Card
                    key={alert.id}
                    className={`bg-card/85 backdrop-blur-xl border-l-4 transition-all hover:bg-card/95 rounded-2xl p-5 border-border ${
                      isCritical ? 'border-l-rose-500' : 'border-l-amber-500'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-bold text-foreground text-sm">
                            {alert.title || (isAr ? "تنبيه نظام مبكر" : "Early System Alert")}
                          </h3>
                          {!alert.is_read && (
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-bold rounded-full">
                              {isAr ? "جديد" : "New"}
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={`rounded-full text-[10px] font-bold ${
                              isCritical
                                ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            }`}
                          >
                            {alert.level || (isCritical ? 'High Risk' : 'Medium Watch')}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground bg-secondary/50 p-3 rounded-xl border border-border/60">
                          {alert.message || alert.description || (isAr ? "تم رصد مؤشر تراجع أكاديمي أو سلوكي." : "Risk indicator detected.")}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {alert.created_at || (isAr ? "مؤخراً" : "Recent")}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <Button
                          size="sm"
                          onClick={() => {
                            handleMarkAlertRead(alert.id);
                            navigate(`/advisor/student?id=${alert.recipient_id || alert.student_id || 1}`);
                          }}
                          className="w-full sm:w-auto rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold h-8"
                        >
                          <span>{isAr ? "عرض ملف الطالب" : "View Profile"}</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                        {!alert.is_read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAlertRead(alert.id)}
                            className="w-full sm:w-auto rounded-full text-xs font-semibold h-8"
                          >
                            {isAr ? "تحديد كمقروء" : "Mark Read"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Intervention Review */}
        <TabsContent value="recommendations" className="space-y-4">
          {isLoading ? (
            <div className="py-16 text-center text-muted-foreground text-xs">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
              {isAr ? "جارٍ جلب خطط التدخل من MySQL..." : "Loading recommendations from MySQL..."}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground bg-card/60 rounded-3xl border border-border text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
              {isAr ? "لا توجد خطط تدخل معلقة حالياً." : "No pending intervention recommendations in database."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-sm">
                  <div className="bg-primary/10 p-4 border-b border-border flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="font-bold text-xs text-foreground">
                        {isAr ? `خطة الذكاء الاصطناعي للطالب #${rec.enrollment_id || rec.student_id || rec.id}` : `AI Plan for Student #${rec.enrollment_id || rec.student_id || rec.id}`}
                      </span>
                    </div>
                    <Badge variant="outline" className="border-primary/30 text-primary text-[10px] font-bold rounded-full">
                      {rec.status || 'Active'}
                    </Badge>
                  </div>

                  <CardContent className="p-5 space-y-4">
                    <div className="bg-secondary/40 p-4 rounded-2xl border border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        {isAr ? "الإجراء والتدخل المقترح:" : "Proposed Intervention Action:"}
                      </p>
                      <p className="text-xs text-foreground font-medium leading-relaxed">
                        {rec.action || rec.suggestion || rec.description || (isAr ? "جدولة جلسة إرشاد فردية والتواصل مع المعلم." : "Schedule 1-on-1 academic counseling and coordinate with instructor.")}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {rec.created_at || ""}
                      </span>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/advisor/student?id=${rec.enrollment_id || 1}`)}
                          className="rounded-full text-xs font-semibold h-8"
                        >
                          {isAr ? "سجل الطالب" : "Student View"}
                        </Button>
                        <Button
                          size="sm"
                          disabled={actionLoadingId === rec.id || rec.status === 'approved'}
                          onClick={() => handleApproveRecommendation(rec.id)}
                          className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-8"
                        >
                          {actionLoadingId === rec.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          )}
                          <span>{rec.status === 'approved' ? (isAr ? "معتمد" : "Approved") : (isAr ? "اعتماد الخطة" : "Approve Plan")}</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
