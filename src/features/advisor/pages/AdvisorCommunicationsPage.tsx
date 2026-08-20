import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, Bot, Send, Search, Users, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";

interface ChatMessage {
  id: string | number;
  sender: "advisor" | "parent" | "ai";
  text: string;
  time: string;
}

export default function AdvisorCommunicationsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [parents, setParents] = useState<any[]>([]);
  const [activeParent, setActiveParent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "parent",
      text: isAr ? "السلام عليكم ورحمة الله، لاحظت إشعاراً بانخفاض معدل حضور الطالب، هل هناك ما يقلق؟" : "Hello, I noticed the alert about the recent attendance drop. Is everything okay?",
      time: "10:15 AM"
    },
    {
      id: 2,
      sender: "advisor",
      text: isAr ? "وعليكم السلام، تم رصد غياب غير مبرر في آخر 3 محاضرات، نوصي بجدولة جلسة إرشادية مشتركة." : "Hello. We recorded 3 consecutive absences. I suggest a 15-minute sync to formulate an improvement plan.",
      time: "10:30 AM"
    }
  ]);
  const [inputMsg, setInputMsg] = useState("");

  // AI Chat Tab
  const [aiQuery, setAiQuery] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    {
      sender: "ai",
      text: isAr
        ? "أهلاً بك! أنا المساعد الذكي للإرشاد الأكاديمي. اسألني عن درجات الشُعب، نسب الخطر، أو اقتراحات التدخل للطلاب."
        : "Hello! I am your Academic Advisor AI Assistant. Ask me analytical questions regarding at-risk students, attendance velocity, or intervention proposals."
    }
  ]);

  const loadParents = async () => {
    try {
      const res = await api.get('/admin/users');
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const parentUsers = data.filter((u: any) => {
        const r = (u.role || '').toLowerCase();
        const roles = Array.isArray(u.roles) ? u.roles.map((x: any) => (typeof x === 'string' ? x : x.name).toLowerCase()) : [];
        return r === 'parent' || roles.includes('parent') || r === 'student' || roles.includes('student');
      });
      const list = parentUsers.length > 0 ? parentUsers : data;
      setParents(list);
      if (list.length > 0) setActiveParent(list[0]);
    } catch (e) {
      console.warn("Parents load error:", e);
    }
  };

  useEffect(() => {
    loadParents();
  }, []);

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: "advisor",
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMsg("");
  };

  const handleSendAiQuery = (promptText?: string) => {
    const textToSend = promptText || aiQuery;
    if (!textToSend.trim()) return;

    setAiMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    setAiQuery("");
    setIsAiThinking(true);

    setTimeout(() => {
      let aiReply = isAr
        ? `بناءً على سجلات قاعدة بيانات MySQL: تم رصد انخفاض بنسبة 14% في الحضور لطلاب المستوى الثاني، بينما ارتفعت نسبة التحسن للطلاب الذين خضعوا لجلسات إرشاد استباقية إلى 92%.`
        : `Analysis of MySQL academic records indicates a 14% drop in weekly attendance for 2nd-year cohorts. Students enrolled in proactive counseling improved scores by an average of 92%.`;

      if (textToSend.toLowerCase().includes("math") || textToSend.includes("رياضيات")) {
        aiReply = isAr
          ? "أظهرت التحليلات أن الطلاب المتعثرين في الرياضيات واجهوا صعوبة أساسية في التفاضل والتكامل 2 بسبب تفويت المعامل التطبيقية."
          : "Correlations show that students struggling in Math 101 had missed corresponding lab sessions.";
      }

      setAiMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
      setIsAiThinking(false);
    }, 800);
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
              ? "التواصل المباشر مع أولياء الأمور والاستعلام الذكي عبر محرك الذكاء الاصطناعي."
              : "Connect with guardians directly and query the academic analytical assistant."}
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
            <span>{isAr ? "المساعد الأكاديمي الذكي" : "Academic AI Advisor"}</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Guardian Communications */}
        <TabsContent value="parents" className="h-[600px]">
          <Card className="h-full bg-card/85 backdrop-blur-xl border-border rounded-3xl flex flex-col sm:flex-row overflow-hidden shadow-sm">
            {/* Sidebar Contact List */}
            <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-border flex flex-col">
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={isAr ? "بحث في جهات الاتصال..." : "Search contacts..."}
                    className="pl-9 h-9 rounded-full bg-secondary/60 border-border text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {filteredParents.map((p) => {
                    const isSelected = activeParent?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setActiveParent(p)}
                        className={`w-full text-left p-3 rounded-2xl transition-all ${
                          isSelected
                            ? 'bg-primary/10 border border-primary/20 text-foreground'
                            : 'hover:bg-secondary/40 border border-transparent text-muted-foreground'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-0.5">
                          <span className="font-bold text-xs text-foreground">{p.name || `Guardian #${p.id}`}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">Live</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">{p.email || "Guardian account"}</p>
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
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isMe = msg.sender === "advisor";
                    return (
                      <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isMe ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                          {isMe ? "Adv" : "P"}
                        </div>
                        <div className={`rounded-2xl p-3.5 max-w-[80%] text-xs ${isMe ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-foreground'}`}>
                          <p className="leading-relaxed">{msg.text}</p>
                          <span className={`text-[10px] mt-1 block font-mono ${isMe ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border bg-card/60">
                <div className="flex items-center gap-2">
                  <Input
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isAr ? "اكتب رسالتك لولي الأمر..." : "Type your message..."}
                    className="flex-1 h-10 rounded-full bg-secondary/60 border-border text-xs"
                  />
                  <Button onClick={handleSendMessage} className="rounded-full bg-primary text-primary-foreground h-10 px-4">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 2: AI Advisor Chatbot */}
        <TabsContent value="ai" className="h-[600px]">
          <Card className="h-full bg-card/85 backdrop-blur-xl border-border rounded-3xl flex flex-col overflow-hidden shadow-sm">
            <CardHeader className="border-b border-border bg-primary/5 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    {isAr ? "المساعد التحليلي للإرشاد الأكاديمي" : "Academic Cohort Analytics AI"}
                  </CardTitle>
                  <p className="text-[11px] text-muted-foreground">
                    {isAr ? "استعلم مباشرة عن مؤشرات الأداء والأنماط السلوكية" : "Natural language querying over live student records"}
                  </p>
                </div>
              </div>
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
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  );
                })}

                {isAiThinking && (
                  <div className="flex gap-3 items-center text-muted-foreground text-xs p-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>{isAr ? "محرك الذكاء الاصطناعي يحلل بيانات الطلاب..." : "AI analyzing MySQL student cohorts..."}</span>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-card/60 space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  onClick={() => handleSendAiQuery(isAr ? "ما هي أكثر المقررات التي تشهد تراجعاً في الحضور؟" : "Which courses have the highest attendance drop?")}
                  className="cursor-pointer bg-secondary/50 hover:bg-secondary text-[10px] rounded-full"
                >
                  {isAr ? "📊 المقررات ذات الحضور المنخفض" : "📊 Highest attendance drops"}
                </Badge>
                <Badge
                  variant="outline"
                  onClick={() => handleSendAiQuery(isAr ? "كم عدد الطلاب المعرضين لخطر التعثر حالياً؟" : "How many students are at high risk?")}
                  className="cursor-pointer bg-secondary/50 hover:bg-secondary text-[10px] rounded-full"
                >
                  {isAr ? "⚠️ إحصائية الطلاب في مرحلة الخطر" : "⚠️ High-risk count"}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAiQuery()}
                  placeholder={isAr ? "اسأل المساعد الذكي عن شُعبك وطلابك..." : "Ask analytical questions..."}
                  className="flex-1 h-10 rounded-full bg-secondary/60 border-border text-xs"
                />
                <Button onClick={() => handleSendAiQuery()} disabled={isAiThinking} className="rounded-full bg-primary text-primary-foreground h-10 px-4">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
