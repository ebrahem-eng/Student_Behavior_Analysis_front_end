import { useState } from "react";
import { MessageCircle, Bot, Send, Search, Users, Phone, Video, Paperclip, User, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function AdvisorCommunicationsPage() {
  const [activeChat, setActiveChat] = useState("parent1");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-cyan-400" />
            Communications & AI Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect with parents securely and interact with the AI assistant for analytical insights.
          </p>
        </div>
      </div>

      <Tabs defaultValue="parents" className="w-full">
        <TabsList className="bg-card/50 border border-white/5 mb-6">
          <TabsTrigger value="parents" className="data-[state=active]:bg-primary data-[state=active]:text-foreground">
            <Users className="w-4 h-4 mr-2" /> Parent Portal
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-primary data-[state=active]:text-foreground relative">
            <Bot className="w-4 h-4 mr-2 text-indigo-400" /> Academic Chatbot
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parents" className="h-[600px]">
          <Card className="h-full bg-card/50 border-border flex flex-col sm:flex-row overflow-hidden">
            {/* Sidebar */}
            <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-border flex flex-col">
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-9 bg-background border-border text-foreground" />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {[1, 2, 3].map((i) => (
                    <button
                      key={i}
                      onClick={() => setActiveChat(`parent${i}`)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${activeChat === `parent${i}` ? 'bg-primary/20 border border-primary/30' : 'hover:bg-secondary/50 border border-transparent'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-card-foreground">Parent of Student {i}</span>
                        <span className="text-xs text-slate-500">2h</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">Thanks for the update on their grades...</p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-background/50">
              <div className="p-4 border-b border-border flex justify-between items-center bg-card/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                    P
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Mr. & Mrs. Green</h3>
                    <p className="text-xs text-muted-foreground">Parents of Eva Green</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Video className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Badge variant="outline" className="bg-card border-border text-slate-500">Today</Badge>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex-shrink-0" />
                    <div className="bg-muted rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                      <p className="text-card-foreground text-sm">Hello, I saw the notification about Eva's recent absences. Is she falling behind?</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">10:24 AM</span>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0" />
                    <div className="bg-primary/20 border border-primary/30 rounded-2xl rounded-tr-sm p-3 max-w-[80%]">
                      <p className="text-foreground text-sm">Hi Mr. Green. Yes, she missed the last 3 sessions. I recommend we set up a quick 15-minute call to discuss a plan.</p>
                      <span className="text-[10px] text-primary/60 mt-1 block text-right">10:30 AM</span>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border bg-card/30">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Input placeholder="Type your message..." className="flex-1 bg-card border-border text-foreground" />
                  <Button className="bg-primary hover:bg-primary/90 text-foreground">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="h-[600px]">
          <Card className="h-full bg-card/50 border-border flex flex-col">
            <CardHeader className="border-b border-border bg-indigo-500/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">Academic AI Assistant</CardTitle>
                  <p className="text-sm text-indigo-300/70">Ask analytical questions about your student cohort</p>
                </div>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="bg-muted/50 rounded-2xl rounded-tl-sm p-4 border border-white/5">
                    <p className="text-card-foreground">Hello! I'm your academic assistant. How can I help you analyze your cohort today?</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-secondary/50 hover:bg-secondary text-muted-foreground cursor-pointer">"Show me students failing math"</Badge>
                      <Badge variant="secondary" className="bg-secondary/50 hover:bg-secondary text-muted-foreground cursor-pointer">"Why did attendance drop this week?"</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="bg-primary/20 border border-primary/30 rounded-2xl rounded-tr-sm p-4 max-w-[80%]">
                    <p className="text-foreground">Are there any common patterns among students who failed the recent physics midterm?</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="bg-muted/50 rounded-2xl rounded-tl-sm p-4 border border-indigo-500/10 w-full">
                    <p className="text-card-foreground mb-3">I analyzed the recent physics midterm results. Here are the discovered patterns for the 14 students who failed:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                      <li><strong>85%</strong> of them missed at least 2 consecutive classes in the weeks prior.</li>
                      <li><strong>71%</strong> did not submit Assignment #4 (Kinetics).</li>
                      <li>Their average participation score over the last month was "Low".</li>
                    </ul>
                    <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex gap-3 items-start">
                      <ShieldAlert className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-indigo-200">
                        <strong>Recommendation:</strong> Schedule targeted review sessions focused on Kinetics and enforce mandatory attendance for those scoring below 60%.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border bg-card/30">
              <div className="flex items-center gap-2 relative">
                <Input placeholder="Ask a question..." className="flex-1 bg-background border-border text-foreground pl-4 pr-12 h-12 rounded-xl" />
                <Button size="icon" className="absolute right-1.5 top-1.5 h-9 w-9 bg-indigo-600 hover:bg-indigo-700 text-foreground rounded-lg transition-transform hover:scale-105">
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
