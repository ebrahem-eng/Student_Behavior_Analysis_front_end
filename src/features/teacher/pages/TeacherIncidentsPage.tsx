import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AlertOctagon, MessageSquarePlus, Trash2, Search, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
      const [logsRes, usersRes] = await Promise.allSettled([
        api.get('/academic/behavior-logs'),
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
        if (finalStudents.length > 0) {
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
  }, []);

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      await api.post('/academic/behavior-logs', {
        user_id: studentId || 1,
        reporter_id: currentUser?.id || 1,
        type: logType,
        description: description,
        date: date,
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

  const handleDelete = async (id: number | string) => {
    if (!confirm(isAr ? "هل أنت متأكد من حذف هذا السجل؟" : "Are you sure you want to delete this incident log?")) return;
    try {
      await api.delete(`/academic/behavior-logs/${id}`);
      loadData();
    } catch (e) {
      alert(getApiErrorMessage(e, isAr));
    }
  };

  const filteredLogs = behaviorLogs.filter((log) => {
    const studentName = log.user?.name || log.student_name || `Student #${log.user_id || log.id}`;
    const desc = log.description || "";
    return (
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <AlertOctagon className="h-8 w-8 text-rose-500" />
            {isAr ? "رصد السلوك والملاحظات الأكاديمية" : "Behavioral Incidents & Early Alerts"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "تسجيل ومتابعة الملاحظات السلوكية والتنبيهات المباشرة في قاعدة بيانات MySQL."
              : "Log behavioral incidents and positive milestones live to your MySQL database."}
          </p>
        </div>

        <div className="flex items-center gap-3">
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
              <Button className="rounded-full bg-rose-600 hover:bg-rose-700 text-foreground text-xs font-bold px-4 h-9 shadow-lg shadow-rose-500/20 transition-all hover:scale-105">
                <MessageSquarePlus className="mr-2 h-4 w-4" /> {isAr ? "تسجيل ملاحظة / حادثة" : "Report Incident"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card border-border text-foreground rounded-3xl">
              <DialogHeader>
                <DialogTitle>{isAr ? "تسجيل ملاحظة سلوكية" : "Report Behavioral Incident"}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {isAr ? "سيتم إدخال السجل في جدول behavior_logs في MySQL لتحديث مؤشرات الذكاء الاصطناعي." : "Logs incident directly to MySQL behavior_logs table."}
                </DialogDescription>
              </DialogHeader>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateIncident} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{isAr ? "اختيار الطالب" : "Student"}</Label>
                  <Select value={studentId} onValueChange={setStudentId}>
                    <SelectTrigger className="h-10 rounded-xl bg-secondary/60 border-border text-xs">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {users.map((u) => (
                        <SelectItem key={u.id} value={String(u.id)}>
                          {u.name} ({u.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{isAr ? "نوع السلوك" : "Incident Type"}</Label>
                    <Select value={logType} onValueChange={(val: any) => setLogType(val)}>
                      <SelectTrigger className="h-10 rounded-xl bg-secondary/60 border-border text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="negative">{isAr ? "سلبي / مخالفة" : "Negative / Disruption"}</SelectItem>
                        <SelectItem value="warning">{isAr ? "إنذار / تراجع" : "Warning / Grade Drop"}</SelectItem>
                        <SelectItem value="positive">{isAr ? "إيجابي / تميز" : "Positive / Milestone"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{isAr ? "التاريخ" : "Date"}</Label>
                    <Input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{isAr ? "وصف الواقعة أو الملاحظة" : "Description"}</Label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={isAr ? "تفاصيل الملاحظة الأكاديمية أو السلوكية..." : "Describe the incident or behavior..."}
                    className="w-full rounded-xl bg-secondary/60 border border-border text-foreground p-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-full text-xs"
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-rose-600 hover:bg-rose-700 text-foreground text-xs font-bold"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (isAr ? "حفظ الملاحظة" : "Submit Report")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-card/85 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-border space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isAr ? "بحث بالاسم أو التفاصيل..." : "Search behavior logs..."}
              className="pl-9 h-9 rounded-full bg-secondary/60 border-border text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <span className="text-xs font-semibold text-muted-foreground">
            {isAr ? `إجمالي السجلات: ${behaviorLogs.length}` : `Total Logged: ${behaviorLogs.length}`}
          </span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-muted-foreground text-xs">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
            {isAr ? "جارٍ جلب السجلات من MySQL..." : "Loading behavior logs from MySQL..."}
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-xs">
            {isAr ? "لا توجد سجلات سلوكية مسجلة حالياً في قاعدة البيانات." : "No behavior logs found in database."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredLogs.map((log) => {
              const studentName = log.user?.name || `Student #${log.user_id || log.id}`;
              const typeColor = log.type === 'positive'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : log.type === 'warning'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20';

              return (
                <Card key={log.id} className="bg-card/40 border-border hover:border-primary/30 transition-all rounded-2xl overflow-hidden p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{studentName}</h4>
                      <p className="text-[11px] text-muted-foreground font-mono">{log.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`rounded-full capitalize text-[10px] font-bold ${typeColor}`}>
                        {log.type}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(log.id)}
                        className="w-7 h-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-full"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {log.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
