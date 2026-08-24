import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AlertOctagon, MessageSquarePlus, Trash2, Search, Loader2, RefreshCw, Building, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAppStore } from "@/lib/store";

export default function TeacherIncidentsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const currentUser = useAppStore((state) => state.user);

  const [behaviorLogs, setBehaviorLogs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scopeMode, setScopeMode] = useState<"my_reports" | "all_institution">("my_reports");
  const [isLoading, setIsLoading] = useState(true);

  // Dialog Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [studentId, setStudentId] = useState("");
  const [logType, setLogType] = useState<"positive" | "negative" | "warning">("negative");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const isMyReports = scopeMode === "my_reports";

      const [logsRes, usersRes] = await Promise.allSettled([
        api.get('/academic/behavior-logs', {
          params: isMyReports ? { my_reports: true } : {}
        }),
        api.get('/admin/users?role=student'),
      ]);

      if (logsRes.status === 'fulfilled') {
        const data = Array.isArray(logsRes.value.data) ? logsRes.value.data : (logsRes.value.data?.data || []);
        setBehaviorLogs(data);
      }

      if (usersRes.status === 'fulfilled') {
        const allUsers = Array.isArray(usersRes.value.data) ? usersRes.value.data : (usersRes.value.data?.data || []);
        const studentsOnly = allUsers.filter((u: any) => {
          const r = (u.role || '').toLowerCase();
          const roles = Array.isArray(u.roles) ? u.roles.map((x: any) => (typeof x === 'string' ? x : x.name).toLowerCase()) : [];
          return r === 'student' || roles.includes('student');
        });
        const finalStudents = studentsOnly.length > 0 ? studentsOnly : allUsers;
        setUsers(finalStudents);
        if (finalStudents.length > 0 && !studentId) {
          setStudentId(String(finalStudents[0].id));
        }
      }
    } catch (e) {
      console.warn("Behavior logs error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [scopeMode]);

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      await api.post('/academic/behavior-logs', {
        user_id: studentId || users[0]?.id,
        type: logType,
        description,
        date,
      });

      setIsDialogOpen(false);
      setDescription("");
      loadData();
    } catch (err: any) {
      setFormError(getApiErrorMessage(err, isAr));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLog = async (id: number | string) => {
    if (!confirm(isAr ? "هل أنت متأكد من حذف هذا التقرير؟" : "Are you sure you want to delete this incident log?")) return;
    try {
      await api.delete(`/academic/behavior-logs/${id}`);
      loadData();
    } catch (e) {
      alert(getApiErrorMessage(e, isAr));
    }
  };

  const filteredLogs = behaviorLogs.filter((log) => {
    const sName = log.student?.name || "";
    const desc = log.description || "";
    return (
      sName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const instName = currentUser?.institution?.name || (currentUser as any)?.institution_name;
  const colName = currentUser?.college?.name;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <AlertOctagon className="h-8 w-8 text-primary" />
              {isAr ? "تقارير السلوك والملاحظات" : "Behavioral Incident Reports"}
            </h1>
            {instName && (
              <Badge variant="outline" className="rounded-full bg-secondary/80 text-foreground border-border text-xs px-3 py-1 font-bold flex items-center gap-1.5">
                <Building className="w-3 h-3 text-primary" />
                <span>{instName}</span>
              </Badge>
            )}
            {colName && (
              <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/20 text-xs px-3 py-1 font-bold flex items-center gap-1.5">
                <GraduationCap className="w-3 h-3" />
                <span>{colName}</span>
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {isAr
              ? "رصد الملاحظات السلوكية والأكاديمية لطلاب شُعبك وإرسالها مباشرة للإرشاد الأكاديمي."
              : "Log positive and corrective behavioral observations for students in your teaching cohort."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Scope Selector */}
          <Select value={scopeMode} onValueChange={(val: any) => setScopeMode(val)}>
            <SelectTrigger className="w-[160px] rounded-full h-9 bg-card border-border text-xs font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-2xl">
              <SelectItem value="my_reports" className="text-xs font-semibold">
                👤 {isAr ? "ملاحظاتي المسجلة" : "My Logged Reports"}
              </SelectItem>
              <SelectItem value="all_institution" className="text-xs font-semibold">
                🏛️ {isAr ? "ملاحظات المؤسسة" : "All Institution"}
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={isLoading}
            className="rounded-full text-xs font-semibold px-4 h-9 border-border bg-secondary/60 hover:bg-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isAr ? "تحديث" : "Refresh"}</span>
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold px-4 h-9 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <MessageSquarePlus className="mr-1.5 h-4 w-4" /> {isAr ? "رصد ملاحظة جديدة" : "Report Incident"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] bg-card border-border text-foreground rounded-3xl">
              <DialogHeader>
                <DialogTitle>{isAr ? "تسجيل ملاحظة سلوكية / أكاديمية" : "Log Incident Report"}</DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs">
                  {isAr ? "يتم تشفير الوصف وتخزينه في MySQL مع إشعار المرشد الطلابي." : "The observation is securely stored in MySQL for counseling review."}
                </DialogDescription>
              </DialogHeader>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateIncident} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{isAr ? "الطالب" : "Student"}</Label>
                  <Select value={studentId} onValueChange={setStudentId}>
                    <SelectTrigger className="h-10 rounded-xl bg-secondary/60 border-border text-xs">
                      <SelectValue placeholder={isAr ? "اختر الطالب..." : "Select student..."} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-2xl">
                      {users.map((u) => (
                        <SelectItem key={u.id} value={String(u.id)} className="text-xs font-semibold">
                          {u.name} ({u.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{isAr ? "نوع الملاحظة" : "Type"}</Label>
                    <Select value={logType} onValueChange={(val: any) => setLogType(val)}>
                      <SelectTrigger className="h-10 rounded-xl bg-secondary/60 border-border text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border rounded-2xl">
                        <SelectItem value="negative">🔴 {isAr ? "سلوك سلبي / تعثر" : "Negative / At-Risk"}</SelectItem>
                        <SelectItem value="warning">🟡 {isAr ? "تنبيه مبكر" : "Early Warning"}</SelectItem>
                        <SelectItem value="positive">🟢 {isAr ? "تميز / إشادة" : "Positive / Commendation"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="inc-date" className="text-xs font-semibold">{isAr ? "التاريخ" : "Date"}</Label>
                    <Input
                      id="inc-date"
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="inc-desc" className="text-xs font-semibold">{isAr ? "تفاصيل الملاحظة" : "Incident Details"}</Label>
                  <textarea
                    id="inc-desc"
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={isAr ? "اكتب وصفاً دقيقاً للملاحظة السلوكية أو الأكاديمية..." : "Describe the observed behavior or academic issue in detail..."}
                    className="w-full rounded-2xl bg-secondary/60 border border-border p-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-full text-xs font-semibold">
                    {isAr ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="rounded-full bg-primary text-primary-foreground text-xs font-bold px-5">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                    {isAr ? "إرسال التقرير" : "Submit Incident"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3.5" />
        <Input
          placeholder={isAr ? "بحث في الملاحظات أو اسم الطالب..." : "Search incidents or student..."}
          className="pl-10 rtl:pl-3 rtl:pr-10 h-10 rounded-full bg-secondary/60 border-border text-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Incidents Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground text-xs">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
          {isAr ? "جارٍ جلب الملاحظات..." : "Loading incident logs..."}
        </div>
      ) : filteredLogs.length === 0 ? (
        <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-12 text-center text-muted-foreground text-xs">
          <AlertOctagon className="w-10 h-10 text-primary/30 mx-auto mb-2" />
          <p className="font-bold text-foreground text-sm">{isAr ? "لا توجد ملاحظات مسجلة" : "No incident reports found"}</p>
          <p className="mt-1">{isAr ? "سجلك نظيف أو لا توجد ملاحظات تطابق معايير البحث." : "All classroom records are in order."}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLogs.map((log) => {
            const sName = log.student?.name || `Student #${log.user_id}`;
            const sEmail = log.student?.email;

            let badgeVariant = "bg-rose-500/10 text-rose-500 border-rose-500/20";
            let label = isAr ? "ملاحظة سلبية" : "Negative";

            if (log.type === "positive") {
              badgeVariant = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
              label = isAr ? "إشادة / إيجابي" : "Positive";
            } else if (log.type === "warning") {
              badgeVariant = "bg-amber-500/10 text-amber-500 border-amber-500/20";
              label = isAr ? "إنذار مبكر" : "Warning";
            }

            return (
              <Card key={log.id} className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-5 shadow-sm space-y-3 hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{sName}</h3>
                    {sEmail && <p className="text-[11px] text-muted-foreground">{sEmail}</p>}
                  </div>
                  <Badge variant="outline" className={`rounded-full text-xs font-bold px-2.5 py-0.5 ${badgeVariant}`}>
                    {label}
                  </Badge>
                </div>

                <p className="text-xs text-foreground/90 leading-relaxed bg-secondary/40 p-3 rounded-2xl border border-border">
                  {log.description}
                </p>

                <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                  <span className="font-mono">{log.date || new Date().toISOString().split("T")[0]}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteLog(log.id)}
                    className="h-7 w-7 rounded-full text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
