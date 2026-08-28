import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  UserCheck,
  Search,
  Plus,
  Trash2,
  Loader2,
  RefreshCw,
  Building,
  GraduationCap,
  School,
  BookOpen,
  CalendarDays,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
import { useAppStore } from "@/lib/store";

export default function TeacherAttendancePage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const currentUser = useAppStore((state) => state.user);

  const [attendances, setAttendances] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [scopeMode, setScopeMode] = useState<"my_sections" | "all_institution">("my_sections");
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [targetCourseId, setTargetCourseId] = useState<string>("");
  const [targetUserId, setTargetUserId] = useState("");
  const [status, setStatus] = useState<"present" | "absent" | "late">("present");
  const [notes, setNotes] = useState("");

  const isSchool = currentUser?.institution?.type === 'school';

  const loadData = async () => {
    setIsLoading(true);
    try {
      const isMySections = scopeMode === "my_sections";
      const instParams = selectedInstitution !== "all" ? { institution_id: selectedInstitution } : {};

      const [attRes, coursesRes, usersRes, instRes] = await Promise.allSettled([
        api.get('/academic/attendances', {
          params: {
            ...(isMySections ? { my_sections: true } : {}),
            ...(selectedCourse !== 'all' ? { course_id: selectedCourse } : {}),
            ...instParams,
          }
        }),
        api.get('/academic/courses', {
          params: {
            ...(isMySections ? { my_courses: true } : {}),
            ...instParams,
          }
        }),
        api.get('/admin/users', {
          params: {
            role: 'student',
            ...(targetCourseId ? { course_id: targetCourseId } : {}),
            ...instParams,
          }
        }),
        api.get('/admin/institutions', {
          params: { my_affiliations: true }
        }),
      ]);

      if (instRes.status === 'fulfilled') {
        const data = Array.isArray(instRes.value.data) ? instRes.value.data : (instRes.value.data?.data || []);
        setInstitutions(data);
      }

      if (attRes.status === 'fulfilled') {
        const data = Array.isArray(attRes.value.data) ? attRes.value.data : (attRes.value.data?.data || []);
        setAttendances(data);
      }

      if (coursesRes.status === 'fulfilled') {
        const data = Array.isArray(coursesRes.value.data) ? coursesRes.value.data : (coursesRes.value.data?.data || []);
        setCourses(data);
        if (data.length > 0 && !targetCourseId) {
          setTargetCourseId(String(data[0].id));
        }
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
        if (finalStudents.length > 0 && !targetUserId) {
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
  }, [selectedCourse, scopeMode, selectedInstitution]);

  const handleCreateAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCourseId || !targetUserId) {
      setFormError(isAr ? "يرجى اختيار المادة الدراسية والطالب." : "Please select course and student.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await api.post('/academic/attendances', {
        user_id: targetUserId,
        course_id: targetCourseId,
        date: date,
        status: status,
        notes: notes.trim() || undefined,
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

  const handleDeleteAttendance = async (id: number | string) => {
    if (!confirm(isAr ? "هل أنت متأكد من حذف هذا السجل؟" : "Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`/academic/attendances/${id}`);
      loadData();
    } catch (e) {
      alert(getApiErrorMessage(e, isAr));
    }
  };

  const filteredAttendances = attendances.filter((att) => {
    const sName = att.student?.name || "";
    const cName = att.section?.course?.name || "";
    const notesText = att.notes || "";

    const matchesSearch =
      sName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notesText.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse = selectedCourse === "all" || String(att.section?.course_id || att.section?.course?.id) === String(selectedCourse);

    return matchesSearch && matchesCourse;
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
              <UserCheck className="h-8 w-8 text-primary" />
              {isAr ? "سجل الحضور والغياب" : "Attendance Logging"}
            </h1>
            {instName && (
              <Badge variant="outline" className="rounded-full bg-secondary/80 text-foreground border-border text-xs px-3 py-1 font-bold flex items-center gap-1.5">
                {currentUser?.institution?.type === 'school' ? <School className="w-3 h-3 text-emerald-500" /> : <Building className="w-3 h-3 text-primary" />}
                <span>{instName}</span>
              </Badge>
            )}
            {colName && (
              <Badge
                variant="outline"
                className={`rounded-full text-xs px-3 py-1 font-bold flex items-center gap-1.5 ${
                  currentUser?.institution?.type === 'school'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-primary/10 text-primary border-primary/20'
                }`}
              >
                {currentUser?.institution?.type === 'school' ? <School className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                <span>{colName}</span>
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {isAr
              ? "تسجيل حضور وغياب الطلاب في المواد والشُعب المسندة ومتابعة نسب الالتزام في MySQL."
              : "Track classroom attendance and compliance live for your assigned subjects in MySQL."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Active Teaching Institution Context Selector */}
          {institutions.length > 0 && (
            <Select value={selectedInstitution} onValueChange={(val: any) => { setSelectedInstitution(val); setSelectedCourse("all"); }}>
              <SelectTrigger className="w-[170px] rounded-full h-9 bg-card border-border text-xs font-bold">
                <SelectValue placeholder={isAr ? "المؤسسة التعليمية" : "Institution"} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border rounded-2xl">
                <SelectItem value="all" className="text-xs font-semibold">
                  🌐 {isAr ? "كافة المؤسسات التدريسية" : "All Affiliations"}
                </SelectItem>
                {institutions.map((inst) => (
                  <SelectItem key={inst.id} value={String(inst.id)} className="text-xs font-semibold">
                    {inst.type === 'school' ? '🏫 ' : '🎓 '}{inst.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Scope Selector */}
          <Select value={scopeMode} onValueChange={(val: any) => setScopeMode(val)}>
            <SelectTrigger className="w-[160px] rounded-full h-9 bg-card border-border text-xs font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-2xl">
              <SelectItem value="my_sections" className="text-xs font-semibold">
                👤 {isAr ? "شُعبي وموادي" : "My Taught Classes"}
              </SelectItem>
              <SelectItem value="all_institution" className="text-xs font-semibold">
                🏛️ {isAr ? "جميع المواد بالمؤسسة" : "All Institution"}
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
                <Plus className="mr-1.5 h-4 w-4" /> {isAr ? "تسجيل حضور جديد" : "Log Attendance"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card border-border text-foreground rounded-3xl">
              <DialogHeader>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <DialogTitle>{isAr ? "تسجيل حالة حضور لطالب" : "Log Student Attendance"}</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-xs">
                      {isAr ? "حدد المادة، الطالب، وتاريخ الجلسة لتحديث سجل الحضور مباشرة." : "Select subject, student, and status to record in MySQL."}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateAttendance} className="space-y-4 py-2">
                {/* 1. Subject / Course Selector */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    <span>{isAr ? (isSchool ? "المادة الدراسية / الفصل" : "المقرر الدراسي / الشعبة") : "Course / Subject"}</span>
                  </Label>
                  <Select value={targetCourseId} onValueChange={setTargetCourseId}>
                    <SelectTrigger className="h-10 rounded-xl bg-secondary/60 border-border text-xs font-semibold">
                      <SelectValue placeholder={isAr ? "اختر المادة الدراسية..." : "Select course or subject..."} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-2xl max-h-56">
                      {courses.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)} className="text-xs font-semibold">
                          {c.code ? `[${c.code}] ` : ''}{c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Student Selector */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    {isSchool ? <School className="w-3.5 h-3.5 text-emerald-500" /> : <GraduationCap className="w-3.5 h-3.5 text-primary" />}
                    <span>{isAr ? "الطالب" : "Student"}</span>
                  </Label>
                  <Select value={targetUserId} onValueChange={setTargetUserId}>
                    <SelectTrigger className="h-10 rounded-xl bg-secondary/60 border-border text-xs font-semibold">
                      <SelectValue placeholder={isAr ? "اختر الطالب..." : "Select student..."} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-2xl max-h-56">
                      {users.map((u) => (
                        <SelectItem key={u.id} value={String(u.id)} className="text-xs font-semibold">
                          {u.name} ({u.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. Status and Date Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">{isAr ? "حالة الحضور" : "Attendance Status"}</Label>
                    <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                      <SelectTrigger className="h-10 rounded-xl bg-secondary/60 border-border text-xs font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border rounded-2xl">
                        <SelectItem value="present" className="text-xs font-bold text-emerald-600">🟢 {isAr ? "حاضر" : "Present"}</SelectItem>
                        <SelectItem value="late" className="text-xs font-bold text-amber-600">🟡 {isAr ? "متأخر" : "Late"}</SelectItem>
                        <SelectItem value="absent" className="text-xs font-bold text-rose-600">🔴 {isAr ? "غائب" : "Absent"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="att-date" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-primary" />
                      <span>{isAr ? "التاريخ" : "Date"}</span>
                    </Label>
                    <Input
                      id="att-date"
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
                    />
                  </div>
                </div>

                {/* 4. Notes */}
                <div className="space-y-1.5">
                  <Label htmlFor="att-notes" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span>{isAr ? "ملاحظات وتبريرات (اختياري)" : "Notes / Excuse (Optional)"}</span>
                  </Label>
                  <Input
                    id="att-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={isAr ? "مثال: بعذر طبي معتمد / تأخر 10 دقائق" : "E.g. Approved medical excuse / 10m late"}
                    className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-full text-xs font-semibold">
                    {isAr ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="rounded-full bg-primary text-primary-foreground text-xs font-bold px-5">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                    {isAr ? "حفظ الحضور في MySQL" : "Save Attendance"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3.5" />
          <Input
            placeholder={isAr ? "بحث بالطالب، الشعبة، الملاحظات..." : "Search student, class, notes..."}
            className="pl-10 rtl:pl-3 rtl:pr-10 h-10 rounded-full bg-secondary/60 border-border text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-full sm:w-[220px] rounded-full h-10 bg-card border-border text-xs font-bold">
            <SelectValue placeholder={isAr ? "جميع المقررات" : "All Courses"} />
          </SelectTrigger>
          <SelectContent className="bg-card border-border rounded-2xl">
            <SelectItem value="all">{isAr ? "جميع المواد والمقررات" : "All Courses & Subjects"}</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.code ? `${c.code} - ${c.name || 'Course'}` : (c.name || 'Course')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table Card */}
      <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow className="border-border">
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "الطالب" : "Student"}</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "المادة / المقرر" : "Subject / Course"}</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "حالة الحضور" : "Status"}</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "التاريخ" : "Date"}</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "ملاحظات" : "Notes"}</TableHead>
              <TableHead className="text-right rtl:text-left text-xs font-bold text-muted-foreground uppercase">{isAr ? "الإجراءات" : "Actions"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                  {isAr ? "جارٍ جلب سجلات الحضور من MySQL..." : "Loading attendance records from MySQL..."}
                </TableCell>
              </TableRow>
            ) : filteredAttendances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                  <UserCheck className="w-8 h-8 mx-auto mb-2 text-primary/30" />
                  {isAr ? "لا توجد سجلات حضور مسجلة." : "No attendance records found."}
                </TableCell>
              </TableRow>
            ) : (
              filteredAttendances.map((att) => {
                const sName = att.student?.name || `Student #${att.user_id}`;
                const sEmail = att.student?.email;
                const cName = att.section?.course?.name || (isAr ? "مقرر عام" : "General Course");
                const cCode = att.section?.course?.code;

                let badgeColor = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                let statusLabel = isAr ? "حاضر" : "Present";
                if (att.status === "absent") {
                  badgeColor = "bg-rose-500/10 text-rose-500 border-rose-500/20";
                  statusLabel = isAr ? "غائب" : "Absent";
                } else if (att.status === "late") {
                  badgeColor = "bg-amber-500/10 text-amber-500 border-amber-500/20";
                  statusLabel = isAr ? "متأخر" : "Late";
                }

                return (
                  <TableRow key={att.id} className="border-border hover:bg-secondary/30 transition-colors">
                    <TableCell className="py-3">
                      <div>
                        <p className="font-bold text-xs text-foreground">{sName}</p>
                        {sEmail && <p className="text-[11px] text-muted-foreground">{sEmail}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      {cCode ? `[${cCode}] ` : ''}{cName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-full text-xs font-bold px-2.5 py-0.5 ${badgeColor}`}>
                        {statusLabel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {att.date}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                      {att.notes || "-"}
                    </TableCell>
                    <TableCell className="text-right rtl:text-left">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteAttendance(att.id)}
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
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
      </Card>
    </div>
  );
}
