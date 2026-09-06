import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  Settings, AlertTriangle, Shield, Lock, FileText, Save, Loader2, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { api, getApiErrorMessage } from "@/lib/api";

export default function SystemSettingsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [riskThreshold, setRiskThreshold] = useState([75]);
  const [criticalThreshold, setCriticalThreshold] = useState([90]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadAuditLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await api.get('/admin/audit-logs');
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setAuditLogs(data);
    } catch (e) {
      console.warn('[Audit Logs] Fetch error:', e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const loadRiskThresholds = async () => {
    try {
      const res = await api.get('/admin/risk-thresholds');
      if (res.data && res.data.length > 0) {
        setRiskThreshold([res.data[0].threshold || 75]);
      }
    } catch (e) {
      // fallback to current slider default
    }
  };

  useEffect(() => {
    loadAuditLogs();
    loadRiskThresholds();
  }, []);

  const handleSaveThresholds = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await api.post('/admin/risk-thresholds', {
        threshold: riskThreshold[0],
        critical_threshold: criticalThreshold[0],
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      alert(getApiErrorMessage(e, isAr));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            {isAr ? "إعدادات المنظومة والامتثال" : "System Settings & Compliance"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "التحكم في معايير الإنذار الذكي وسياسات حماية البيانات وسجلات التدقيق المباشرة."
              : "Global configuration, security policies, and live audit logs."}
          </p>
        </div>

        <Button
          onClick={handleSaveThresholds}
          disabled={isSaving}
          className="rounded-full bg-primary hover:bg-primary/90 text-foreground text-xs font-bold px-5 h-9 shadow-lg shadow-primary/20"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {saveSuccess ? (isAr ? "تم الحفظ بنجاح ✓" : "Saved ✓") : (isAr ? "حفظ التغييرات" : "Save Changes")}
        </Button>
      </div>

      <Tabs defaultValue="risk" className="w-full">
        <TabsList className="bg-card/85 backdrop-blur-xl border border-border rounded-full p-1 flex flex-wrap h-auto">
          <TabsTrigger value="risk" className="rounded-full text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> {isAr ? "الإنذار وعتبات الخطر" : "Risk & Alerts"}
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-full text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 mr-1.5" /> {isAr ? "الخصوصية والامتثال" : "Security & Privacy"}
          </TabsTrigger>
          <TabsTrigger value="audit" className="rounded-full text-xs font-semibold">
            <FileText className="w-3.5 h-3.5 mr-1.5" /> {isAr ? "سجلات التدقيق (FERPA)" : "Audit Logs"}
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* RISK & ALERTS TAB */}
          <TabsContent value="risk" className="space-y-6">
            <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg text-foreground">{isAr ? "عتبات الإنذار المبكر" : "Risk Thresholds"}</CardTitle>
                <CardDescription className="text-muted-foreground text-xs">
                  {isAr ? "تحديد النسب المئوية التي تطلق تنبيهات الخطر التلقائية للمرشد وأولياء الأمور." : "Configure parameters that trigger automatic student risk escalation."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-6 pt-2">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold text-foreground">{isAr ? "عتبة الخطر المتوسط" : "At-Risk Threshold"} ({riskThreshold}%)</Label>
                    <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">Medium Severity</span>
                  </div>
                  <Slider 
                    value={riskThreshold} 
                    onValueChange={setRiskThreshold} 
                    max={100} 
                    step={1} 
                    className="[&_[role=slider]]:bg-amber-500"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    {isAr ? "يتم تصنيف الطالب تحت المتابعة عند وصول درجة الخطر لهذه النسبة." : "Students reaching this risk score will be highlighted for proactive advisor triage."}
                  </p>
                </div>
                <Separator className="bg-border" />
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold text-foreground">{isAr ? "عتبة الإنذار الحرج" : "Critical Alert Tier"} ({criticalThreshold}%)</Label>
                    <span className="text-xs font-semibold text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full">High Severity</span>
                  </div>
                  <Slider 
                    value={criticalThreshold} 
                    onValueChange={setCriticalThreshold} 
                    max={100} 
                    step={1} 
                    className="[&_[role=slider]]:bg-rose-500"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    {isAr ? "يتم إرسال إشعار فوري لمدير النظام وولي الأمر عند تجاوز هذه النسبة." : "Immediate notification dispatched to System Admins and Parents."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECURITY & POLICY TAB */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary"/> {isAr ? "سياسات حماية البيانات والخصوصية" : "Data Policy & Privacy"}
                </CardTitle>
                <CardDescription className="text-muted-foreground text-xs">
                  {isAr ? "إدارة التشفير وامتثال FERPA." : "Manage data retention, encryption, and privacy rules."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-5 pt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground">{isAr ? "نمط حجب البيانات الشخصية الصارم" : "Strict Anonymization Mode"}</Label>
                    <p className="text-[11px] text-muted-foreground">{isAr ? "حجب هوية الطلاب في النماذج الإحصائية للباحثين." : "Obscure PII for research analytics."}</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <Separator className="bg-border" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground">{isAr ? "التشفير التام للاتصالات" : "Enforce HTTPS & Encrypted WebSockets"}</Label>
                    <p className="text-[11px] text-muted-foreground">{isAr ? "تشفير جميع قنوات البث المباشر." : "Requires encrypted TLS channels."}</p>
                  </div>
                  <Switch checked={true} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AUDIT LOGS TAB */}
          <TabsContent value="audit" className="space-y-6">
            <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-6">
              <CardHeader className="p-0 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg text-foreground">{isAr ? "سجلات تدقيق العمليات (FERPA Audit Trail)" : "Security Audit Log"}</CardTitle>
                    <CardDescription className="text-muted-foreground text-xs">
                      {isAr ? "سجل مباشر وغير قابل للتعديل لجميع العمليات الإدارية المسجلة في MySQL." : "Immutable record of administrative actions logged in MySQL."}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadAuditLogs}
                    disabled={isLoadingLogs}
                    className="rounded-full text-xs h-8 px-3"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingLogs ? 'animate-spin' : ''} mr-1`} />
                    {isAr ? "تحديث" : "Refresh"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-2">
                <div className="rounded-2xl border border-border overflow-hidden bg-card/40">
                  <Table>
                    <TableHeader className="bg-secondary/40">
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground text-xs">{isAr ? "الوقت والتاريخ" : "Timestamp"}</TableHead>
                        <TableHead className="text-muted-foreground text-xs">{isAr ? "الإجراء" : "Action"}</TableHead>
                        <TableHead className="text-muted-foreground text-xs">{isAr ? "المستخدم" : "User"}</TableHead>
                        <TableHead className="text-muted-foreground text-xs">{isAr ? "عنوان IP" : "IP Address"}</TableHead>
                        <TableHead className="text-muted-foreground text-xs">{isAr ? "الحالة" : "Status"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingLogs ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10 text-muted-foreground text-xs">
                            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                            {isAr ? "جارٍ تحميل سجلات التدقيق من MySQL..." : "Loading audit logs..."}
                          </TableCell>
                        </TableRow>
                      ) : auditLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10 text-muted-foreground text-xs">
                            {isAr ? "لا توجد سجلات تدقيق حتى الآن." : "No audit entries recorded yet in database."}
                          </TableCell>
                        </TableRow>
                      ) : (
                        auditLogs.map((log: any, idx) => (
                          <TableRow key={log.id || idx} className="border-border hover:bg-secondary/40 transition-colors">
                            <TableCell className="text-muted-foreground text-xs font-mono">
                              {log.created_at ? new Date(log.created_at).toLocaleString() : "Just now"}
                            </TableCell>
                            <TableCell className="text-foreground font-semibold text-xs">{log.description || log.action || "System Event"}</TableCell>
                            <TableCell className="text-muted-foreground text-xs">{log.causer?.name || log.user || "System Admin"}</TableCell>
                            <TableCell className="text-muted-foreground font-mono text-xs">{log.properties?.ip || "127.0.0.1"}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="rounded-full bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                                Success
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
