import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, Send, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";

interface ChatMessage {
  id: string | number;
  sender: "advisor" | "parent";
  name: string;
  text: string;
  time: string;
}

export default function ParentCommunicationsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [chatInput, setChatInput] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "advisor",
      name: isAr ? "د. سارة الأحمد (المرشد الأكاديمي)" : "Dr. Sarah Smith (Advisor)",
      text: isAr
        ? "أهلاً بك! نتابع بشكل دوري مستوى الطالب في المقررات، وتم رصد تحسن ملحوظ في الالتزام بالحضور."
        : "Hello! We are actively monitoring your student's progress and noticed a strong improvement in weekly attendance.",
      time: "10:30 AM"
    },
    {
      id: 2,
      sender: "parent",
      name: isAr ? "أنت (ولي الأمر)" : "You (Parent)",
      text: isAr
        ? "شكراً جزيلاً لاهتمامكم وحرصكم المستمر."
        : "Thank you for the update and your continuous support.",
      time: "11:15 AM"
    }
  ]);

  const loadStudents = async () => {
    try {
      const res = await api.get('/admin/users?role=student');
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const students = data.filter((u: any) => {
        const r = (u.role || '').toLowerCase();
        const roles = Array.isArray(u.roles) ? u.roles.map((x: any) => (typeof x === 'string' ? x : x.name).toLowerCase()) : [];
        return r === 'student' || roles.includes('student');
      });
      const list = students.length > 0 ? students : data;
      setChildren(list);
      if (list.length > 0 && !selectedChildId) {
        setSelectedChildId(String(list[0].id));
      }
    } catch (e) {
      console.warn("Parent communications student load error:", e);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: "parent",
      name: isAr ? "أنت (ولي الأمر)" : "You (Parent)",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
  };

  const activeChild = children.find((c) => String(c.id) === String(selectedChildId)) || children[0];

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-primary" />
            {isAr ? "التواصل مع المرشد الأكاديمي" : "Advisor Communications"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "محادثة وتواصل مباشر مع المرشد الأكاديمي المخصص للطالب."
              : "Direct messaging channel with your child's assigned academic advisor."}
          </p>
        </div>

        {children.length > 0 && (
          <div className="flex items-center gap-3 bg-secondary/80 p-2 rounded-full border border-border">
            <span className="text-xs text-muted-foreground font-semibold px-2">
              {isAr ? "الطالب:" : "Student:"}
            </span>
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger className="w-[180px] h-8 rounded-full bg-card border-border text-xs font-bold text-foreground">
                <SelectValue placeholder="Select a child" />
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
      </div>

      <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl flex-1 flex flex-col min-h-0 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border shrink-0 bg-primary/5 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                {isAr ? "د. سارة الأحمد (المرشد الأكاديمي)" : "Dr. Sarah Smith"}
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground">
                {isAr
                  ? `المرشد الأكاديمي للطالب: ${activeChild?.name || ""}`
                  : `Academic Advisor for ${activeChild?.name || "Student"}`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <ScrollArea className="flex-1 p-5">
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMe = msg.sender === "parent";
              return (
                <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isMe ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                    {isMe ? "P" : "Adv"}
                  </div>
                  <div className={`rounded-2xl p-4 max-w-[80%] text-xs ${isMe ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-foreground border border-border'}`}>
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

        <div className="p-4 border-t border-border bg-card/60 shrink-0">
          <div className="flex items-center gap-2">
            <Input
              placeholder={isAr ? "اكتب رسالتك للمرشد الأكاديمي..." : "Type your message to the advisor..."}
              className="flex-1 h-10 rounded-full bg-secondary/60 border-border text-xs"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} className="rounded-full bg-primary text-primary-foreground h-10 px-4">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
