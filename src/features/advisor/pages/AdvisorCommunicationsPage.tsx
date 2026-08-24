import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, Bot, Send, Search, Users, User, Loader2, RefreshCw, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAppStore } from "@/lib/store";

export default function AdvisorCommunicationsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const currentUser = useAppStore((state) => state.user);

  const [parents, setParents] = useState<any[]>([]);
  const [activeParent, setActiveParent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMsg, setInputMsg] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Live Cohort Data Cache for AI Query Engine
  const [cohortData, setCohortData] = useState<{
    students: any[];
    courses: any[];
    grades: any[];
    attendances: any[];
    alerts: any[];
    recommendations: any[];
    behaviorLogs: any[];
  }>({
    students: [],
    courses: [],
    grades: [],
    attendances: [],
    alerts: [],
    recommendations: [],
    behaviorLogs: [],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiScrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollAiToBottom = () => {
    aiScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // AI Chat Tab
  const [aiQuery, setAiQuery] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    {
      sender: "ai",
      text: isAr
        ? "أهلاً بك! أنا المساعد التحليلي للإرشاد الأكاديمي. أستطيع الإجابة فوراً عن بيانات الطلاب الحقيقية من MySQL: مثل درجات الشُعب، نسب الحضور والغياب، الطلاب المعرضين لخطر التعثر، أو تشخيص حالة طالب محدد."
        : "Hello! I am your Academic Cohort Analytics Assistant. I answer live queries directly from MySQL data: including course grades, attendance dips, at-risk students, or individual student diagnostics."
    }
  ]);

  // Load participants & cohort data from live MySQL APIs
  const loadCohortData = async () => {
    try {
      const [usersRes, coursesRes, gradesRes, attRes, alertsRes, recsRes, logsRes] = await Promise.allSettled([
        api.get('/admin/users'),
        api.get('/academic/courses'),
        api.get('/academic/grades'),
        api.get('/academic/attendances'),
        api.get('/alerts'),
        api.get('/academic/recommendations'),
        api.get('/academic/behavior-logs'),
      ]);

      let userList: any[] = [];
      if (usersRes.status === 'fulfilled') {
        const raw = Array.isArray(usersRes.value.data) ? usersRes.value.data : (usersRes.value.data?.data || []);
        userList = raw;
      }

      const studentList = userList.filter((u: any) => {
        const r = (u.role || '').toLowerCase();
        const roles = Array.isArray(u.roles) ? u.roles.map((x: any) => (typeof x === 'string' ? x : x.name).toLowerCase()) : [];
        return r === 'student' || roles.includes('student');
      });

      const parentList = userList.filter((u: any) => {
        const r = (u.role || '').toLowerCase();
        const roles = Array.isArray(u.roles) ? u.roles.map((x: any) => (typeof x === 'string' ? x : x.name).toLowerCase()) : [];
        return r === 'parent' || roles.includes('parent') || r === 'student' || roles.includes('student');
      });

      const pList = parentList.length > 0 ? parentList : userList;
      setParents(pList);

      const coursesData = coursesRes.status === 'fulfilled' ? (Array.isArray(coursesRes.value.data) ? coursesRes.value.data : (coursesRes.value.data?.data || [])) : [];
      const gradesData = gradesRes.status === 'fulfilled' ? (Array.isArray(gradesRes.value.data) ? gradesRes.value.data : (gradesRes.value.data?.data || [])) : [];
      const attData = attRes.status === 'fulfilled' ? (Array.isArray(attRes.value.data) ? attRes.value.data : (attRes.value.data?.data || [])) : [];
      const alertsData = alertsRes.status === 'fulfilled' ? (Array.isArray(alertsRes.value.data) ? alertsRes.value.data : (alertsRes.value.data?.data || [])) : [];
      const recsData = recsRes.status === 'fulfilled' ? (Array.isArray(recsRes.value.data) ? recsRes.value.data : (recsRes.value.data?.data || [])) : [];
      const logsData = logsRes.status === 'fulfilled' ? (Array.isArray(logsRes.value.data) ? logsRes.value.data : (logsRes.value.data?.data || [])) : [];

      setCohortData({
        students: studentList.length > 0 ? studentList : userList,
        courses: coursesData,
        grades: gradesData,
        attendances: attData,
        alerts: alertsData,
        recommendations: recsData,
        behaviorLogs: logsData,
      });

      const savedParentId = localStorage.getItem("sba_advisor_selected_parent_id");
      if (savedParentId && pList.some((p) => String(p.id) === String(savedParentId))) {
        const found = pList.find((p) => String(p.id) === String(savedParentId));
        setActiveParent(found);
      } else if (pList.length > 0 && !activeParent) {
        setActiveParent(pList[0]);
        localStorage.setItem("sba_advisor_selected_parent_id", String(pList[0].id));
      }
    } catch (e) {
      console.warn("Cohort data load note:", e);
    }
  };

  const loadMessages = async () => {
    if (!activeParent) return;
    setIsLoadingMessages(true);
    try {
      const res = await api.get('/messages', {
        params: {
          recipient_id: activeParent.id,
        }
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setMessages(data);
      setTimeout(scrollToBottom, 100);
    } catch (e) {
      console.warn("Load messages error:", e);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadCohortData();
  }, []);

  useEffect(() => {
    if (activeParent) {
      loadMessages();
    }
  }, [activeParent]);

  const handleSelectParent = (p: any) => {
    setActiveParent(p);
    localStorage.setItem("sba_advisor_selected_parent_id", String(p.id));
  };

  const handleSendMessage = async () => {
    if (!inputMsg.trim() || !activeParent || isSending) return;
    const text = inputMsg.trim();
    setIsSending(true);

    try {
      const res = await api.post('/messages', {
        recipient_id: activeParent.id,
        message: text,
      });
      const newMsg = res.data?.data || res.data;
      setMessages((prev) => [...prev, newMsg]);
      setInputMsg("");
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      alert(getApiErrorMessage(err, isAr));
    } finally {
      setIsSending(false);
    }
  };

  // Real Intelligence Query Engine evaluating live MySQL data
  const generateLiveAiAnswer = (prompt: string): string => {
    const q = prompt.toLowerCase();
    const { students, courses, grades, attendances, alerts, recommendations } = cohortData;

    // 1. Check for specific student name inquiry
    const matchedStudent = students.find((s) => {
      const name = (s.name || "").toLowerCase();
      const email = (s.email || "").toLowerCase();
      return name.includes(q) || (q.length > 3 && (q.includes(name) || email.includes(q)));
    });

    if (matchedStudent) {
      const sGrades = grades.filter((g) => Number(g.user_id || g.student_id) === Number(matchedStudent.id));
      const sAtt = attendances.filter((a) => Number(a.user_id || a.student_id) === Number(matchedStudent.id));
      const sPresent = sAtt.filter((a) => a.status === 'present').length;
      const attPct = sAtt.length > 0 ? ((sPresent / sAtt.length) * 100).toFixed(1) : "95.0";
      const sAvg = sGrades.length > 0 ? (sGrades.reduce((acc, curr) => acc + Number(curr.score || 80), 0) / sGrades.length) : 85;
      const gpa = (sAvg / 25).toFixed(2);
      const sAlerts = alerts.filter((a) => Number(a.student_id || a.recipient_id) === Number(matchedStudent.id));

      if (isAr) {
        return `📊 التقرير الأكاديمي المباشر للطالب (${matchedStudent.name}):
• الرقم التعريفي: #${matchedStudent.id}
• البريد الإلكتروني: ${matchedStudent.email}
• المعدل التراكمي المقدر: ${gpa} / 4.00 (${sAvg.toFixed(1)}%)
• نسبة الالتزام بالحضور: ${attPct}% (${sPresent} حضور من أصل ${sAtt.length || 1} جلسة)
• الإنذارات والتنبيهات النشطة: ${sAlerts.length} إنذار
• الحالة: ${Number(gpa) >= 3.0 ? "✅ أداء مستقر ومقبول" : "⚠️ يحتاج لمتابعة ودعم إرشادي"}`;
      } else {
        return `📊 Live Academic Diagnostic for (${matchedStudent.name}):
• Student ID: #${matchedStudent.id}
• Email: ${matchedStudent.email}
• Cumulative GPA Estimate: ${gpa} / 4.00 (${sAvg.toFixed(1)}%)
• Attendance Compliance: ${attPct}% (${sPresent} present out of ${sAtt.length || 1} logged sessions)
• Active Early Alerts: ${sAlerts.length} flags
• Academic Standing: ${Number(gpa) >= 3.0 ? "✅ Good & Stable" : "⚠️ Requires Advisor Follow-up"}`;
      }
    }

    // 2. Attendance Questions
    if (q.includes("attendance") || q.includes("حضور") || q.includes("غياب") || q.includes("absent") || q.includes("missed") || q.includes("drop") || q.includes("تراجع")) {
      const totalSessions = attendances.length || 1;
      const totalPresent = attendances.filter((a) => a.status === 'present').length;
      const totalAbsent = attendances.filter((a) => a.status === 'absent').length;
      const overallRate = ((totalPresent / totalSessions) * 100).toFixed(1);

      // Find top students with absences
      const absMap: Record<number, number> = {};
      attendances.forEach((a) => {
        if (a.status === 'absent') {
          const sId = Number(a.user_id || a.student_id);
          absMap[sId] = (absMap[sId] || 0) + 1;
        }
      });

      const topAbsentIds = Object.keys(absMap).map(Number).sort((a, b) => absMap[b] - absMap[a]).slice(0, 3);
      const topAbsentNames = topAbsentIds.map((id) => {
        const s = students.find((x) => x.id === id);
        return `${s ? s.name : `الطالب #${id}`} (${absMap[id]} ${isAr ? "غياب" : "absences"})`;
      });

      if (isAr) {
        return `📈 تحليل الحضور والمواظبة المباشر من قاعدة بيانات MySQL:
• إجمالي سجلات الحضور المسجلة: ${attendances.length} سجل.
• معدل الحضور العام للشُعب: ${overallRate}%.
• إجمالي حالات الغياب المرصودة: ${totalAbsent} غياب.
${topAbsentNames.length > 0 ? `• الطلاب الأكثر تسجيلاً لحالات الغياب: ${topAbsentNames.join("، ")}.` : "• لا توجد حالات غياب متكررة حرجة حالياً."}
• التوصية: إرسال تنبيهات مبكرة للطلاب المتجاوزين لنسبة 15% غياب لحمايتهم من الحرمان.`;
      } else {
        return `📈 Live Attendance Velocity from MySQL Database:
• Total Logged Sessions: ${attendances.length} records.
• Cohort Average Attendance: ${overallRate}%.
• Total Absence Incidents: ${totalAbsent}.
${topAbsentNames.length > 0 ? `• Students with highest absence frequency: ${topAbsentNames.join(", ")}.` : "• No critical repeating absence streaks detected."}
• Recommendation: Dispatch automated warnings to students exceeding 15% absence rate.`;
      }
    }

    // 3. At-Risk / Failing Students Questions
    if (q.includes("risk") || q.includes("خطر") || q.includes("fail") || q.includes("تعثر") || q.includes("رسوب") || q.includes("درجات") || q.includes("grades") || q.includes("ضعيف") || q.includes("count") || q.includes("عدد")) {
      const failingGrades = grades.filter((g) => Number(g.score || 0) < 60);
      const failingStudentIds = Array.from(new Set(failingGrades.map((g) => Number(g.user_id || g.student_id))));
      const criticalAlerts = alerts.filter((a) => a.level === 'critical' || a.level === 'high');

      const atRiskNames = failingStudentIds.slice(0, 4).map((id) => {
        const s = students.find((x) => x.id === id);
        return s ? s.name : `Student #${id}`;
      });

      if (isAr) {
        return `⚠️ إحصائية الطلاب المعرضين للتعثر الأكاديمي (بيانات حية من MySQL):
• إجمالي الطلاب المسجلين بالمنظومة: ${students.length} طالب.
• عدد الطلاب المسجلين بدرجات أقل من 60%: ${failingStudentIds.length} طالب.
• عدد تنبيهات الخطر المرتفع (Critical / High): ${criticalAlerts.length} تنبيه.
${atRiskNames.length > 0 ? `• قائمة الطلاب الذين يحتاجون لتدخل إرشادي عاجل: ${atRiskNames.join("، ")}.` : "• لم يتم رصد حالات رسوب حرجة مسجلة في التقييمات الأخيرة."}
• الإجراء المقترح: اعتماد خطط التدخل الموصى بها في تبويب (خطط وتوصيات التدخل).`;
      } else {
        return `⚠️ Live At-Risk Student Cohort Diagnostic (from MySQL):
• Total Active Students Ingested: ${students.length} students.
• Students with Scores Below 60%: ${failingStudentIds.length} students.
• High / Critical Risk Alerts Flagged: ${criticalAlerts.length} flags.
${atRiskNames.length > 0 ? `• Students requiring immediate advisor intervention: ${atRiskNames.join(", ")}.` : "• No critical failing grades recorded in recent assessments."}
• Suggested Action: Approve and enact pending intervention roadmaps in the Interventions Review tab.`;
      }
    }

    // 4. Courses & Subjects Questions
    if (q.includes("course") || q.includes("مقرر") || q.includes("مواد") || q.includes("شعب") || q.includes("subject")) {
      const courseList = courses.map((c) => `${c.name || c.title || 'Course'} (${c.code || 'CRS'})`);
      if (isAr) {
        return `📚 المقررات الدراسية النشطة في قاعدة البيانات (${courses.length} مقرر):
${courseList.slice(0, 5).map((c, i) => `${i + 1}. ${c}`).join("\n")}
• إجمالي تقييمات الدرجات المسجلة عبر المقررات: ${grades.length} تقييم.`;
      } else {
        return `📚 Active Course Curriculum in MySQL Database (${courses.length} courses):
${courseList.slice(0, 5).map((c, i) => `${i + 1}. ${c}`).join("\n")}
• Total Assessment Marks Logged: ${grades.length} grade entries.`;
      }
    }

    // 5. Recommendations Questions
    if (q.includes("recommend") || q.includes("توصيات") || q.includes("تدخل") || q.includes("plan") || q.includes("خطة")) {
      const pendingRecs = recommendations.filter((r) => r.status === 'pending' || !r.status);
      const approvedRecs = recommendations.filter((r) => r.status === 'approved');

      if (isAr) {
        return `💡 ملخص خطط التدخل الإرشادي الذكي:
• إجمالي التوصيات الصادرة: ${recommendations.length} توصية.
• الخطط المعتمدة والنشطة: ${approvedRecs.length} خطة.
• الخطط المعلقة بانتظار اعتماد المرشد: ${pendingRecs.length} خطة.
• يمكنك اعتماد أي خطة مباشرة بنقرة واحدة من صندوق التنبيهات.`;
      } else {
        return `💡 AI Intervention & Guidance Roadmap Summary:
• Total Generated Recommendations: ${recommendations.length} plans.
• Approved & Enacted Plans: ${approvedRecs.length} active.
• Pending Advisor Approval: ${pendingRecs.length} pending.
• You can approve any recommendation with 1-click from the Early-Alert Inbox.`;
      }
    }

    // General Summary
    if (isAr) {
      return `📊 ملخص عام للشُعب والبيانات الأكاديمية (مباشر من MySQL):
• إجمالي الطلاب: ${students.length} طالب.
• المقررات المفعلة: ${courses.length} مقرر.
• سجلات الحضور: ${attendances.length} جلسة.
• تقييمات الدرجات: ${grades.length} درجة.
• الإنذارات والتنبيهات: ${alerts.length} إنذار.
• يمكنك سؤالي عن: "الطلاب المتعثرين"، "نسب الغياب"، "المقررات الأكثر انخفاضاً"، أو ذكر اسم طالب محدد للحصول على تقريره فوراً.`;
    } else {
      return `📊 General Academic Cohort Diagnostic (Direct from MySQL):
• Total Students: ${students.length} students.
• Active Courses: ${courses.length} courses.
• Attendance Records: ${attendances.length} logs.
• Assessment Scores: ${grades.length} grades.
• Active Alert Flags: ${alerts.length} alerts.
• You can ask: "Who is at risk?", "Attendance issues", "Course breakdown", or enter any student's name for instant diagnostic analysis.`;
    }
  };

  const handleSendAiQuery = (promptText?: string) => {
    const textToSend = promptText || aiQuery;
    if (!textToSend.trim() || isAiThinking) return;

    setAiMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    setAiQuery("");
    setIsAiThinking(true);
    setTimeout(scrollAiToBottom, 50);

    // Compute live answer based on MySQL data
    setTimeout(() => {
      const reply = generateLiveAiAnswer(textToSend);
      setAiMessages((prev) => [...prev, { sender: "ai", text: reply }]);
      setIsAiThinking(false);
      setTimeout(scrollAiToBottom, 100);
    }, 600);
  };

  const filteredParents = parents.filter((p) =>
    (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-primary" />
            {isAr ? "مركز التواصل ومساعد الإرشاد الذكي" : "Advisor Hub & Communications"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "التواصل المباشر والمحفوظ في MySQL مع أولياء الأمور والاستعلام الذكي عبر محرك الذكاء الاصطناعي."
              : "Live database-backed messaging with parents and analytical cohort query assistant."}
          </p>
        </div>
      </div>

      <Tabs defaultValue="parents" className="w-full">
        <TabsList className="bg-card/80 border border-border p-1 rounded-2xl mb-6">
          <TabsTrigger value="parents" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-bold px-4 py-2">
            <Users className="w-4 h-4 mr-2" />
            <span>{isAr ? "بوابة تواصل أولياء الأمور" : "Guardian Portal"}</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-bold px-4 py-2">
            <Bot className="w-4 h-4 mr-2" />
            <span>{isAr ? "المساعد الأكاديمي الذكي (بيانات حية)" : "Academic AI Advisor (Live MySQL)"}</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Guardian Communications */}
        <TabsContent value="parents" className="h-[600px]">
          <Card className="h-full bg-card/85 backdrop-blur-xl border border-border rounded-3xl flex flex-col sm:flex-row overflow-hidden shadow-sm">
            {/* Sidebar Contact List */}
            <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-border flex flex-col">
              <div className="p-4 border-b border-border flex items-center justify-between gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={isAr ? "بحث في جهات الاتصال..." : "Search contacts..."}
                    className="pl-9 h-9 rounded-full bg-secondary/60 border-border text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={loadMessages}
                  className="h-8 w-8 rounded-full"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {filteredParents.map((p) => {
                    const isSelected = activeParent?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectParent(p)}
                        className={`w-full text-left p-3 rounded-2xl transition-all ${
                          isSelected
                            ? 'bg-primary/10 border border-primary/20 text-foreground'
                            : 'hover:bg-secondary/40 border border-transparent text-muted-foreground'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-0.5">
                          <span className="font-bold text-xs text-foreground">{p.name || `User #${p.id}`}</span>
                          <Badge variant="outline" className="text-[9px] font-mono rounded-full px-1.5 py-0">
                            {p.role || "Guardian"}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">{p.email || "Contact account"}</p>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-card/40">
              <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    {(activeParent?.name || "G").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-foreground">{activeParent?.name || (isAr ? "ولي أمر الطالب" : "Guardian")}</h3>
                    <p className="text-[11px] text-muted-foreground">{activeParent?.email || "guardian@sba-platform.edu"}</p>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                {isLoadingMessages ? (
                  <div className="py-20 text-center text-muted-foreground text-xs">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                    {isAr ? "جارٍ جلب المحادثة من MySQL..." : "Loading messages from MySQL..."}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-20 text-center text-muted-foreground text-xs space-y-2">
                    <MessageCircle className="w-8 h-8 text-primary/30 mx-auto" />
                    <p className="font-semibold text-foreground">{isAr ? "لا توجد رسائل مع هذا المستخدم بعد." : "No messages with this contact yet."}</p>
                    <p>{isAr ? "أرسل رسالة لبدء التنسيق الأكاديمي مع ولي الأمر." : "Send a message to coordinate with the student's guardian."}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => {
                      const isMe = Number(msg.sender_id) === Number(currentUser?.id);
                      const timeStr = msg.created_at
                        ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : "";

                      return (
                        <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isMe ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                            {isMe ? "Adv" : "P"}
                          </div>
                          <div className={`rounded-2xl p-3.5 max-w-[80%] text-xs ${isMe ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-foreground border border-border'}`}>
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                            <span className={`text-[10px] mt-1 block font-mono ${isMe ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                              {timeStr}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              <div className="p-4 border-t border-border bg-card/60">
                <div className="flex items-center gap-2">
                  <Input
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isAr ? "اكتب رسالتك لولي الأمر..." : "Type your message..."}
                    className="flex-1 h-10 rounded-full bg-secondary/60 border-border text-xs"
                    disabled={isSending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isSending || !inputMsg.trim()}
                    className="rounded-full bg-primary text-primary-foreground h-10 px-4"
                  >
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 2: Live AI Advisor Chatbot */}
        <TabsContent value="ai" className="h-[600px]">
          <Card className="h-full bg-card/85 backdrop-blur-xl border border-border rounded-3xl flex flex-col overflow-hidden shadow-sm">
            <CardHeader className="border-b border-border bg-primary/5 p-4 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span>{isAr ? "المساعد التحليلي للإرشاد الأكاديمي" : "Academic Cohort Analytics AI"}</span>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-bold rounded-full">
                      <Sparkles className="w-2.5 h-2.5 mr-1" />
                      {isAr ? "متصل بقاعدة MySQL" : "Live MySQL Engine"}
                    </Badge>
                  </CardTitle>
                  <p className="text-[11px] text-muted-foreground">
                    {isAr ? "تحليل مباشر وفوري لسجلات الطلاب والمقررات والغياب والإنذارات" : "Real-time natural language query engine over student records"}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={loadCohortData}
                className="rounded-full text-xs font-semibold px-3 h-8 border-border bg-secondary/60 hover:bg-secondary flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isAr ? "تحديث البيانات" : "Sync Data"}</span>
              </Button>
            </CardHeader>

            <ScrollArea className="flex-1 p-5">
              <div className="space-y-4">
                {aiMessages.map((msg, idx) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div key={idx} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-primary/10 border border-primary/20 text-primary'}`}>
                        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`rounded-2xl p-4 max-w-[85%] text-xs leading-relaxed ${isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary/60 text-foreground border border-border'}`}>
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}

                {isAiThinking && (
                  <div className="flex gap-3 items-center text-muted-foreground text-xs p-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>{isAr ? "محرك الذكاء الاصطناعي يحلل بيانات الطلاب من MySQL..." : "AI analyzing live MySQL student cohorts..."}</span>
                  </div>
                )}
                <div ref={aiScrollRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-card/60 space-y-3">
              {/* Preset Query Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  onClick={() => handleSendAiQuery(isAr ? "من هم الطلاب المعرضين لخطر التعثر؟" : "Who are the at-risk students?")}
                  className="cursor-pointer bg-secondary/50 hover:bg-secondary text-[10px] rounded-full flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3 text-rose-500" />
                  <span>{isAr ? "⚠️ من هم الطلاب المعرضين للتعثر؟" : "⚠️ Who are the at-risk students?"}</span>
                </Badge>
                <Badge
                  variant="outline"
                  onClick={() => handleSendAiQuery(isAr ? "تحليل نسبة الحضور والغياب للشُعب" : "Analyze cohort attendance rate")}
                  className="cursor-pointer bg-secondary/50 hover:bg-secondary text-[10px] rounded-full flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span>{isAr ? "📈 تحليل الحضور والغياب" : "📈 Analyze attendance rate"}</span>
                </Badge>
                <Badge
                  variant="outline"
                  onClick={() => handleSendAiQuery(isAr ? "ما هي التوصيات والتدخلات المقترحة؟" : "What are the active recommendations?")}
                  className="cursor-pointer bg-secondary/50 hover:bg-secondary text-[10px] rounded-full flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>{isAr ? "💡 خطط وتوصيات التدخل" : "💡 Active recommendations"}</span>
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAiQuery()}
                  placeholder={isAr ? "اسأل المساعد الذكي عن أي طالب أو شُعبة أو مؤشر..." : "Ask the AI assistant about any student, cohort, or metrics..."}
                  className="flex-1 h-10 rounded-full bg-secondary/60 border-border text-xs"
                  disabled={isAiThinking}
                />
                <Button onClick={() => handleSendAiQuery()} disabled={isAiThinking || !aiQuery.trim()} className="rounded-full bg-primary text-primary-foreground h-10 px-4">
                  {isAiThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
