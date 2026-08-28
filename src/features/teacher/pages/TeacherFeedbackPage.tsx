import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Sparkles,
  Bot,
  Send,
  Loader2,
  RefreshCw,
  Building,
  GraduationCap,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BrainCircuit,
  FileCheck,
  Plus,
  Users,
  School
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAppStore } from "@/lib/store";

export default function TeacherFeedbackPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const currentUser = useAppStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [behaviorLogs, setBehaviorLogs] = useState<any[]>([]);

  // Create Recommendation Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [newStudentId, setNewStudentId] = useState<string>("");
  const [newAction, setNewAction] = useState<string>("");

  // AI Interactive Assistant for Teaching
  const [chatPrompt, setChatPrompt] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ sender: "user" | "ai"; text: string }[]>([
    {
      sender: "ai",
      text: isAr
        ? "مرحباً بك يا دكتور! أنا مساعدك البيداغوجي الذكي في منصة SBA. أقوم بتحليل نتائج الطلاب في شُعبك، واقتراح خطط تدريس علاجية، وتوليد أسئلة اختبارات قصيرة وتغذية راجعة فردية."
        : "Welcome, Professor! I am your AI Pedagogical Assistant. I analyze student performance across your active courses, recommend remedial interventions, generate quiz items, and draft individualized feedback."
    }
  ]);

  const [actionNotes, setActionNotes] = useState<Record<number, string>>({});
  const [isLoggingAction, setIsLoggingAction] = useState<number | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const instParams = selectedInstitution !== "all" ? { institution_id: selectedInstitution } : {};

      const [coursesRes, recsRes, gradesRes, attendancesRes, logsRes, studentsRes, instRes] = await Promise.allSettled([
        api.get('/academic/courses', { params: { my_courses: true, ...instParams } }),
        api.get('/academic/recommendations', { params: instParams }),
        api.get('/academic/grades', { params: { my_sections: true, ...instParams } }),
        api.get('/academic/attendances', { params: { my_sections: true, ...instParams } }),
        api.get('/academic/behavior-logs', { params: { my_reports: true, ...instParams } }),
        api.get('/admin/users', { params: { role: 'student', ...instParams } }),
        api.get('/admin/institutions', { params: { my_affiliations: true } }),
      ]);

      if (instRes.status === 'fulfilled') {
        const data = Array.isArray(instRes.value.data) ? instRes.value.data : (instRes.value.data?.data || []);
        setInstitutions(data);
      }

      if (coursesRes.status === 'fulfilled') {
        const data = Array.isArray(coursesRes.value.data) ? coursesRes.value.data : (coursesRes.value.data?.data || []);
        setCourses(data);
      }

      if (recsRes.status === 'fulfilled') {
        const data = Array.isArray(recsRes.value.data) ? recsRes.value.data : (recsRes.value.data?.data || []);
        setRecommendations(data);
      }

      if (gradesRes.status === 'fulfilled') {
        const data = Array.isArray(gradesRes.value.data) ? gradesRes.value.data : (gradesRes.value.data?.data || []);
        setGrades(data);
      }

      if (attendancesRes.status === 'fulfilled') {
        const data = Array.isArray(attendancesRes.value.data) ? attendancesRes.value.data : (attendancesRes.value.data?.data || []);
        setAttendances(data);
      }

      if (logsRes.status === 'fulfilled') {
        const data = Array.isArray(logsRes.value.data) ? logsRes.value.data : (logsRes.value.data?.data || []);
        setBehaviorLogs(data);
      }

      if (studentsRes.status === 'fulfilled') {
        const raw = Array.isArray(studentsRes.value.data) ? studentsRes.value.data : (studentsRes.value.data?.data || []);
        const stdList = raw.filter((u: any) => {
          const r = (u.role || '').toLowerCase();
          const roles = Array.isArray(u.roles) ? u.roles.map((x: any) => (typeof x === 'string' ? x : x.name).toLowerCase()) : [];
          return r === 'student' || roles.includes('student');
        });
        setStudents(stdList);
      }
    } catch (e) {
      console.warn("Feedback data load error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentId || !newAction.trim()) return;
    setIsSubmitting(true);
    setDialogError(null);

    try {
      await api.post('/academic/recommendations', {
        student_id: Number(newStudentId),
        ai_suggested_action: newAction.trim(),
        status: 'proposed',
      });
      setIsDialogOpen(false);
      setNewAction("");
      loadData();
    } catch (err: any) {
      setDialogError(getApiErrorMessage(err, isAr));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImplementRecommendation = async (recId: number) => {
    const note = actionNotes[recId] || (isAr ? "تم إتمام خطة التدخل البيداغوجي بنجاح." : "Pedagogical intervention completed successfully.");
    setIsLoggingAction(recId);
    try {
      await api.patch(`/academic/recommendations/${recId}/implement`, {
        outcome_notes: note
      });
      setRecommendations((prev) =>
        prev.map((r) => (r.id === recId ? { ...r, status: 'implemented', outcome_notes: note } : r))
      );
    } catch (err) {
      alert(getApiErrorMessage(err, isAr));
    } finally {
      setIsLoggingAction(null);
    }
  };

  const handleSendAiMessage = async (presetText?: string) => {
    const textToSend = presetText || chatPrompt;
    if (!textToSend.trim() || isAiThinking) return;

    setChatHistory((prev) => [...prev, { sender: "user", text: textToSend }]);
    setChatPrompt("");
    setIsAiThinking(true);

    try {
      const res = await api.post('/ai/chat', { prompt: textToSend });
      const aiReply = res.data?.response || res.data?.message || (isAr ? "تم تحليل الطلب وتوليد التوجيهات البيداغوجية." : "Analysis and recommendations generated.");
      setChatHistory((prev) => [...prev, { sender: "ai", text: aiReply }]);
    } catch {
      // Fallback pedagogical generator based on live cohort metrics
      setTimeout(() => {
        const fallbackAnswer = isAr
          ? `💡 **خطة التدخل البيداغوجي الموصى بها:**\n\n1. **تحليل الأداء العام**: متوسط الاستيعاب في شُعبتك يبلغ (${avgScore}%) مع وجود (${failingCount}) حالات بحاجة لدعم إضافي.\n2. **الإجراء المقترح**: تخصيص 15 دقيقة في المحاضرة القادمة لشرح المفاهيم الصعبة مع حل أمثلة عملية إضافية.\n3. **المتابعة الفردية**: إرسال توصية أكاديمية للطلاب المتعثرين وتوجيههم للساعات المكتبية.`
          : `💡 **AI Pedagogical Roadmap:**\n\n1. **Cohort Diagnostic**: Overall comprehension is at (${avgScore}%) with (${failingCount}) at-risk evaluations.\n2. **Recommended Action**: Dedicate 15 minutes of the next session to core concept review with practical walk-throughs.\n3. **Intervention**: Schedule 1-on-1 tutoring sessions and log progress in the intervention tracker.`;
        setChatHistory((prev) => [...prev, { sender: "ai", text: fallbackAnswer }]);
      }, 500);
    } finally {
      setIsAiThinking(false);
    }
  };

  const instName = currentUser?.institution?.name || (currentUser as any)?.institution_name;
  const colName = currentUser?.college?.name;

  // Filtered grades by selected course
  const filteredGrades = selectedCourseId === "all"
    ? grades
    : grades.filter((g) => {
        const cId = g.enrollment?.section?.course_id || g.course?.id || g.course_id;
        return String(cId) === String(selectedCourseId);
      });

  // Compute live analytical insights
  const totalScores = filteredGrades.map((g) => Number(g.score || 0));
  const avgScore = totalScores.length > 0 ? (totalScores.reduce((a, b) => a + b, 0) / totalScores.length).toFixed(1) : "0.0";
  const failingCount = filteredGrades.filter((g) => Number(g.score || 0) < 60).length + behaviorLogs.filter((l) => l.type === 'negative' || l.type === 'warning').length;
  const implementedCount = recommendations.filter((r) => r.status === 'implemented').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary tracking-wide uppercase">
                {isAr ? "مركز الرؤى والتغذية الراجعة الذكية" : "AI Feedback & Insights Hub"}
              </span>
            </div>

            {/* Institution Badge */}
            {instName && (
              <Badge variant="outline" className="rounded-full bg-secondary/80 text-foreground border-border text-xs px-3 py-1 font-bold flex items-center gap-1.5">
                {currentUser?.institution?.type === 'school' ? <School className="w-3 h-3 text-emerald-500" /> : <Building className="w-3 h-3 text-primary" />}
                <span>{instName}</span>
              </Badge>
            )}

            {/* College or Stage Badge */}
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

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {isAr ? "التغذية الراجعة والتدخلات البيداغوجية" : "Pedagogical Feedback & Action Center"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            {isAr
              ? "تحليلات الذكاء الاصطناعي لأداء طلابك، وتوصيات تحسين الفهم وتوثيق خطط الدعم الأكاديمي المقيدة بمؤسستك."
              : "AI-driven pedagogical analytics, comprehension gap diagnostics, and action roadmaps scoped to your institution."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Active Teaching Institution Context Selector */}
          {institutions.length > 0 && (
            <Select value={selectedInstitution} onValueChange={(val: any) => { setSelectedInstitution(val); setSelectedCourseId("all"); }}>
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

          {/* Course Selector */}
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="w-[180px] rounded-full h-9 bg-card border-border text-xs font-bold">
              <SelectValue placeholder={isAr ? "جميع المقررات" : "All Courses"} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-2xl">
              <SelectItem value="all">{isAr ? "جميع المقررات" : "All Assigned Courses"}</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.code ? `${c.code} - ${c.name || 'Course'}` : (c.name || 'Course')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* New Recommendation Button & Modal */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold px-4 h-9 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <Plus className="mr-1.5 h-4 w-4" /> {isAr ? "تسجيل خطة تدخل" : "Add Intervention"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] bg-card border-border text-foreground rounded-3xl">
              <DialogHeader>
                <DialogTitle>{isAr ? "تسجيل خطة تدخل وتوصية جديدة" : "Create New Intervention Plan"}</DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs">
                  {isAr ? "سيتم حفظ الخطة في جدول recommendations في MySQL مع إشعار الإرشاد الطلابي." : "Save the pedagogical action into MySQL for academic tracking."}
                </DialogDescription>
              </DialogHeader>

              {dialogError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
                  {dialogError}
                </div>
              )}

              <form onSubmit={handleCreateRecommendation} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{isAr ? "الطالب المعني" : "Target Student"}</Label>
                  <Select value={newStudentId} onValueChange={setNewStudentId}>
                    <SelectTrigger className="h-10 rounded-xl bg-secondary/60 border-border text-xs">
                      <SelectValue placeholder={isAr ? "اختر الطالب..." : "Select student..."} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-2xl">
                      {students.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)} className="text-xs font-semibold">
                          {s.name} ({s.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="action-desc" className="text-xs font-semibold">{isAr ? "الإجراء الأكاديمي / خطة التدخل المقترحة" : "Recommended Action"}</Label>
                  <Input
                    id="action-desc"
                    required
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    placeholder={isAr ? "مثال: جلسة مراجعة لمفاهيم الخوارزميات وتكليف بتمارين إضافية" : "E.g. Schedule concept tutoring and assign practice tasks"}
                    className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-full text-xs font-semibold">
                    {isAr ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="rounded-full bg-primary text-primary-foreground text-xs font-bold px-5">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                    {isAr ? "حفظ وتوثيق الخطة" : "Save Plan"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

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
        </div>
      </div>

      {/* KPI Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "مؤشر استيعاب الشُعبة" : "Comprehension Index"}</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground">{avgScore}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            {parseFloat(avgScore) >= 75 ? (isAr ? "استيعاب عالي للمفاهيم" : "Strong mastery") : (isAr ? "متوسط - بحاجة لدعم" : "Needs reinforcement")}
          </p>
        </Card>

        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "حالات صعوبة الفهم" : "Struggling Cases"}</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground">{failingCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {isAr ? "تقييمات أقل من 60% مرصودة" : "assessments below 60% recorded"}
          </p>
        </Card>

        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "الخطط الإرشادية النشطة" : "Active Plans"}</span>
            <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground">{recommendations.length}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {isAr ? "توصيات وملاحظات قيد المتابعة" : "recommendations tracked"}
          </p>
        </Card>

        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "التدخلات المنفذة" : "Completed Actions"}</span>
            <div className="w-9 h-9 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground">{implementedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {isAr ? "تم توثيق نتائجها في MySQL" : "verified outcomes in MySQL"}
          </p>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="interventions" className="space-y-6">
        <TabsList className="bg-card/80 border border-border p-1 rounded-2xl h-11">
          <TabsTrigger value="interventions" className="rounded-xl text-xs font-bold px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileCheck className="w-3.5 h-3.5 mr-1.5" />
            <span>{isAr ? "خطط وتوصيات التدخل الأكاديمي" : "Intervention Action Center"}</span>
          </TabsTrigger>
          <TabsTrigger value="ai_coach" className="rounded-xl text-xs font-bold px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bot className="w-3.5 h-3.5 mr-1.5" />
            <span>{isAr ? "المساعد البيداغوجي الذكي" : "Pedagogical AI Coach"}</span>
          </TabsTrigger>
          <TabsTrigger value="cohort_roster" className="rounded-xl text-xs font-bold px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="w-3.5 h-3.5 mr-1.5" />
            <span>{isAr ? "تشخيص أداء الطلاب في الشُعبة" : "Student Diagnostics"}</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Interventions Action Center */}
        <TabsContent value="interventions">
          <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-sm">
            <CardHeader className="p-0 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>{isAr ? "سجل التدخلات البيداغوجية والتغذية الراجعة" : "Active Pedagogical Recommendations & Feedback"}</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    {isAr
                      ? "توصيات صادرة عن الإرشاد الطلابي والتحليل الذكي موجهة لطلابك في هذا الفصل."
                      : "Actionable recommendations coordinated with academic counseling for your cohort."}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="rounded-full bg-secondary text-xs font-bold">
                  {recommendations.length} {isAr ? "توصية" : "Items"}
                </Badge>
              </div>
            </CardHeader>

            {isLoading ? (
              <div className="py-16 text-center text-xs text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                {isAr ? "جارٍ جلب التوصيات..." : "Loading recommendations..."}
              </div>
            ) : recommendations.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground border border-dashed border-border rounded-3xl bg-secondary/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-500/40 mx-auto mb-2" />
                <p className="font-bold text-foreground text-sm">{isAr ? "لا توجد تدخلات معلقة حالياً" : "All classroom interventions up to date"}</p>
                <p className="mt-1">{isAr ? "أداء شُعبك مستقر ومطابق للمعايير الأكاديمية." : "Classroom metrics are in good standing."}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec) => {
                  const student = rec.student || students.find((s) => Number(s.id) === Number(rec.student_id));
                  const isImplemented = rec.status === 'implemented';

                  return (
                    <div
                      key={rec.id}
                      className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                        isImplemented
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : "bg-secondary/40 border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                              {student?.name ? student.name.charAt(0).toUpperCase() : "S"}
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-foreground">{student?.name || `Student #${rec.student_id}`}</h4>
                              <p className="text-[10px] text-muted-foreground">{student?.email}</p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-[9px] font-bold rounded-full px-2.5 py-0.5 ${
                              isImplemented
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            }`}
                          >
                            {isImplemented
                              ? (isAr ? "✅ تم التطبيق" : "Implemented")
                              : (isAr ? "⏳ مطلوب الإجراء" : "Action Required")}
                          </Badge>
                        </div>

                        <p className="text-xs text-foreground/90 leading-relaxed bg-background/60 p-3 rounded-2xl border border-border/60">
                          {rec.ai_suggested_action || rec.action || (isAr ? "متابعة أداء الطالب وتكليفه بتمارين مساندة." : "Follow up with supplemental exercises.")}
                        </p>
                      </div>

                      <div className="pt-3 mt-2 border-t border-border/60">
                        {isImplemented ? (
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2.5 rounded-2xl flex items-center gap-2 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{rec.outcome_notes || (isAr ? "تم توثيق إتمام التدخل البيداغوجي بنجاح." : "Action outcome logged.")}</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Input
                              placeholder={isAr ? "اكتب نتيجة التدخل (مثال: تم إعطاء اختبار تعويضي بنتيجة 82%)..." : "Log outcome (e.g. Completed review quiz with score 82%)..."}
                              value={actionNotes[rec.id] || ""}
                              onChange={(e) => setActionNotes({ ...actionNotes, [rec.id]: e.target.value })}
                              className="h-8 rounded-xl bg-card border-border text-xs"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleImplementRecommendation(rec.id)}
                              disabled={isLoggingAction === rec.id}
                              className="w-full h-8 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
                            >
                              {isLoggingAction === rec.id ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <FileCheck className="w-3.5 h-3.5 mr-1" />}
                              <span>{isAr ? "توثيق وتطبيق الإجراء في MySQL" : "Confirm Implementation"}</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Tab 2: AI Pedagogical Coach */}
        <TabsContent value="ai_coach">
          <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl flex flex-col h-[600px] overflow-hidden shadow-sm">
            <CardHeader className="p-4 border-b border-border bg-primary/5 shrink-0 flex flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-foreground">
                  {isAr ? "المساعد البيداغوجي الذكي لعضو هيئة التدريس" : "AI Pedagogical Assistant"}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {isAr ? "توليد كويزات، صياغة خطط مراجعة، وتقديم استراتيجيات تعليمية مخصصة" : "Generate quizzes, lesson roadmaps, and targeted teaching strategies"}
                </p>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1 p-5">
              <div className="space-y-4">
                {chatHistory.map((msg, idx) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div key={idx} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground border border-border'}`}>
                        {isUser ? "T" : <Bot className="w-4 h-4 text-primary" />}
                      </div>
                      <div className={`p-4 rounded-3xl max-w-[80%] text-xs leading-relaxed ${isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary/60 text-foreground border border-border'}`}>
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}

                {isAiThinking && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground p-3">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>{isAr ? "جارٍ تحليل بيانات الشُعبة وتوليد التوجيهات البيداغوجية..." : "AI analyzing teaching cohort..."}</span>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Chips & Chat Input */}
            <div className="p-4 border-t border-border bg-card/60 space-y-3 shrink-0">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSendAiMessage(isAr ? "اقترح خطة مراجعة سريعة للمقرر قبل الاختبار الفصلي" : "Suggest revision roadmap before midterm")}
                  className="text-xs font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-3 py-1.5 rounded-full border border-border transition-all"
                >
                  💡 {isAr ? "خطة مراجعة للمقرر" : "Revision Roadmap"}
                </button>
                <button
                  onClick={() => handleSendAiMessage(isAr ? "كيف أرفع دافعية الطلاب ذوي الحضور المنخفض في شُعبي؟" : "How to boost engagement for low-attendance students?")}
                  className="text-xs font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-3 py-1.5 rounded-full border border-border transition-all"
                >
                  🎯 {isAr ? "تحفيز الحضور والتفاعل" : "Boost Attendance"}
                </button>
                <button
                  onClick={() => handleSendAiMessage(isAr ? "ولد 3 أسئلة اختيار من متعدد لقياس استيعاب موضوع المحاضرة" : "Generate 3 MCQs to check concept mastery")}
                  className="text-xs font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-3 py-1.5 rounded-full border border-border transition-all"
                >
                  📝 {isAr ? "توليد أسئلة تقييمية" : "Generate Quiz Items"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  placeholder={isAr ? "اسأل المساعد عن استراتيجيات التدريس، كويزات، أو خطط علاجية..." : "Ask for lesson plans, quiz questions, or intervention tactics..."}
                  className="flex-1 h-10 rounded-full bg-secondary/60 border-border text-xs"
                  value={chatPrompt}
                  onChange={(e) => setChatPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                  disabled={isAiThinking}
                />
                <Button
                  onClick={() => handleSendAiMessage()}
                  disabled={isAiThinking || !chatPrompt.trim()}
                  className="h-10 w-10 rounded-full bg-primary text-primary-foreground p-0 shadow-xs"
                >
                  {isAiThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 3: Student Cohort Diagnostics Roster */}
        <TabsContent value="cohort_roster">
          <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{isAr ? "تشخيص استيعاب الطلاب في شُعبك" : "Student Performance & Comprehension Diagnostics"}</span>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  {isAr
                    ? "قائمة الطلاب المقيدين في مؤسستك مع متوسط درجاتهم ونسبة الحضور لتحديد المستحقين للتدخل."
                    : "Individual student score and attendance breakdown to identify intervention candidates."}
                </CardDescription>
              </div>
              <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/20 text-xs font-bold px-3 py-1">
                {students.length} {isAr ? "طالب" : "Students"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {students.map((student) => {
                const sGrades = grades.filter((g) => Number(g.enrollment?.user_id || g.enrollment_id || g.user_id) === Number(student.id));
                const sAtt = attendances.filter((a) => Number(a.user_id) === Number(student.id));
                const sRecs = recommendations.filter((r) => Number(r.student_id) === Number(student.id));

                const avg = sGrades.length > 0
                  ? (sGrades.reduce((acc, curr) => acc + Number(curr.score || 0), 0) / sGrades.length).toFixed(1)
                  : "--";

                const sPresent = sAtt.filter((a) => a.status === 'present').length;
                const attRate = sAtt.length > 0 ? ((sPresent / sAtt.length) * 100).toFixed(1) : "--";

                const scoreVal = parseFloat(avg);
                let standingBadge = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                let standingText = isAr ? "مستقر" : "Stable";

                if (!isNaN(scoreVal) && scoreVal < 60) {
                  standingBadge = "bg-rose-500/10 text-rose-500 border-rose-500/20";
                  standingText = isAr ? "معرض للتعثر" : "At-Risk";
                } else if (!isNaN(scoreVal) && scoreVal < 75) {
                  standingBadge = "bg-amber-500/10 text-amber-500 border-amber-500/20";
                  standingText = isAr ? "يحتاج متابعة" : "Attention";
                }

                return (
                  <Card key={student.id} className="p-4 rounded-3xl bg-secondary/40 border border-border/80 space-y-3 hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-foreground">{student.name}</h4>
                          <p className="text-[10px] text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`rounded-full text-[9px] font-bold px-2 py-0.5 ${standingBadge}`}>
                        {standingText}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-card/60 p-2.5 rounded-2xl border border-border/60 text-center">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">{isAr ? "متوسط الدرجات" : "Avg Score"}</span>
                        <span className="font-mono text-xs font-bold text-foreground">{avg !== "--" ? `${avg}%` : "--"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">{isAr ? "نسبة الحضور" : "Attendance"}</span>
                        <span className="font-mono text-xs font-bold text-foreground">{attRate !== "--" ? `${attRate}%` : "--"}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] pt-1">
                      <span className="text-muted-foreground">{sRecs.length} {isAr ? "خطط مسجلة" : "plans"}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setNewStudentId(String(student.id));
                          setIsDialogOpen(true);
                        }}
                        className="h-7 rounded-full text-[11px] text-primary hover:bg-primary/10 font-bold px-2.5"
                      >
                        + {isAr ? "إضافة خطة" : "Add Plan"}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
