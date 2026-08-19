import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { UserCheck, Search, Plus, Trash2, Calendar as CalendarIcon, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { api, getApiErrorMessage } from "@/lib/api";

export default function TeacherAttendancePage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [attendances, setAttendances] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [targetUserId, setTargetUserId] = useState("");
  const [status, setStatus] = useState<"present" | "absent" | "late">("present");
  const [notes, setNotes] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [attRes, coursesRes, usersRes] = await Promise.allSettled([
        api.get('/academic/attendances'),
        api.get('/academic/courses'),
        api.get('/admin/users?role=student'),
      ]);

      if (attRes.status === 'fulfilled') {
        const data = Array.isArray(attRes.value.data) ? attRes.value.data : (attRes.value.data?.data || []);
        setAttendances(data);
      }

      if (coursesRes.status === 'fulfilled') {
        const data = Array.isArray(coursesRes.value.data) ? coursesRes.value.data : (coursesRes.value.data?.data || []);
        setCourses(data);
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
          setTargetUserId(String(finalStudents[0].id));
        }
      }
    } catch (e) {
      console.warn("Attendance load error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      await api.post('/academic/attendances', {
        user_id: targetUserId || 1,
        section_id: 1,
        date: date,
        status: status,
        notes: notes,
      });

      setIsDialogOpen(false);
      setNotes("");
      loadData();
    } catch (err: any) {
      setFormError(getApiErrorMessage(err, isAr));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm(isAr ? "هل أنت متأكد من حذف هذا السجل؟" : "Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`/academic/attendances/${id}`);
      loadData();
    } catch (e) {
      alert(getApiErrorMessage(e, isAr));
    }
  };

  // Summary counts
  const presentCount = attendances.filter((a) => a.status === "present").length;
  const absentCount = attendances.filter((a) => a.status === "absent").length;
  const lateCount = attendances.filter((a) => a.status === "late").length;
  const totalCount = attendances.length || 1;
  const attendancePercentage = ((presentCount / totalCount) * 100).toFixed(0);

  const filteredAttendances = attendances.filter((a) => {
    const studentName = a.user?.name || a.student_name || `Student #${a.user_id || a.id}`;
    const notesStr = a.notes || "";
    return (
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notesStr.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserCheck className="h-8 w-8 text-primary" />
            {isAr ? "سجل الحضور والغياب اليومي" : "Daily Attendance & Tracking"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "رصد الحضور اليومي للمحاضرات وحفظه مباشرة في قاعدة بيانات MySQL."
              : "Log student presence, lateness, and absences directly to your MySQL database."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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

          <div className="flex items-center gap-2 bg-secondary/60 border border-border rounded-full px-3.5 h-9">
            <CalendarIcon className="w-3.5 h-3.5 text-primary" />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-0 bg-transparent text-foreground text-xs focus-visible:ring-0 p-0 h-auto"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold px-4 h-9 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <Plus className="mr-2 h-4 w-4" /> {isAr ? "تسجيل حضور جديد" : "Log Attendance"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] bg-card border-border text-foreground rounded-3xl">
              <DialogHeader>
                <DialogTitle>{isAr ? "تسجيل حالة حضور طالب" : "Log Student Attendance"}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {isAr ? "يتم حفظ السجل مباشرة في جدول attendances في MySQL." : "Saves record directly to MySQL attendances table."}
                </DialogDescription>
              </DialogHeader>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateAttendance} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{isAr ? "اختيار الطالب" : "Select Student"}</Label>
                  <Select value={targetUserId} onValueChange={setTargetUserId}>
                    <SelectTrigger className="h-10 rounded-xl bg-secondary/60 border-border text-xs">
                      <SelectValue placeholder="Choose student" />
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

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{isAr ? "الحالة" : "Attendance Status"}</Label>
                  <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                    <SelectTrigger className="h-10 rounded-xl bg-secondary/60 border-border text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="present">{isAr ? "حاضر (Present)" : "Present"}</SelectItem>
                      <SelectItem value="absent">{isAr ? "غائب (Absent)" : "Absent"}</SelectItem>
                      <SelectItem value="late">{isAr ? "متأخر (Late)" : "Late"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{isAr ? "ملاحظات إضافية (اختياري)" : "Notes (Optional)"}</Label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g. Excused with medical certificate"
                    className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
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
                    className="rounded-full bg-primary text-primary-foreground text-xs font-bold"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (isAr ? "حفظ الحضور" : "Save Record")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Summary Card */}
        <Card className="bg-card/85 backdrop-blur-xl border-border rounded-3xl p-6 md:col-span-3 lg:col-span-1">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base font-bold text-foreground flex items-center justify-between">
              <span>{isAr ? "ملخص الحضور اليومي" : "Daily Summary"}</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-bold">
                {attendancePercentage}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-2xl border border-border">
              <span className="text-xs text-muted-foreground">{isAr ? "إجمالي السجلات" : "Total Logged"}</span>
              <span className="text-foreground font-bold text-base">{attendances.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{isAr ? "حاضر" : "Present"}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base">{presentCount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
              <span className="text-xs text-rose-500 font-semibold">{isAr ? "غائب" : "Absent"}</span>
              <span className="text-rose-500 font-bold text-base">{absentCount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              <span className="text-xs text-amber-500 font-semibold">{isAr ? "متأخر" : "Late"}</span>
              <span className="text-amber-500 font-bold text-base">{lateCount}</span>
            </div>
          </CardContent>
        </Card>

        {/* Class Roster Table Card */}
        <Card className="bg-card/85 backdrop-blur-xl border-border rounded-3xl p-6 md:col-span-3 lg:col-span-2">
          <CardHeader className="p-0 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <CardTitle className="text-base font-bold text-foreground">
              {isAr ? "كشف الحضور اليومي" : "Class Attendance Roster"}
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isAr ? "بحث بالطالب أو الملاحظة..." : "Search students..."}
                  className="pl-9 h-9 rounded-full bg-secondary/60 border-border text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-[160px] rounded-full h-9 bg-secondary/60 border-border text-xs font-bold">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">{isAr ? "جميع المقررات" : "All Courses"}</SelectItem>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.code ? `${c.code} - ${c.name || c.title || 'Course'}` : (c.name || c.title || 'Course')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="rounded-2xl border border-border overflow-hidden bg-card/40">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground text-xs">{isAr ? "الطالب / المستخدم" : "Student"}</TableHead>
                    <TableHead className="text-muted-foreground text-xs">{isAr ? "الحالة" : "Status"}</TableHead>
                    <TableHead className="text-muted-foreground text-xs">{isAr ? "التاريخ" : "Date"}</TableHead>
                    <TableHead className="text-muted-foreground text-xs">{isAr ? "ملاحظات" : "Notes"}</TableHead>
                    <TableHead className="text-right text-muted-foreground text-xs">{isAr ? "الإجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-xs">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                        {isAr ? "جارٍ جلب سجلات الحضور من MySQL..." : "Loading attendance from MySQL..."}
                      </TableCell>
                    </TableRow>
                  ) : filteredAttendances.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-xs">
                        {isAr ? "لا توجد سجلات حضور مسجلة لهذا التاريخ." : "No attendance records found."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAttendances.map((a) => {
                      const studentName = a.user?.name || `Student #${a.user_id || a.id}`;
                      const statusColor = a.status === 'present' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : a.status === 'late' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20';

                      return (
                        <TableRow key={a.id} className="border-border hover:bg-secondary/40 transition-colors">
                          <TableCell className="font-semibold text-foreground text-xs">{studentName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`rounded-full capitalize text-[10px] font-bold ${statusColor}`}>
                              {a.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground font-mono">{a.date}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{a.notes || "-"}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(a.id)}
                              className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-full h-8 px-2.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
