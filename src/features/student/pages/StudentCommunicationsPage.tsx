import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  MessageCircle,
  Send,
  Loader2,
  RefreshCw,
  UserCheck,
  GraduationCap,
  CheckCheck,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  HelpCircle,
  BookOpen
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAppStore } from "@/lib/store";

export default function StudentCommunicationsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const currentUser = useAppStore((state) => state.user);

  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>(() => {
    return localStorage.getItem("sba_student_selected_advisor_id") || "";
  });

  const [advisors, setAdvisors] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Load advisors and teachers
  const loadAdvisors = async () => {
    try {
      const [usersRes, allMessagesRes] = await Promise.allSettled([
        api.get('/admin/users'),
        api.get('/messages', { params: { student_id: currentUser?.id } }),
      ]);

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

      // Restore or pick default advisor
      const savedAdvId = localStorage.getItem("sba_student_selected_advisor_id");
      if (savedAdvId && advisorList.some((a) => String(a.id) === String(savedAdvId))) {
        setSelectedAdvisorId(savedAdvId);
      } else if (advisorList.length > 0) {
        const aId = String(advisorList[0].id);
        setSelectedAdvisorId(aId);
        localStorage.setItem("sba_student_selected_advisor_id", aId);
      }
    } catch (e) {
      console.warn("Error loading advisors:", e);
    }
  };

  // 2. Load messages for student <-> advisor conversation
  const loadMessages = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const params: any = {};
      if (currentUser?.id) params.student_id = currentUser.id;
      if (selectedAdvisorId) params.recipient_id = selectedAdvisorId;

      const res = await api.get('/messages', { params });
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setMessages(data);
      if (!silent) {
        setTimeout(scrollToBottom, 100);
      }
    } catch (e) {
      console.warn("Error loading student messages:", e);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdvisors();
  }, []);

  // Real-time polling every 3000ms
  useEffect(() => {
    if (selectedAdvisorId || currentUser?.id) {
      loadMessages(false);
      const timer = setInterval(() => {
        loadMessages(true);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [selectedAdvisorId, currentUser?.id]);

  const handleSelectAdvisor = (id: string) => {
    setSelectedAdvisorId(id);
    localStorage.setItem("sba_student_selected_advisor_id", id);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || chatInput).trim();
    if (!text || isSending) return;
    setIsSending(true);

    try {
      const payload: any = {
        message: text,
        student_id: currentUser?.id,
      };
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

  const activeAdvisor = advisors.find((a) => String(a.id) === String(selectedAdvisorId)) || advisors[0];

  const quickPrompts = [
    {
      label: isAr ? "📅 طلب موعد جلسة إرشادية" : "📅 Request Counselling Session",
      text: isAr
        ? "السلام عليكم دكتور/ة، أود حجز موعد لجلسة إرشاد أكاديمي لمناقشة خطتي الدراسية ومستواي في المقررات."
        : "Hello, I would like to schedule an academic advising session to discuss my course progress and study plan."
    },
    {
      label: isAr ? "📚 استفسار عن خطة التقوية" : "📚 Inquire about Remedial Plan",
      text: isAr
        ? "مرحباً، أود الاستفسار عن مواعيد جلسات التقوية والدعم الأكاديمي المخصصة لي في مادة تراكيب البيانات."
        : "Hello, could you please provide details about my scheduled remedial tutoring sessions?"
    },
    {
      label: isAr ? "📝 متابعة درجات الاختبار" : "📝 Follow up on Midterm Score",
      text: isAr
        ? "تحية طيبة، أرجو إرشادي حول آلية التعويض والفرص المتاحة لتحسين درجتي في الاختبار القادم."
        : "Greetings, I would appreciate your guidance on grade recovery opportunities for upcoming assessments."
    }
  ];

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col pb-6">
      {/* Header with Title and Advisor Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-primary" />
            {isAr ? "التواصل المباشر مع المرشد الأكاديمي" : "Advisor Direct Messaging"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "محادثة حية مشفرة ومحفوظة في قاعدة بيانات MySQL مع المرشد الأكاديمي وأعضاء هيئة التدريس."
              : "Direct, secure messaging channel connected to your academic advisor and faculty."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Advisor Picker */}
          {advisors.length > 0 && (
            <div className="flex items-center gap-2 bg-secondary/80 p-1.5 rounded-full border border-border">
              <UserCheck className="w-4 h-4 text-primary ml-1 shrink-0" />
              <span className="text-xs text-muted-foreground font-semibold px-1">
                {isAr ? "المرشد / المعلم:" : "Advisor / Faculty:"}
              </span>
              <Select value={selectedAdvisorId} onValueChange={handleSelectAdvisor}>
                <SelectTrigger className="w-[180px] h-8 rounded-full bg-card border-border text-xs font-bold text-foreground">
                  <SelectValue placeholder="Select advisor" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground rounded-2xl">
                  {advisors.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)} className="text-xs font-semibold">
                      {a.name} ({a.role || (a.roles?.[0]?.name) || "Advisor"})
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

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Left Side: Advisor Profile Info & Quick Prompts */}
        <div className="lg:col-span-1 space-y-4 flex flex-col min-h-0">
          {/* Advisor Card */}
          <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-5 shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg">
                {(activeAdvisor?.name || "AD").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-foreground truncate">{activeAdvisor?.name || "Academic Advisor"}</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Online" />
                </div>
                <p className="text-[11px] text-muted-foreground truncate">{activeAdvisor?.email || "advisor@sba.local"}</p>
                <Badge variant="outline" className="mt-1 bg-primary/10 text-primary border-primary/20 text-[9px] font-bold rounded-full">
                  {isAr ? "المرشد المخصص" : "Assigned Advisor"}
                </Badge>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/70 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>{isAr ? "أوقات الرد:" : "Response Time:"}</span>
                <span className="font-bold text-foreground font-mono">{isAr ? "خلال ساعات العمل" : "Same Day"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{isAr ? "حالة القناة:" : "Channel Status:"}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isAr ? "نشطة ومباشرة" : "Active & Live"}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Prompts Panel */}
          <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl p-5 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold text-foreground">{isAr ? "قوالب استفسار سريعة" : "Quick Inquiry Templates"}</h4>
            </div>
            <p className="text-[11px] text-muted-foreground mb-3">
              {isAr
                ? "اضغط على أي قالب لإرسال استفسار مباشر للمرشد:"
                : "Click any prompt to instantly draft or send a message:"}
            </p>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setChatInput(qp.text)}
                  className="w-full text-left rtl:text-right p-3 rounded-2xl bg-secondary/40 hover:bg-secondary/80 border border-border/60 transition-all text-xs text-foreground font-medium flex flex-col gap-1 group"
                >
                  <span className="font-bold text-[11px] text-primary group-hover:underline">{qp.label}</span>
                  <span className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{qp.text}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side: Chat Message Stream and Input */}
        <Card className="lg:col-span-3 bg-card/85 backdrop-blur-xl border border-border rounded-3xl flex flex-col shadow-sm overflow-hidden min-h-0">
          {/* Messages Header */}
          <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {(activeAdvisor?.name || "AD").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-xs text-foreground">{activeAdvisor?.name || "Academic Advisor"}</h3>
                <p className="text-[10px] text-muted-foreground font-mono">
                  {messages.length} {isAr ? "رسالة في السجل الموثق" : "messages in record"}
                </p>
              </div>
            </div>

            <Badge variant="outline" className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold px-2.5 py-0.5">
              🟢 {isAr ? "مباشر" : "Connected"}
            </Badge>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 min-h-0 bg-gradient-to-b from-transparent to-secondary/10">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span>{isAr ? "جارٍ جلب المحادثات من MySQL..." : "Loading messages from MySQL..."}</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground text-xs p-8">
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                  <MessageCircle className="w-7 h-7 text-primary/60" />
                </div>
                <h4 className="font-bold text-sm text-foreground mb-1">
                  {isAr ? "ابدأ المحادثة مع مرشدك الأكاديمي" : "Start your conversation with your advisor"}
                </h4>
                <p className="max-w-xs text-xs text-muted-foreground leading-relaxed">
                  {isAr
                    ? "أرسل أي استفسار أو طلب مساعدة أكاديمية أو نفسية وسيتلقى المرشد إشعاراً فورياً للرد عليك."
                    : "Send any academic or support query and your advisor will be notified immediately to assist you."}
                </p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.sender_id === currentUser?.id;
                const senderName = isMe ? (currentUser?.name || (isAr ? "أنا" : "Me")) : (msg.sender?.name || activeAdvisor?.name || "Advisor");
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
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-border bg-card/90 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <Input
                placeholder={isAr ? "اكتب رسالتك للمرشد الأكاديمي هنا..." : "Type your message to your advisor here..."}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isSending}
                className="h-11 rounded-full bg-secondary/60 border-border text-xs focus-visible:ring-primary/30"
              />

              <Button
                type="submit"
                disabled={!chatInput.trim() || isSending}
                className="h-11 px-5 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all"
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rtl:rotate-180" />}
                <span className="hidden sm:inline">{isAr ? "إرسال" : "Send"}</span>
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
