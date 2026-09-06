import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  Award,
  Loader2,
  RefreshCw,
  Building,
  GraduationCap,
  School,
  Sparkles,
  FileCheck,
  Percent
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

export default function TeacherGradesPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const currentUser = useAppStore((state) => state.user);

  const [grades, setGrades] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [scopeMode, setScopeMode] = useState<"my_sections" | "all_institution">("my_sections");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Dialog Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [targetCourseId, setTargetCourseId] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [examName, setExamName] = useState<string>("");
  const [score, setScore] = useState<string>("");
  const [weight, setWeight] = useState<string>("0.2");

  const isSchool = currentUser?.institution?.type === 'school';

  const loadData = async () => {
    setIsLoading(true);
    try {
      const isMySections = scopeMode === "my_sections";
      const instParams = selectedInstitution !== "all" ? { institution_id: selectedInstitution } : {};

      const [gradesRes, coursesRes, usersRes, instRes] = await Promise.allSettled([
        api.get('/academic/grades', {
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

      if (gradesRes.status === 'fulfilled') {
        const data = Array.isArray(gradesRes.value.data) ? gradesRes.value.data : (gradesRes.value.data?.data || []);
        setGrades(data);
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
        if (finalStudents.length > 0 && !studentId) {
          setStudentId(String(finalStudents[0].id));
        }
      }
    } catch (e) {
      console.warn("Grades load error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCourse, scopeMode, selectedInstitution]);

  const handleCreateGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCourseId || !studentId || !score) {
      setFormError(isAr ? "يرجى تحديد المادة الدراسية، الطالب، والدرجة المستحقة." : "Please select course, student, and score.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await api.post('/academic/grades', {
        course_id: targetCourseId,
        student_id: studentId,
        exam_name: examName.trim() || (isAr ? "تقييم فصلي" : "Course Assessment"),
        score: Number(score),
        weight: Number(weight) || 0.20,
      });

      setIsDialogOpen(false);
      setExamName("");
      setScore("");
      loadData();
    } catch (err: any) {
      setFormError(getApiErrorMessage(err, isAr));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGrade = async (id: number | string) => {
    if (!confirm(isAr ? "هل أنت متأكد من حذف هذه الدرجة؟" : "Are you sure you want to delete this grade record?")) return;
    try {
      await api.delete(`/academic/grades/${id}`);
      loadData();
    } catch (e) {
      alert(getApiErrorMessage(e, isAr));
    }
  };

  const filteredGrades = grades.filter((g) => {
    const student = g.enrollment?.student || g.student;
    const course = g.enrollment?.section?.course || g.course;
    const sName = student?.name || "";
    const cName = course?.name || "";
    const exam = g.exam_name || "";

    const matchesSearch =
      sName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse = selectedCourse === "all" || String(course?.id) === String(selectedCourse);

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
              <BookOpen className="h-8 w-8 text-primary" />
              {isAr ? "رصد وتقييم درجات الطلاب" : "Grades & Evaluation"}
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
              ? "رصد وتعديل درجات الطلاب في المواد والشُعب المسندة إليك ومتابعة السجل الأكاديمي في MySQL."
              : "Record, evaluate, and manage student grades for your assigned subjects live in MySQL."}
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
                <Plus className="mr-1.5 h-4 w-4" /> {isAr ? "رصد درجة جديدة" : "Record Grade"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px] bg-card border-border text-foreground rounded-3xl">
              <DialogHeader>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <DialogTitle>{isAr ? "رصد تقييم ودرجة جديدة لطالب" : "Record Student Grade"}</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-xs">
                      {isAr ? "حدد المادة الدراسية، الطالب، ونوع التقييم لحفظ الدرجة مباشرة في MySQL." : "Select subject, student, and evaluation type to save to MySQL."}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateGrade} className="space-y-4 py-2">
                {/* 1. Course / Subject Selector */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    <span>{isAr ? (isSchool ? "المادة الدراسية / الفصل" : "المقرر الدراسي / الشعبة") : "Course / Subject"}</span>
                  </Label>
                  <Select value={targetCourseId} onValueChange={setTargetCourseId}>
                    <SelectTrigger className="h-10 rounded-xl bg-secondary/60 border-border text-xs font-semibold">
                      <SelectValue placeholder={isAr ? "اختر المادة أو المقرر الدراسي..." : "Select course or subject..."} />
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
                    <span>{isAr ? "الطالب المستهدف" : "Student"}</span>
                  </Label>
                  <Select value={studentId} onValueChange={setStudentId}>
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

                {/* 3. Assessment Presets & Title */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="exam-name" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-primary" />
                      <span>{isAr ? "عنوان التقييم / نوع الاختبار" : "Assessment Title"}</span>
                    </Label>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-primary" /> {isAr ? "قوالب سريعة" : "Presets"}
                    </span>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => { setExamName(isAr ? "اختبار قصير 1 (Quiz 1)" : "Quiz 1"); setWeight("0.1"); }}
                      className="text-[10px] font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border transition-all"
                    >
                      📝 {isAr ? "اختبار قصير" : "Quiz"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setExamName(isAr ? "اختبار منتصف الفصل (Midterm Exam)" : "Midterm Exam"); setWeight("0.3"); }}
                      className="text-[10px] font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border transition-all"
                    >
                      📑 {isAr ? "اختبار نصفي" : "Midterm"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setExamName(isAr ? "مشروع عملي / واجب (Project)" : "Applied Project"); setWeight("0.2"); }}
                      className="text-[10px] font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border transition-all"
                    >
                      📊 {isAr ? "مشروع / واجب" : "Project"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setExamName(isAr ? "الاختبار النهائي (Final Exam)" : "Final Exam"); setWeight("0.4"); }}
                      className="text-[10px] font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border transition-all"
                    >
                      🎓 {isAr ? "اختبار نهائي" : "Final"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setExamName(isAr ? "مشاركة وتفاعل صفي (Participation)" : "Class Participation"); setWeight("0.1"); }}
                      className="text-[10px] font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border transition-all"
                    >
                      🌟 {isAr ? "مشاركة" : "Participation"}
                    </button>
                  </div>

                  <Input
                    id="exam-name"
                    required
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder={isAr ? "مثال: اختبار الوحدة الأولى / Midterm Exam" : "E.g. Unit 1 Quiz / Midterm"}
                    className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
                  />
                </div>

                {/* 4. Score & Weight Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="score" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-primary" />
                      <span>{isAr ? "الدرجة المحصلة (من 100)" : "Score (out of 100)"}</span>
                    </Label>
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      placeholder="85"
                      className="h-10 rounded-xl bg-secondary/60 border-border text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="weight" className="text-xs font-bold text-foreground">
                      {isAr ? "الوزن النسبي للتقييم" : "Weight (0 - 1.0)"}
                    </Label>
                    <Select value={weight} onValueChange={setWeight}>
                      <SelectTrigger className="h-10 rounded-xl bg-secondary/60 border-border text-xs font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border rounded-2xl">
                        <SelectItem value="0.10" className="text-xs">10% ({isAr ? "واجبات ومشاركة" : "Participation"})</SelectItem>
                        <SelectItem value="0.15" className="text-xs">15% ({isAr ? "اختبار قصير" : "Quiz"})</SelectItem>
                        <SelectItem value="0.20" className="text-xs">20% ({isAr ? "مشروع فصلي" : "Project"})</SelectItem>
                        <SelectItem value="0.30" className="text-xs">30% ({isAr ? "اختبار نصفي" : "Midterm"})</SelectItem>
                        <SelectItem value="0.40" className="text-xs">40% ({isAr ? "اختبار نهائي" : "Final"})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-full text-xs font-semibold">
                    {isAr ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="rounded-full bg-primary text-primary-foreground text-xs font-bold px-5">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                    {isAr ? "حفظ الدرجة في MySQL" : "Save Grade Record"}
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
            placeholder={isAr ? "بحث بالطالب، الاختبار، المقرر..." : "Search student, exam, course..."}
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
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "الاختبار / التقييم" : "Assessment"}</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "الدرجة" : "Score"}</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "الوزن" : "Weight"}</TableHead>
              <TableHead className="text-right rtl:text-left text-xs font-bold text-muted-foreground uppercase">{isAr ? "الإجراءات" : "Actions"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                  {isAr ? "جارٍ جلب الدرجات من MySQL..." : "Loading grades from MySQL..."}
                </TableCell>
              </TableRow>
            ) : filteredGrades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                  <Award className="w-8 h-8 mx-auto mb-2 text-primary/30" />
                  {isAr ? "لا توجد درجات مسجلة مطابقة للبحث." : "No grade records found."}
                </TableCell>
              </TableRow>
            ) : (
              filteredGrades.map((g) => {
                const student = g.enrollment?.student || g.student;
                const course = g.enrollment?.section?.course || g.course;
                const scoreVal = Number(g.score || 0);

                let scoreBadge = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                if (scoreVal < 60) scoreBadge = "bg-rose-500/10 text-rose-500 border-rose-500/20";
                else if (scoreVal < 75) scoreBadge = "bg-amber-500/10 text-amber-500 border-amber-500/20";

                return (
                  <TableRow key={g.id} className="border-border hover:bg-secondary/30 transition-colors">
                    <TableCell className="py-3">
                      <div>
                        <p className="font-bold text-xs text-foreground">{student?.name || `Student #${g.enrollment_id}`}</p>
                        <p className="text-[11px] text-muted-foreground">{student?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      {course?.name ? `${course.code ? `[${course.code}] ` : ''}${course.name}` : (isAr ? "مقرر عام" : "General Course")}
                    </TableCell>
                    <TableCell className="text-xs text-foreground font-semibold">
                      {g.exam_name || "Assessment"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-full text-xs font-mono font-bold px-2.5 py-0.5 ${scoreBadge}`}>
                        {scoreVal}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {g.weight ? `${Number(g.weight) * 100}%` : "20%"}
                    </TableCell>
                    <TableCell className="text-right rtl:text-left">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteGrade(g.id)}
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
