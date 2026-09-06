import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  MessageCircle,
  Send,
  Search,
  Users,
  User,
  Loader2,
  RefreshCw,
  Sparkles,
  Building,
  School,
  GraduationCap,
  BookOpen,
  CheckCheck,
  ShieldCheck,
  Calendar,
  Clock,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAppStore } from "@/lib/store";

export default function TeacherCommunicationsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const currentUser = useAppStore((state) => state.user);

  // Active Main Tab: "students" | "parents"
  const [mainTab, setMainTab] = useState<"students" | "parents">("students");

  // Institutions & Courses Scoping
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all");
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");

  // Students Hub State
  const [students, setStudents] = useState<any[]>([]);
  const [activeStudent, setActiveStudent] = useState<any>(null);
  const [studentMessages, setStudentMessages] = useState<any[]>([]);
  const [studentInputMsg, setStudentInputMsg] = useState("");
  const [isSendingStudent, setIsSendingStudent] = useState(false);
  const [isLoadingStudentMsgs, setIsLoadingStudentMsgs] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");

  // Parents Hub State
  const [parents, setParents] = useState<any[]>([]);
  const [activeParent, setActiveParent] = useState<any>(null);
  const [parentMessages, setParentMessages] = useState<any[]>([]);
  const [parentInputMsg, setParentInputMsg] = useState("");
  const [isSendingParent, setIsSendingParent] = useState(false);
  const [isLoadingParentMsgs, setIsLoadingParentMsgs] = useState(false);
  const [parentSearch, setParentSearch] = useState("");

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  const studentScrollRef = useRef<HTMLDivElement>(null);
  const parentScrollRef = useRef<HTMLDivElement>(null);

  const scrollStudentToBottom = () => {
    studentScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollParentToBottom = () => {
    parentScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Initial Load of Institutions, Courses, Students, Parents
  const loadInitialData = async () => {
    setIsLoadingInitial(true);
    try {
      const instParams = selectedInstitution !== "all" ? { institution_id: selectedInstitution } : {};

      const [instRes, coursesRes, usersRes] = await Promise.allSettled([
        api.get('/admin/institutions', { params: { my_affiliations: true } }),
        api.get('/academic/courses', { params: { my_courses: true, ...instParams } }),
        api.get('/admin/users', { params: instParams }),
      ]);

      if (instRes.status === 'fulfilled') {
        const data = Array.isArray(instRes.value.data) ? instRes.value.data : (instRes.value.data?.data || []);
        setInstitutions(data);
      }

      if (coursesRes.status === 'fulfilled') {
        const data = Array.isArray(coursesRes.value.data) ? coursesRes.value.data : (coursesRes.value.data?.data || []);
        setCourses(data);
      }

      let userList: any[] = [];
      if (usersRes.status === 'fulfilled') {
        const raw = Array.isArray(usersRes.value.data) ? usersRes.value.data : (usersRes.value.data?.data || []);
        userList = raw;
      }

      const sList = userList.filter((u: any) => {
        const r = (u.role || '').toLowerCase();
        const roles = Array.isArray(u.roles) ? u.roles.map((x: any) => (typeof x === 'string' ? x : x.name).toLowerCase()) : [];
        return r === 'student' || roles.includes('student');
      });

      const pList = userList.filter((u: any) => {
        const r = (u.role || '').toLowerCase();
        const roles = Array.isArray(u.roles) ? u.roles.map((x: any) => (typeof x === 'string' ? x : x.name).toLowerCase()) : [];
        return r === 'parent' || roles.includes('parent') || r === 'guardian' || roles.includes('guardian');
      });

      const finalStudents = sList.length > 0 ? sList : userList;
      const finalParents = pList.length > 0 ? pList : userList;

      setStudents(finalStudents);
      setParents(finalParents);

      // Default active student
      const savedStudentId = localStorage.getItem("sba_teacher_selected_student_id");
      if (savedStudentId && finalStudents.some((s) => String(s.id) === String(savedStudentId))) {
        setActiveStudent(finalStudents.find((s) => String(s.id) === String(savedStudentId)));
      } else if (finalStudents.length > 0 && !activeStudent) {
        setActiveStudent(finalStudents[0]);
        localStorage.setItem("sba_teacher_selected_student_id", String(finalStudents[0].id));
      }

      // Default active parent
      const savedParentId = localStorage.getItem("sba_teacher_selected_parent_id");
      if (savedParentId && finalParents.some((p) => String(p.id) === String(savedParentId))) {
        setActiveParent(finalParents.find((p) => String(p.id) === String(savedParentId)));
      } else if (finalParents.length > 0 && !activeParent) {
        setActiveParent(finalParents[0]);
        localStorage.setItem("sba_teacher_selected_parent_id", String(finalParents[0].id));
      }

    } catch (e) {
      console.warn("Error loading teacher communications:", e);
    } finally {
      setIsLoadingInitial(false);
    }
  };

  // 2. Load Student Direct Messages
  const loadStudentMessages = async (silent = false) => {
    if (!activeStudent) return;
    if (!silent) setIsLoadingStudentMsgs(true);
    try {
      const res = await api.get('/messages', {
        params: {
          student_id: activeStudent.id,
          recipient_id: activeStudent.id,
        }
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setStudentMessages(data);
      if (!silent) setTimeout(scrollStudentToBottom, 100);
    } catch (e) {
      console.warn("Student messages error:", e);
    } finally {
      if (!silent) setIsLoadingStudentMsgs(false);
    }
  };

  // 3. Load Parent Messages
  const loadParentMessages = async (silent = false) => {
    if (!activeParent) return;
    if (!silent) setIsLoadingParentMsgs(true);
    try {
      const res = await api.get('/messages', {
        params: { recipient_id: activeParent.id }
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setParentMessages(data);
      if (!silent) setTimeout(scrollParentToBottom, 100);
    } catch (e) {
      console.warn("Parent messages error:", e);
    } finally {
      if (!silent) setIsLoadingParentMsgs(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [selectedInstitution]);

  // Real-time polling for Student Tab
  useEffect(() => {
    if (activeStudent && mainTab === "students") {
      loadStudentMessages(false);
      const timer = setInterval(() => loadStudentMessages(true), 3000);
      return () => clearInterval(timer);
    }
  }, [activeStudent, mainTab]);

  // Real-time polling for Parent Tab
  useEffect(() => {
    if (activeParent && mainTab === "parents") {
      loadParentMessages(false);
      const timer = setInterval(() => loadParentMessages(true), 3000);
      return () => clearInterval(timer);
    }
  }, [activeParent, mainTab]);

  const handleSelectStudent = (s: any) => {
    setActiveStudent(s);
    localStorage.setItem("sba_teacher_selected_student_id", String(s.id));
  };

  const handleSelectParent = (p: any) => {
    setActiveParent(p);
    localStorage.setItem("sba_teacher_selected_parent_id", String(p.id));
  };

  const handleSendStudentMessage = async (customText?: string) => {
    const text = (customText || studentInputMsg).trim();
    if (!text || !activeStudent || isSendingStudent) return;
    setIsSendingStudent(true);

    try {
      const res = await api.post('/messages', {
        recipient_id: activeStudent.id,
        student_id: activeStudent.id,
        message: text,
      });

      const newMsg = res.data?.data || res.data;
      setStudentMessages((prev) => [...prev, newMsg]);
      setStudentInputMsg("");
      setTimeout(scrollStudentToBottom, 100);
    } catch (err) {
      alert(getApiErrorMessage(err, isAr));
    } finally {
      setIsSendingStudent(false);
    }
  };

  const handleSendParentMessage = async (customText?: string) => {
    const text = (customText || parentInputMsg).trim();
    if (!text || !activeParent || isSendingParent) return;
    setIsSendingParent(true);

    try {
      const res = await api.post('/messages', {
        recipient_id: activeParent.id,
        message: text,
      });

      const newMsg = res.data?.data || res.data;
      setParentMessages((prev) => [...prev, newMsg]);
      setParentInputMsg("");
      setTimeout(scrollParentToBottom, 100);
    } catch (err) {
      alert(getApiErrorMessage(err, isAr));
    } finally {
      setIsSendingParent(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const q = studentSearch.toLowerCase();
    return s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q);
  });

  const filteredParents = parents.filter((p) => {
    const q = parentSearch.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q);
  });

  const teacherStudentPrompts = [
    {
      label: isAr ? "🕒 دعوة لحضور الساعات المكتبية" : "🕒 Office Hours Invitation",
      text: isAr
        ? "مرحباً، أود دعوتك لحضور الساعات المكتبية المخصصة لمناقشة الصعوبات التي واجهتك في موضوع المحاضرة الأخيرة."
        : "Hello, I invite you to visit my office hours to discuss the recent topics and address any questions you have."
    },
    {
      label: isAr ? "📝 إشعار بموعد الاختبار التعويضي" : "📝 Remedial Quiz Notice",
      text: isAr
        ? "عزيزي الطالب، تم تحديد موعد جلسة المراجعة والاختبار التعويضي يوم الخميس القادم لتعويض درجات التقييم النصفي."
        : "Dear student, a review and remedial assessment session has been scheduled for next Thursday to help boost your performance."
    },
    {
      label: isAr ? "🌟 إشادة بالتحسن الأكاديمي" : "🌟 Praise for Progress",
      text: isAr
        ? "أحييك على تحسن أدائك الأكاديمي والتزامك المميز في المحاضرات الأخيرة، استمر في هذا التقدم الرائع!"
        : "I commend you on your recent academic turnaround and active engagement in class. Keep up the great work!"
    }
  ];

  const teacherParentPrompts = [
    {
      label: isAr ? "📊 إشعار بالتقدم الأكاديمي" : "📊 Academic Progress Update",
      text: isAr
        ? "تحية طيبة، أود إحاطتكم علماً بأن الطالب يظهر تحسناً ملحوظاً في التفاعل الصفي وحل الواجبات البرمجية."
        : "Greetings, I would like to inform you that your student has demonstrated notable progress in classroom tasks."
    },
    {
      label: isAr ? "🤝 طلب تنسيق اجتماع متابعة" : "🤝 Request Coordination Meeting",
      text: isAr
        ? "السلام عليكم، نرجو التنسيق لعقد اجتماع قصير لمناقشة خطة الدعم المشتركة وتأكيد استمرارية التحسن."
        : "Hello, we would appreciate coordinating a brief meeting to align on the academic support plan."
    }
  ];

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col pb-6">
      {/* Header with Institution Context Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-primary" />
            {isAr ? "مركز محادثات الطلاب وأولياء الأمور" : "Student & Family Communications"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "قناة تواصل تفاعلية مباشرة مع طلاب شُعبك وأولياء أمورهم لتقديم الدعم البيداغوجي الفوري."
              : "Direct interactive channel with your enrolled students and their guardians for personalized pedagogical support."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Institution Context Switcher */}
          {institutions.length > 0 && (
            <div className="flex items-center gap-2 bg-secondary/80 p-1.5 rounded-full border border-border">
              <Building className="w-4 h-4 text-primary ml-1 shrink-0" />
              <span className="text-xs text-muted-foreground font-semibold px-1">
                {isAr ? "المؤسسة النشطة:" : "Active Institution:"}
              </span>
              <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                <SelectTrigger className="w-[180px] h-8 rounded-full bg-card border-border text-xs font-bold text-foreground">
                  <SelectValue placeholder="All Institutions" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground rounded-2xl">
                  <SelectItem value="all" className="text-xs font-semibold">
                    🌐 {isAr ? "جميع المؤسسات" : "All Affiliations"}
                  </SelectItem>
                  {institutions.map((inst) => (
                    <SelectItem key={inst.id} value={String(inst.id)} className="text-xs font-semibold">
                      {inst.type === 'school' ? '🏫 ' : '🎓 '}
                      {inst.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={loadInitialData}
            disabled={isLoadingInitial}
            className="rounded-full text-xs font-semibold px-3 h-9 border-border bg-secondary/60 hover:bg-secondary flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInitial ? 'animate-spin' : ''}`} />
            <span>{isAr ? "تحديث" : "Refresh"}</span>
          </Button>
        </div>
      </div>

      {/* Main Tabs: Students vs Parents */}
      <Tabs value={mainTab} onValueChange={(val: any) => setMainTab(val)} className="flex-1 flex flex-col min-h-0">
        <TabsList className="bg-card/85 backdrop-blur-xl border border-border p-1 rounded-2xl w-full sm:w-auto self-start mb-4 shrink-0">
          <TabsTrigger value="students" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-bold px-4 py-2">
            <GraduationCap className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            <span>{isAr ? "محادثات الطلاب المباشرة" : "Enrolled Students"}</span>
            <Badge variant="secondary" className="ml-2 rtl:mr-2 rtl:ml-0 text-[10px] bg-primary/20 text-primary">
              {students.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="parents" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-bold px-4 py-2">
            <Users className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
            <span>{isAr ? "محادثات أولياء الأمور" : "Parent / Guardians"}</span>
            <Badge variant="secondary" className="ml-2 rtl:mr-2 rtl:ml-0 text-[10px] bg-primary/20 text-primary">
              {parents.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Students Direct Messaging */}
        <TabsContent value="students" className="flex-1 min-h-0 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full min-h-0">
            {/* Left: Student Roster List */}
            <Card className="lg:col-span-1 bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-4 flex flex-col min-h-0 shadow-sm">
              <div className="relative mb-3 shrink-0">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
                <Input
                  placeholder={isAr ? "بحث عن طالب..." : "Search students..."}
                  className="pl-9 rtl:pl-3 rtl:pr-9 h-9 rounded-full bg-secondary/60 border-border text-xs"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 min-h-0">
                {filteredStudents.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">
                    {isAr ? "لا يوجد طلاب مطابقين." : "No students found."}
                  </p>
                ) : (
                  filteredStudents.map((s) => {
                    const isSelected = activeStudent?.id === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelectStudent(s)}
                        className={`w-full text-left rtl:text-right p-3 rounded-2xl transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 font-bold'
                            : 'bg-secondary/40 hover:bg-secondary/80 text-foreground'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                        }`}>
                          {(s.name || "ST").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs truncate font-semibold">{s.name}</p>
                          <p className={`text-[10px] truncate ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                            {s.email}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </Card>

            {/* Right: Message Stream & Quick Prompts */}
            <Card className="lg:col-span-3 bg-card/85 backdrop-blur-xl border border-border rounded-3xl flex flex-col min-h-0 shadow-sm overflow-hidden">
              {/* Active Student Top Bar */}
              <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    {(activeStudent?.name || "ST").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{activeStudent?.name || "Select Student"}</h3>
                    <p className="text-[10px] text-muted-foreground font-mono">{activeStudent?.email || ""}</p>
                  </div>
                </div>

                <Badge variant="outline" className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold px-2.5 py-0.5">
                  🟢 {isAr ? "محادثة حية نشطة" : "Active Student Thread"}
                </Badge>
              </div>

              {/* Quick Teacher Prompts */}
              <div className="px-4 py-2 bg-secondary/20 border-b border-border/60 flex items-center gap-2 overflow-x-auto shrink-0">
                <span className="text-[10px] font-bold text-muted-foreground shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> {isAr ? "قوالب سريعة:" : "Quick Templates:"}
                </span>
                {teacherStudentPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setStudentInputMsg(p.text)}
                    className="text-[10px] font-medium bg-card hover:bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border/80 shrink-0 transition-all text-ellipsis max-w-[200px] truncate"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Messages Stream */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 min-h-0 bg-gradient-to-b from-transparent to-secondary/10">
                {isLoadingStudentMsgs ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span>{isAr ? "جارٍ جلب المحادثات من MySQL..." : "Loading messages from MySQL..."}</span>
                  </div>
                ) : studentMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground text-xs p-8">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                      <MessageCircle className="w-7 h-7 text-primary/60" />
                    </div>
                    <h4 className="font-bold text-sm text-foreground mb-1">
                      {isAr ? `ابدأ محادثة مع الطالب ${activeStudent?.name || ""}` : "Start discussion with student"}
                    </h4>
                    <p className="max-w-xs text-xs text-muted-foreground leading-relaxed">
                      {isAr
                        ? "أرسل توجيهات أكاديمية، مواعيد ساعات مكتبية، أو متابعة للواجبات والتقييمات."
                        : "Send academic feedback, office hours invites, or assessment follow-ups."}
                    </p>
                  </div>
                ) : (
                  studentMessages.map((msg, index) => {
                    const isMe = msg.sender_id === currentUser?.id;
                    const senderName = isMe ? (isAr ? "أنا (الأستاذ)" : "Me (Instructor)") : (msg.sender?.name || activeStudent?.name || "Student");
                    const timeStr = msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

                    return (
                      <div key={msg.id || index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}>
                        <div className="flex items-center gap-2 px-1">
                          <span className="text-[10px] font-bold text-muted-foreground">{senderName}</span>
                          <span className="text-[9px] text-muted-foreground/80 font-mono">{timeStr}</span>
                        </div>

                        <div
                          className={`max-w-[80%] sm:max-w-[70%] p-4 rounded-3xl text-xs leading-relaxed shadow-sm transition-all ${
                            isMe
                              ? 'bg-primary text-primary-foreground rounded-br-xs shadow-primary/10 font-medium'
                              : 'bg-card border border-border/80 text-foreground rounded-bl-xs'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </div>

                        {isMe && (
                          <div className="flex items-center gap-1 text-[9px] text-muted-foreground px-1 font-mono">
                            <CheckCheck className={`w-3 h-3 ${msg.is_read ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span>{msg.is_read ? (isAr ? "تمت القراءة" : "Read") : (isAr ? "تم التسليم" : "Delivered")}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={studentScrollRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 border-t border-border bg-card/90 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendStudentMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <Input
                    placeholder={isAr ? `اكتب رسالتك إلى ${activeStudent?.name || "الطالب"}...` : "Type your message..."}
                    value={studentInputMsg}
                    onChange={(e) => setStudentInputMsg(e.target.value)}
                    disabled={isSendingStudent || !activeStudent}
                    className="h-11 rounded-full bg-secondary/60 border-border text-xs focus-visible:ring-primary/30"
                  />

                  <Button
                    type="submit"
                    disabled={!studentInputMsg.trim() || isSendingStudent || !activeStudent}
                    className="h-11 px-5 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all"
                  >
                    {isSendingStudent ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rtl:rotate-180" />}
                    <span className="hidden sm:inline">{isAr ? "إرسال" : "Send"}</span>
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Parents Messaging */}
        <TabsContent value="parents" className="flex-1 min-h-0 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full min-h-0">
            {/* Left: Parent Roster List */}
            <Card className="lg:col-span-1 bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-4 flex flex-col min-h-0 shadow-sm">
              <div className="relative mb-3 shrink-0">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
                <Input
                  placeholder={isAr ? "بحث عن ولي أمر..." : "Search parents..."}
                  className="pl-9 rtl:pl-3 rtl:pr-9 h-9 rounded-full bg-secondary/60 border-border text-xs"
                  value={parentSearch}
                  onChange={(e) => setParentSearch(e.target.value)}
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 min-h-0">
                {filteredParents.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">
                    {isAr ? "لا يوجد أولياء أمور مطابقين." : "No parents found."}
                  </p>
                ) : (
                  filteredParents.map((p) => {
                    const isSelected = activeParent?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectParent(p)}
                        className={`w-full text-left rtl:text-right p-3 rounded-2xl transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 font-bold'
                            : 'bg-secondary/40 hover:bg-secondary/80 text-foreground'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                        }`}>
                          {(p.name || "PA").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs truncate font-semibold">{p.name}</p>
                          <p className={`text-[10px] truncate ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                            {p.email}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </Card>

            {/* Right: Message Stream for Parents */}
            <Card className="lg:col-span-3 bg-card/85 backdrop-blur-xl border border-border rounded-3xl flex flex-col min-h-0 shadow-sm overflow-hidden">
              {/* Active Parent Top Bar */}
              <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    {(activeParent?.name || "PA").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{activeParent?.name || "Select Guardian"}</h3>
                    <p className="text-[10px] text-muted-foreground font-mono">{activeParent?.email || ""}</p>
                  </div>
                </div>

                <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/20 text-[10px] font-bold px-2.5 py-0.5">
                  👨‍👩‍👦 {isAr ? "ولي أمر الطالب" : "Parent / Guardian"}
                </Badge>
              </div>

              {/* Quick Teacher -> Parent Prompts */}
              <div className="px-4 py-2 bg-secondary/20 border-b border-border/60 flex items-center gap-2 overflow-x-auto shrink-0">
                <span className="text-[10px] font-bold text-muted-foreground shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> {isAr ? "قوالب سريعة:" : "Templates:"}
                </span>
                {teacherParentPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setParentInputMsg(p.text)}
                    className="text-[10px] font-medium bg-card hover:bg-secondary text-foreground px-2.5 py-1 rounded-full border border-border/80 shrink-0 transition-all text-ellipsis max-w-[220px] truncate"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Messages Stream */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 min-h-0 bg-gradient-to-b from-transparent to-secondary/10">
                {isLoadingParentMsgs ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span>{isAr ? "جارٍ جلب المحادثات من MySQL..." : "Loading messages..."}</span>
                  </div>
                ) : parentMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground text-xs p-8">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                      <MessageCircle className="w-7 h-7 text-primary/60" />
                    </div>
                    <h4 className="font-bold text-sm text-foreground mb-1">
                      {isAr ? `ابدأ التواصل مع ولي الأمر ${activeParent?.name || ""}` : "Start discussion with parent"}
                    </h4>
                    <p className="max-w-xs text-xs text-muted-foreground leading-relaxed">
                      {isAr
                        ? "أرسل رسائل مباشرة حول تقارير التقدم الأكاديمي، الحضور، وتنسيق الخطط العلاجية."
                        : "Communicate directly about academic reports, attendance, and joint support."}
                    </p>
                  </div>
                ) : (
                  parentMessages.map((msg, index) => {
                    const isMe = msg.sender_id === currentUser?.id;
                    const senderName = isMe ? (isAr ? "أنا (الأستاذ)" : "Me (Instructor)") : (msg.sender?.name || activeParent?.name || "Parent");
                    const timeStr = msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

                    return (
                      <div key={msg.id || index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}>
                        <div className="flex items-center gap-2 px-1">
                          <span className="text-[10px] font-bold text-muted-foreground">{senderName}</span>
                          <span className="text-[9px] text-muted-foreground/80 font-mono">{timeStr}</span>
                        </div>

                        <div
                          className={`max-w-[80%] sm:max-w-[70%] p-4 rounded-3xl text-xs leading-relaxed shadow-sm transition-all ${
                            isMe
                              ? 'bg-primary text-primary-foreground rounded-br-xs shadow-primary/10 font-medium'
                              : 'bg-card border border-border/80 text-foreground rounded-bl-xs'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </div>

                        {isMe && (
                          <div className="flex items-center gap-1 text-[9px] text-muted-foreground px-1 font-mono">
                            <CheckCheck className={`w-3 h-3 ${msg.is_read ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span>{msg.is_read ? (isAr ? "تمت القراءة" : "Read") : (isAr ? "تم التسليم" : "Delivered")}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={parentScrollRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 border-t border-border bg-card/90 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendParentMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <Input
                    placeholder={isAr ? `اكتب رسالتك إلى ${activeParent?.name || "ولي الأمر"}...` : "Type your message..."}
                    value={parentInputMsg}
                    onChange={(e) => setParentInputMsg(e.target.value)}
                    disabled={isSendingParent || !activeParent}
                    className="h-11 rounded-full bg-secondary/60 border-border text-xs focus-visible:ring-primary/30"
                  />

                  <Button
                    type="submit"
                    disabled={!parentInputMsg.trim() || isSendingParent || !activeParent}
                    className="h-11 px-5 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all"
                  >
                    {isSendingParent ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rtl:rotate-180" />}
                    <span className="hidden sm:inline">{isAr ? "إرسال" : "Send"}</span>
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
