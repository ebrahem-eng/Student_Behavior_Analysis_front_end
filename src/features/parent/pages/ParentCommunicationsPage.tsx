import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, Send, Loader2, RefreshCw, UserCheck, GraduationCap, CheckCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAppStore } from "@/lib/store";

export default function ParentCommunicationsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const currentUser = useAppStore((state) => state.user);

  // Restore saved selection from localStorage across refreshes
  const [selectedChildId, setSelectedChildId] = useState<string>(() => {
    return localStorage.getItem("sba_parent_selected_child_id") || "";
  });
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>(() => {
    return localStorage.getItem("sba_parent_selected_advisor_id") || "";
  });

  const [children, setChildren] = useState<any[]>([]);
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Load students & advisors
  const loadParticipants = async () => {
    try {
      const [studentsRes, usersRes, allMessagesRes] = await Promise.allSettled([
        api.get('/admin/users?role=student'),
        api.get('/admin/users'),
        api.get('/messages'),
      ]);

      let studentList: any[] = [];
      if (studentsRes.status === 'fulfilled') {
        const raw = Array.isArray(studentsRes.value.data) ? studentsRes.value.data : (studentsRes.value.data?.data || []);
        studentList = raw;
        setChildren(raw);
      }

      let advisorList: any[] = [];
      if (usersRes.status === 'fulfilled') {
        const raw = Array.isArray(usersRes.value.data) ? usersRes.value.data : (usersRes.value.data?.data || []);
        const filtered = raw.filter((u: any) => {
          const r = (u.role || '').toLowerCase();
          const roles = Array.isArray(u.roles) ? u.roles.map((x: any) => (typeof x === 'string' ? x : x.name).toLowerCase()) : [];
          return r === 'advisor' || roles.includes('advisor') || r === 'teacher' || roles.includes('teacher');
        });
        advisorList = filtered.length > 0 ? filtered : raw;
        setAdvisors(advisorList);
      }

      // Check if there are existing messages to choose the default child with active messages
      let existingMsgs: any[] = [];
      if (allMessagesRes.status === 'fulfilled') {
        existingMsgs = Array.isArray(allMessagesRes.value.data) ? allMessagesRes.value.data : (allMessagesRes.value.data?.data || []);
      }

      // If no valid child is selected yet, pick from localStorage or first student with messages or first student
      const savedChildId = localStorage.getItem("sba_parent_selected_child_id");
      if (savedChildId && studentList.some((s) => String(s.id) === String(savedChildId))) {
        setSelectedChildId(savedChildId);
      } else if (existingMsgs.length > 0 && existingMsgs[0].student_id) {
        const matchingChild = studentList.find((s) => String(s.id) === String(existingMsgs[0].student_id));
        if (matchingChild) {
          const cId = String(matchingChild.id);
          setSelectedChildId(cId);
          localStorage.setItem("sba_parent_selected_child_id", cId);
        } else if (studentList.length > 0) {
          const cId = String(studentList[0].id);
          setSelectedChildId(cId);
          localStorage.setItem("sba_parent_selected_child_id", cId);
        }
      } else if (studentList.length > 0) {
        const cId = String(studentList[0].id);
        setSelectedChildId(cId);
        localStorage.setItem("sba_parent_selected_child_id", cId);
      }

      // Advisor default
      const savedAdvId = localStorage.getItem("sba_parent_selected_advisor_id");
      if (savedAdvId && advisorList.some((a) => String(a.id) === String(savedAdvId))) {
        setSelectedAdvisorId(savedAdvId);
      } else if (advisorList.length > 0) {
        const aId = String(advisorList[0].id);
        setSelectedAdvisorId(aId);
        localStorage.setItem("sba_parent_selected_advisor_id", aId);
      }

    } catch (e) {
      console.warn("Error loading participants:", e);
    }
  };

  // 2. Load messages for the active conversation (supports silent background sync)
  const loadMessages = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const params: any = {};
      if (selectedChildId) params.student_id = selectedChildId;
      if (selectedAdvisorId) params.recipient_id = selectedAdvisorId;

      const res = await api.get('/messages', { params });
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setMessages(data);
      if (!silent) {
        setTimeout(scrollToBottom, 100);
      }
    } catch (e) {
      console.warn("Error loading messages:", e);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  // Real-time polling every 3000ms
  useEffect(() => {
    if (selectedChildId || selectedAdvisorId) {
      loadMessages(false);
      const timer = setInterval(() => {
        loadMessages(true);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [selectedChildId, selectedAdvisorId]);

  const handleSelectChild = (id: string) => {
    setSelectedChildId(id);
    localStorage.setItem("sba_parent_selected_child_id", id);
  };

  const handleSelectAdvisor = (id: string) => {
    setSelectedAdvisorId(id);
    localStorage.setItem("sba_parent_selected_advisor_id", id);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isSending) return;
    const text = chatInput.trim();
    setIsSending(true);

    try {
      const payload: any = {
        message: text,
      };
      if (selectedChildId) payload.student_id = Number(selectedChildId);
      if (selectedAdvisorId) payload.recipient_id = Number(selectedAdvisorId);

      const res = await api.post('/messages', payload);
      const newMsg = res.data?.data || res.data;

      setMessages((prev) => [...prev, newMsg]);
      setChatInput("");
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      alert(getApiErrorMessage(err, isAr));
    } finally {
      setIsSending(false);
    }
  };

  const activeChild = children.find((c) => String(c.id) === String(selectedChildId)) || children[0];
  const activeAdvisor = advisors.find((a) => String(a.id) === String(selectedAdvisorId)) || advisors[0];

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col pb-6">
      {/* Header with Student and Advisor Selectors */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-primary" />
            {isAr ? "التواصل المباشر مع المرشد الأكاديمي" : "Advisor Direct Communications"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "محادثة حية مشفرة ومحفوظة في قاعدة بيانات MySQL مع المرشد المخصص للطالب."
              : "Live interactive messaging stored in MySQL with your student's academic advisor."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Child Picker */}
          {children.length > 0 && (
            <div className="flex items-center gap-2 bg-secondary/80 p-1.5 rounded-full border border-border">
              <GraduationCap className="w-4 h-4 text-primary ml-1 shrink-0" />
              <span className="text-xs text-muted-foreground font-semibold px-1">
                {isAr ? "الطالب:" : "Child:"}
              </span>
              <Select value={selectedChildId} onValueChange={handleSelectChild}>
                <SelectTrigger className="w-[160px] h-8 rounded-full bg-card border-border text-xs font-bold text-foreground">
                  <SelectValue placeholder="Select child" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground rounded-2xl">
                  {children.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)} className="text-xs font-semibold">
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Advisor Picker */}
          {advisors.length > 0 && (
            <div className="flex items-center gap-2 bg-secondary/80 p-1.5 rounded-full border border-border">
              <span className="text-xs text-muted-foreground font-semibold px-2">
                {isAr ? "المرشد:" : "Advisor:"}
              </span>
              <Select value={selectedAdvisorId} onValueChange={handleSelectAdvisor}>
                <SelectTrigger className="w-[160px] h-8 rounded-full bg-card border-border text-xs font-bold text-foreground">
                  <SelectValue placeholder="Select advisor" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground rounded-2xl">
                  {advisors.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)} className="text-xs font-semibold">
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => loadMessages(false)}
            disabled={isLoading}
            className="rounded-full text-xs font-semibold px-3 h-9 border-border bg-secondary/60 hover:bg-secondary flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isAr ? "تحديث" : "Refresh"}</span>
          </Button>
        </div>
      </div>

      {/* Chat Card */}
      <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl flex-1 flex flex-col min-h-0 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border shrink-0 bg-primary/5 p-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              {(activeAdvisor?.name || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <span>{activeAdvisor?.name || (isAr ? "المرشد الأكاديمي" : "Academic Advisor")}</span>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-bold rounded-full">
                  <UserCheck className="w-2.5 h-2.5 mr-1" />
                  <span>{isAr ? "متصل مباشر" : "Live Channel"}</span>
                </Badge>
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-primary" />
                <span>
                  {isAr
                    ? `محادثة خاصة بالطالب: ${activeChild?.name || ""}`
                    : `Inquiry regarding student: ${activeChild?.name || "Student"}`}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <ScrollArea className="flex-1 p-5">
          {isLoading ? (
            <div className="py-20 text-center text-muted-foreground text-xs">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
              {isAr ? "جارٍ جلب المحادثة من MySQL..." : "Loading messages from MySQL..."}
            </div>
          ) : messages.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground text-xs space-y-2">
              <MessageCircle className="w-8 h-8 text-primary/30 mx-auto" />
              <p className="font-semibold text-foreground">{isAr ? "لا توجد رسائل سابقة." : "No messages yet."}</p>
              <p>{isAr ? "ابدأ المحادثة الآن مع المرشد الأكاديمي للاستفسار عن مستوى الطالب." : "Send a message to the advisor to discuss your child's progress."}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => {
                const isMe = Number(msg.sender_id) === Number(currentUser?.id);
                const senderName = isMe
                  ? (isAr ? "أنت (ولي الأمر)" : "You (Parent)")
                  : (msg.sender?.name || (isAr ? "المرشد الأكاديمي" : "Academic Advisor"));

                const timeStr = msg.created_at
                  ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : "";

                const studentName = msg.student?.name ||
                  children.find((s) => Number(s.id) === Number(msg.student_id))?.name;

                return (
                  <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isMe ? 'bg-primary text-primary-foreground' : 'bg-secondary border border-border text-foreground'}`}>
                      {isMe ? "P" : "Adv"}
                    </div>
                    <div className={`rounded-2xl p-4 max-w-[80%] text-xs ${isMe ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-foreground border border-border'}`}>
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className={`text-[10px] font-bold ${isMe ? 'text-primary-foreground/90' : 'text-primary'}`}>
                          {senderName}
                        </span>
                        <span className={`text-[10px] font-mono ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {timeStr}
                        </span>
                      </div>

                      {studentName && (
                        <div className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${isMe ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                          <GraduationCap className="w-2.5 h-2.5" />
                          <span>{isAr ? `الطالب: ${studentName}` : `Student: ${studentName}`}</span>
                        </div>
                      )}

                      <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>

                      {isMe && (
                        <div className="flex justify-end mt-1 text-primary-foreground/80">
                          <CheckCheck className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Footer */}
        <div className="p-4 border-t border-border bg-card/60 shrink-0">
          <div className="flex items-center gap-2">
            <Input
              placeholder={
                activeChild
                  ? (isAr ? `اكتب استفسارك للمرشد بخصوص ${activeChild.name}...` : `Type message regarding ${activeChild.name}...`)
                  : (isAr ? "اكتب رسالتك للمرشد الأكاديمي..." : "Type your message to the advisor...")
              }
              className="flex-1 h-10 rounded-full bg-secondary/60 border-border text-xs"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isSending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isSending || !chatInput.trim()}
              className="rounded-full bg-primary text-primary-foreground h-10 px-5 shadow-xs"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
