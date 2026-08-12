import { useState } from "react";
import { MessageCircle, Send, User, Paperclip } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const messages = [
  { id: 1, sender: 'advisor', name: 'Dr. Sarah Smith', text: "Hello! I'm reviewing Alice's recent progress in Data Structures and wanted to touch base regarding her recent quiz scores.", time: "10:30 AM" },
  { id: 2, sender: 'parent', name: 'You', text: "Thank you for reaching out. She mentioned struggling with the recent topics. Are there tutoring options available?", time: "11:15 AM" },
  { id: 3, sender: 'advisor', name: 'Dr. Sarah Smith', text: "Yes, we have peer tutoring sessions every Tuesday and Thursday afternoon. I've sent her an invite to the next session.", time: "11:45 AM" },
];

export default function ParentCommunicationsPage() {
  const [chatInput, setChatInput] = useState("");
  const [selectedChild, setSelectedChild] = useState("STU-001");

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-fuchsia-400" />
            Advisor Communications
          </h1>
          <p className="text-muted-foreground mt-1">
            Direct messaging with your child's assigned academic advisor.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-card/50 p-2 rounded-xl border border-border">
          <span className="text-sm text-muted-foreground font-medium px-2">Student:</span>
          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger className="w-[200px] bg-background border-border text-foreground">
              <SelectValue placeholder="Select a child" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-foreground">
              <SelectItem value="STU-001">Alice Johnson</SelectItem>
              <SelectItem value="STU-002">Bob Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-card/50 border-border flex-1 flex flex-col min-h-0">
        <CardHeader className="border-b border-border shrink-0 bg-background/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border border-border">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">Dr. Sarah Smith</CardTitle>
              <CardDescription className="text-muted-foreground">Academic Advisor for Alice Johnson</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-xs text-slate-500 bg-background px-3 py-1 rounded-full border border-white/5">Today</span>
            </div>
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-4 ${msg.sender === 'parent' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'parent' ? 'bg-fuchsia-600' : 'bg-slate-700'}`}>
                  <User className="w-4 h-4 text-foreground" />
                </div>
                <div className={`flex flex-col ${msg.sender === 'parent' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  <span className="text-xs text-muted-foreground mb-1 mx-1">{msg.name} • {msg.time}</span>
                  <div className={`p-4 rounded-2xl border ${msg.sender === 'parent' ? 'bg-fuchsia-600/20 border-fuchsia-500/30 text-foreground rounded-tr-sm' : 'bg-muted/50 border-border text-card-foreground rounded-tl-sm'}`}>
                    <p>{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border bg-background/80 shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary shrink-0">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Input 
              placeholder="Type your message..." 
              className="flex-1 bg-card border-border text-foreground pl-4 h-12 rounded-xl focus-visible:ring-fuchsia-500" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <Button size="icon" className="h-12 w-12 bg-fuchsia-600 hover:bg-fuchsia-700 text-foreground rounded-xl transition-transform hover:scale-105 shrink-0">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
