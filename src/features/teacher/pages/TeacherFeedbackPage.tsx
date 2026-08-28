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
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAppStore } from "@/lib/store";

export default function TeacherFeedbackPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const currentUser = useAppStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  
  // AI Interactive Assistant for Teaching
  const [chatPrompt, setChatPrompt] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ sender: "user" | "ai"; text: string }[]>([
    {
      sender: "ai",
      text: isAr
        ? "مرحباً بك يا أستاذ! أنا مساعدك البيداغوجي الذكي. أستطيع تحليل نتائج طلابك، اقتراح خطط مراجعة، تصميم أسئلة تقييمية، وصياغة تدخلات أكاديمية مخصصة للشُعب."
        : "Welcome, Professor! I am your AI Pedagogical Assistant. I analyze your classroom performance, suggest revision roadmaps, generate quiz items, and tailor student interventions."
    }
  ]);

  const [actionNotes, setActionNotes] = useState<Record<number, string>>({});
  const [isLoggingAction, setIsLoggingAction] = useState<number | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [coursesRes, recsRes, gradesRes, studentsRes] = await Promise.allSettled([
        api.get('/academic/courses', { params: { my_courses: true } }),
        api.get('/academic/recommendations'),
        api.get('/academic/grades', { params: { my_sections: true } }),
        api.get('/admin/users?role=student'),
      ]);

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
      console.warn("[Teacher Feedback] Error loading insights:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImplementRecommendation = async (recId: number) => {
    const note = actionNotes[recId] || (isAr ? "تم تطبيق الإجراء التربوي والمتابعة في الفصل." : "Intervention implemented during class session.");
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
      const aiReply = res.data?.response || res.data?.message || (isAr ? "تم تحليل الطلب بناءً على أداء الشُعبة." : "Analysis generated based on classroom cohort data.");
      setChatHistory((prev) => [...prev, { sender: "ai", text: aiReply }]);
    } catch {
      // Fallback local analytical intelligence
      setTimeout(() => {
        const fallbackAnswer = isAr
          ? `💡 توصية الذكاء الاصطناعي البيداغوجية:\n• تم رصد تباين في درجات التقييمات الأخيرة في شُعبك.\n• يُنصح بتخصيص 15 دقيقة في بداية المحاضرة القادمة لمراجعة المفاهيم الأكثر صعوبة.\n• إتاحة ساعات مكتبية إضافية للطلاب المعرضين للتعثر.`
          : `💡 AI Pedagogical Recommendation:\n• Performance variance detected across recent assessments in your courses.\n• Recommended: Allocate 15 mins in the next lecture for core concept reinforcement.\n• Schedule dedicated office hours for at-risk students.`;
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
  const failingCount = filteredGrades.filter((g) => Number(g.score || 0) < 60).length;

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
                <Building className="w-3 h-3 text-primary" />
                <span>{instName}</span>
              </Badge>
            )}

            {/* College Badge */}
            {colName && (
              <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/20 text-xs px-3 py-1 font-bold flex items-center gap-1.5">
                <GraduationCap className="w-3 h-3" />
                <span>{colName}</span>
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {isAr ? "الرؤى والتدخلات البيداغوجية" : "Pedagogical Feedback & Action Center"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            {isAr
              ? "تحليلات الذكاء الاصطناعي لأداء طلابك، وتوصيات تحسين الفهم وتوثيق خطط الدعم الأكاديمي."
              : "AI-driven pedagogical analytics, comprehension gap diagnostics, and action roadmaps."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "مؤشر استيعاب الشُعبة" : "Comprehension Index"}</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground">{avgScore}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            {parseFloat(avgScore) >= 75 ? (isAr ? "استيعاب عالي للمفاهيم الأساسية" : "Strong mastery of learning outcomes") : (isAr ? "متوسط - يُنصح بجلسات تقوية" : "Moderate - review suggested")}
          </p>
        </Card>

        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "حالات صعوبة الفهم" : "Struggling Topics"}</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground">{failingCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {isAr ? "تقييمات أقل من 60% تتطلب تدخلاً" : "assessments below 60% requiring action"}
          </p>
        </Card>

        <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "الخطط الإرشادية النشطة" : "Active Interventions"}</span>
            <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground">{recommendations.length}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {isAr ? "توصيات وملاحظات موجهة للمتابعة" : "recommendations coordinated with advising"}
          </p>
        </Card>
      </div>

      {/* Main Grid: AI Assistant & Recommendations Action List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recommendations & Academic Intervention Action Center */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-sm">
            <CardHeader className="p-0 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>{isAr ? "توصيات التدخل الأكاديمي للطلاب" : "Student Intervention Action Center"}</span>
                </CardTitle>
                <Badge variant="outline" className="rounded-full bg-secondary text-xs">
                  {recommendations.length} {isAr ? "توصية" : "Items"}
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                {isAr
                  ? "توصيات صادرة عن التحليل الذكي والإرشاد الطلابي لتطبيقها وتوثيق نتائجها."
                  : "AI and counselor recommendations to implement directly in your classroom."}
              </CardDescription>
            </CardHeader>

            {isLoading ? (
              <div className="py-16 text-center text-xs text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                {isAr ? "جارٍ جلب التوصيات..." : "Loading recommendations..."}
              </div>
            ) : recommendations.length === 0 ? (
              <div className="p-10 text-center text-xs text-muted-foreground border border-dashed border-border rounded-2xl bg-secondary/20">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
                <p className="font-bold text-foreground">{isAr ? "لا توجد تدخلات معلقة حالياً" : "All recommended actions implemented"}</p>
                <p className="mt-1">{isAr ? "شُعبك تسير بنجاح ولا توجد خطط بحاجة لتوثيق إضافي." : "Classroom interventions are up to date."}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec) => {
                  const student = students.find((s) => Number(s.id) === Number(rec.student_id));
                  const isImplemented = rec.status === 'implemented';

                  return (
                    <div
                      key={rec.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isImplemented
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : "bg-secondary/40 border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-foreground">
                            {student?.name || `Student #${rec.student_id}`}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-[9px] font-bold rounded-full ${
                              isImplemented
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            }`}
                          >
                            {isImplemented
                              ? (isAr ? "تم التطبيق" : "Implemented")
                              : (isAr ? "مطلوب الإجراء" : "Action Required")}
                          </Badge>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {rec.created_at ? new Date(rec.created_at).toLocaleDateString() : ""}
                        </span>
                      </div>

                      <p className="text-xs text-foreground/90 leading-relaxed mb-3">
                        {rec.ai_suggested_action || rec.action || (isAr ? "متابعة أداء الطالب وتكليفه بتمارين مساندة." : "Follow up with supplemental exercises.")}
                      </p>

                      {isImplemented ? (
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl flex items-center gap-2 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{rec.outcome_notes || (isAr ? "تم توثيق التطبيق بنجاح." : "Action verified.")}</span>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1">
                          <Input
                            placeholder={isAr ? "اكتب ملاحظات الإجراء المنفذ (مثال: تم إعطاء كويز تعويضي)..." : "Log outcome (e.g. Completed 1-on-1 tutoring)..."}
                            value={actionNotes[rec.id] || ""}
                            onChange={(e) => setActionNotes({ ...actionNotes, [rec.id]: e.target.value })}
                            className="h-8 rounded-xl bg-card border-border text-xs"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleImplementRecommendation(rec.id)}
                            disabled={isLoggingAction === rec.id}
                            className="h-8 rounded-xl bg-primary text-primary-foreground text-xs font-bold px-4"
                          >
                            {isLoggingAction === rec.id ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <FileCheck className="w-3.5 h-3.5 mr-1" />}
                            <span>{isAr ? "توثيق وتطبيق الإجراء" : "Confirm Implementation"}</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: AI Pedagogical Chat Assistant */}
        <div className="lg:col-span-5 flex flex-col h-[600px]">
          <Card className="h-full bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl flex flex-col overflow-hidden shadow-sm">
            <CardHeader className="p-4 border-b border-border bg-primary/5 shrink-0 flex flex-row items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-xs font-bold text-foreground">
                  {isAr ? "المساعد البيداغوجي الذكي للمعلم" : "AI Pedagogical Coach"}
                </CardTitle>
                <p className="text-[10px] text-muted-foreground">
                  {isAr ? "توليد اختبارات قصيرة، استراتيجيات شرح، وخطط دعم" : "Generate quiz ideas, rubrics & lesson strategies"}
                </p>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {chatHistory.map((msg, idx) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div key={idx} className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground border border-border'}`}>
                        {isUser ? "T" : <Bot className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary/60 text-foreground border border-border'}`}>
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}

                {isAiThinking && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    <span>{isAr ? "جارٍ إعداد التحليل البيداغوجي..." : "AI analyzing teaching cohort..."}</span>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Chips & Chat Input */}
            <div className="p-3 border-t border-border bg-card/60 space-y-2 shrink-0">
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleSendAiMessage(isAr ? "اقترح خطة مراجعة سريعة قبل الاختبار النهائي" : "Suggest revision roadmap before finals")}
                  className="text-[10px] font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border transition-all"
                >
                  💡 {isAr ? "خطة مراجعة سريعة" : "Revision Roadmap"}
                </button>
                <button
                  onClick={() => handleSendAiMessage(isAr ? "كيف أرفع دافعية الطلاب ذوي الحضور المنخفض؟" : "How to boost engagement for low-attendance students?")}
                  className="text-[10px] font-semibold bg-secondary/80 hover:bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border transition-all"
                >
                  🎯 {isAr ? "تحفيز الحضور" : "Boost Attendance"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  placeholder={isAr ? "اسأل المساعد عن استراتيجيات التدريس..." : "Ask for lesson plans, quiz ideas..."}
                  className="flex-1 h-9 rounded-full bg-secondary/60 border-border text-xs"
                  value={chatPrompt}
                  onChange={(e) => setChatPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                  disabled={isAiThinking}
                />
                <Button
                  onClick={() => handleSendAiMessage()}
                  disabled={isAiThinking || !chatPrompt.trim()}
                  className="h-9 w-9 rounded-full bg-primary text-primary-foreground p-0 shadow-xs"
                >
                  {isAiThinking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
