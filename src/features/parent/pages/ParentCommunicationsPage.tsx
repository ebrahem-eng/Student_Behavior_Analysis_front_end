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
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-fuchsia-400" />
            Advisor Communications
          </h1>
          <p className="text-slate-400 mt-1">
            Direct messaging with your child's assigned academic advisor.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-xl border border-white/10">
          <span className="text-sm text-slate-400 font-medium px-2">Student:</span>
          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger className="w-[200px] bg-slate-950 border-white/10 text-white">
              <SelectValue placeholder="Select a child" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white">
              <SelectItem value="STU-001">Alice Johnson</SelectItem>
              <SelectItem value="STU-002">Bob Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-white/10 flex-1 flex flex-col min-h-0">
        <CardHeader className="border-b border-white/10 shrink-0 bg-slate-950/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
              <User className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">Dr. Sarah Smith</CardTitle>
              <CardDescription className="text-slate-400">Academic Advisor for Alice Johnson</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-xs text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-white/5">Today</span>
            </div>
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-4 ${msg.sender === 'parent' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'parent' ? 'bg-fuchsia-600' : 'bg-slate-700'}`}>
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className={`flex flex-col ${msg.sender === 'parent' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  <span className="text-xs text-slate-400 mb-1 mx-1">{msg.name} • {msg.time}</span>
                  <div className={`p-4 rounded-2xl border ${msg.sender === 'parent' ? 'bg-fuchsia-600/20 border-fuchsia-500/30 text-white rounded-tr-sm' : 'bg-slate-800/50 border-white/10 text-slate-200 rounded-tl-sm'}`}>
                    <p>{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-white/10 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10 shrink-0">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Input 
              placeholder="Type your message..." 
              className="flex-1 bg-slate-900 border-white/10 text-white pl-4 h-12 rounded-xl focus-visible:ring-fuchsia-500" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <Button size="icon" className="h-12 w-12 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl transition-transform hover:scale-105 shrink-0">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
