import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, Plus, Search, Trash2, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { Course } from "@/types/api";

export default function TeacherGradesPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [grades, setGrades] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Dialog Form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [studentId, setStudentId] = useState("");
  const [examName, setExamName] = useState("");
  const [score, setScore] = useState("85");
  const [weight, setWeight] = useState("0.2");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [gradesRes, coursesRes, usersRes] = await Promise.allSettled([
        api.get('/academic/grades'),
        api.get('/academic/courses'),
        api.get('/admin/users?role=student'),
      ]);

      if (gradesRes.status === 'fulfilled') {
        const data = Array.isArray(gradesRes.value.data) ? gradesRes.value.data : (gradesRes.value.data?.data || []);
        setGrades(data);
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
  }, []);

  const handleCreateGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      await api.post('/academic/grades', {
        enrollment_id: studentId || 1,
        exam_name: examName,
        score: Number(score),
        weight: Number(weight),
      });

      setIsDialogOpen(false);
      setExamName("");
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
    const studentName = g.student?.name || g.user?.name || `Student #${g.enrollment_id || g.id}`;
    const assessmentName = g.exam_name || g.assessment_name || "";
    return (
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessmentName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            {isAr ? "رصد الدرجات والتقييمات" : "Grades & Evaluation"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "إدخال ومتابعة درجات الواجبات والاختبارات المحفوظة مباشرة في قاعدة بيانات MySQL."
              : "Manage student assessment marks and exam results live from your MySQL academic records."}
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
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold px-4 h-9 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <Plus className="mr-2 h-4 w-4" /> {isAr ? "رصد درجة جديدة" : "Record Grade"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] bg-card border-border text-foreground rounded-3xl">
              <DialogHeader>
                <DialogTitle>{isAr ? "رصد درجة تقييم جديدة" : "Record New Assessment Score"}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {isAr ? "سيتم إدخال الدرجة مباشرة في جدول grades في MySQL لتحديث مؤشر الذكاء الاصطناعي." : "Scores are saved to MySQL and feed into the AI risk scoring model."}
                </DialogDescription>
              </DialogHeader>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateGrade} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{isAr ? "اختيار الطالب" : "Select Student"}</Label>
                  <Select value={studentId} onValueChange={setStudentId}>
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
                  <Label className="text-xs font-semibold">{isAr ? "اسم التقييم / الاختبار" : "Assessment Name"}</Label>
                  <Input
                    required
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="E.g. Midterm Exam 1"
                    className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{isAr ? "الدرجة (من 100)" : "Score (0-100)"}</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{isAr ? "الوزن النسبي" : "Weight (0-1.0)"}</Label>
                    <Input
                      type="number"
                      step="0.05"
                      min="0.05"
                      max="1"
                      required
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
                    />
                  </div>
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
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (isAr ? "حفظ الدرجة" : "Save Grade")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-card/85 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isAr ? "بحث بالطالب أو الاختبار..." : "Search grades..."}
              className="pl-9 h-9 rounded-full bg-secondary/60 border-border text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[180px] rounded-full h-9 bg-secondary/60 border-border text-xs font-bold">
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

        <div className="rounded-2xl border border-border overflow-hidden bg-card/40">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground text-xs">{isAr ? "الرقم / المعرف" : "Record ID"}</TableHead>
                <TableHead className="text-muted-foreground text-xs">{isAr ? "اسم التقييم" : "Assessment"}</TableHead>
                <TableHead className="text-muted-foreground text-xs">{isAr ? "الدرجة" : "Score"}</TableHead>
                <TableHead className="text-muted-foreground text-xs">{isAr ? "التقدير" : "Grade"}</TableHead>
                <TableHead className="text-muted-foreground text-xs">{isAr ? "الوزن" : "Weight"}</TableHead>
                <TableHead className="text-right text-muted-foreground text-xs">{isAr ? "الإجراءات" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                    {isAr ? "جارٍ جلب الدرجات من MySQL..." : "Loading grades from MySQL..."}
                  </TableCell>
                </TableRow>
              ) : filteredGrades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                    {isAr ? "لا توجد درجات مسجلة في قاعدة البيانات حالياً." : "No grade records found in database."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredGrades.map((g) => {
                  const numScore = Number(g.score || 0);
                  const letter = numScore >= 90 ? "A" : numScore >= 80 ? "B" : numScore >= 70 ? "C" : numScore >= 60 ? "D" : "F";
                  const badgeColor = numScore >= 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : numScore >= 60 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20";

                  return (
                    <TableRow key={g.id} className="border-border hover:bg-secondary/40 transition-colors">
                      <TableCell className="text-xs font-mono text-muted-foreground">#{g.id}</TableCell>
                      <TableCell className="text-xs font-semibold text-foreground">{g.exam_name || g.assessment_name || "Assignment"}</TableCell>
                      <TableCell className="text-xs font-bold text-foreground font-mono">{numScore}%</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[11px] font-bold rounded-full ${badgeColor}`}>
                          {letter}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">{((Number(g.weight || 0.2)) * 100).toFixed(0)}%</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGrade(g.id)}
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
      </div>
    </div>
  );
}
