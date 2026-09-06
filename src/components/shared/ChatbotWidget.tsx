import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Send, Bot, User, Minimize2, Maximize2, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { aiService } from "@/services/ai.service";

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export function ChatbotWidget() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: isAr
        ? "مرحباً بك! أنا مساعد الذكاء الاصطناعي الأكاديمي. كيف يمكنني مساعدتك في تحليل السلوك، متابعة المسار الأكاديمي، أو الاستفسارات اليوم؟"
        : "Hello! I am your AI Academic & Behavioral Assistant. How can I assist you with performance analytics, risk mitigation, or study roadmaps today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: isAr
        ? ["ما هي مؤشرات الخطر للطلاب؟", "كيف أحسن نسبة الحضور؟", "توليد خطة دعم دراسية"]
        : ["What are top risk indicators?", "How to improve attendance rate?", "Generate study support plan"],
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || inputValue;
    if (!messageText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsLoading(true);

    try {
      const reply = await aiService.sendMessage(messageText);
      const botMsg: Message = {
        id: reply.id,
        type: "bot",
        text: reply.message,
        timestamp: reply.timestamp,
        suggestions: reply.suggestions,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      const errorMsg: Message = {
        id: Date.now().toString(),
        type: "bot",
        text: isAr
          ? "عذراً، حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى."
          : "Sorry, I encountered an issue connecting to the AI core. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/25 hover:shadow-2xl hover:scale-105 z-50 transition-all flex items-center justify-center group"
      >
        <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 rtl:right-auto rtl:left-6 w-80 sm:w-96 bg-card/95 backdrop-blur-2xl border border-border/80 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[520px] max-h-[82vh]'}`}>
      {/* Floating Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-secondary/60 border-b border-border/70 cursor-pointer shrink-0" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground leading-none flex items-center gap-1.5">
              <span>{isAr ? "المساعد الذكي (SBA AI)" : "SBA AI Intelligence"}</span>
            </h3>
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isAr ? "متصل بالخادم" : "FastAPI / Reverb Ready"}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}>
            {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); setIsOpen(false); setIsMinimized(false); }}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      {!isMinimized && (
        <>
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4 pb-2">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  <div className={`flex gap-2.5 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs mt-0.5 ${msg.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary border border-border'}`}>
                      {msg.type === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>
                    <div className={`p-3.5 rounded-2xl max-w-[82%] text-xs font-medium leading-relaxed whitespace-pre-line ${msg.type === 'user' ? 'bg-primary text-primary-foreground rounded-tr-xs' : 'bg-secondary/70 border border-border/70 text-foreground rounded-tl-xs'}`}>
                      {msg.text}
                      <div className="text-[9px] opacity-70 font-mono mt-1 text-right rtl:text-left">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>

                  {/* Suggestion Quick Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pl-9 rtl:pl-0 rtl:pr-9 pt-1">
                      {msg.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(suggestion)}
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-secondary hover:bg-primary/15 hover:text-primary border border-border/80 transition-all text-muted-foreground"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 pl-9 rtl:pl-0 rtl:pr-9 text-xs text-muted-foreground">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  <span>{isAr ? "جارٍ التحليل والتوليد..." : "Analyzing student data..."}</span>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Prompt Input Form */}
          <div className="p-3 bg-secondary/40 border-t border-border/70 shrink-0">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <Input
                placeholder={isAr ? "اطرح سؤالاً أو استفساراً..." : "Ask a question..."}
                className="bg-card border-border text-foreground h-10 rounded-full text-xs px-4 focus-visible:ring-primary/30"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-full bg-primary text-primary-foreground shadow-xs hover:opacity-95"
                disabled={!inputValue.trim() || isLoading}
              >
                <Send className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </form>
          </div>
        </>
      )}
    </Card>
  );
}
