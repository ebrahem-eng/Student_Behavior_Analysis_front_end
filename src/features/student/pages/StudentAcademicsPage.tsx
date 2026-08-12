import { useState } from "react";
import { BookOpen, Bot, TrendingUp, Send, User, ChevronRight, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// Mock Data
const projectionData = [
  { week: "W1", current: 82, projected: 82 },
  { week: "W4", current: 78, projected: 79 },
  { week: "W8", current: 75, projected: 77 },
  { week: "W12", current: null, projected: 81 },
  { week: "Final", current: null, projected: 84 },
];

export default function StudentAcademicsPage() {
  const [chatInput, setChatInput] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-indigo-400" />
            Academics & AI Guide
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your performance projections and get AI-powered study assistance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-foreground flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    Performance Projection
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    AI-predicted end-of-term grade based on current trajectory.
                  </CardDescription>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  Projected: B (84%)
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projectionData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="week" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} />
                    <YAxis domain={[60, 100]} stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', color: '#fff' }} />
                    <ReferenceLine y={80} stroke="#ffffff20" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Goal: B (80%)', fill: '#64748b', fontSize: 12 }} />
                    <Line type="monotone" dataKey="current" name="Current Grade" stroke="#818cf8" strokeWidth={3} dot={{r: 4, fill: '#818cf8'}} />
                    <Line type="monotone" dataKey="projected" name="Projected Path" stroke="#34d399" strokeWidth={3} strokeDasharray="5 5" dot={{r: 4, fill: '#34d399'}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <p className="text-sm text-indigo-200">
                  <strong className="text-indigo-400">AI Insight:</strong> Your grade has dipped recently, but strong performance on the upcoming Midterm could pull you back up to an 84% average.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-foreground">Course Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Data Structures', 'Physics I', 'Calculus II'].map((course, i) => (
                  <div key={course} className="flex items-center justify-between p-3 bg-secondary/50 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center border border-white/5">
                        <Award className={`w-5 h-5 ${i === 1 ? 'text-rose-400' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{course}</p>
                        <p className="text-xs text-muted-foreground">Current: {i === 1 ? '75%' : '88%'}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="h-[600px] lg:h-auto">
          <Card className="h-full bg-card/50 border-border flex flex-col">
            <CardHeader className="border-b border-border bg-indigo-500/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">Academic Copilot</CardTitle>
                  <p className="text-sm text-indigo-300/70">Ask me why your performance changed or how to improve.</p>
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
                    <p className="text-card-foreground">Hi there! I noticed your Physics I grade dropped to 75% recently. I can help you understand why or build a study plan.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-secondary/50 hover:bg-secondary text-muted-foreground cursor-pointer">"Why did my grade drop?"</Badge>
                      <Badge variant="secondary" className="bg-secondary/50 hover:bg-secondary text-muted-foreground cursor-pointer">"Build a midterm study plan"</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="bg-primary/20 border border-primary/30 rounded-2xl rounded-tr-sm p-4 max-w-[80%]">
                    <p className="text-foreground">Why did my grade drop in Physics?</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="bg-muted/50 rounded-2xl rounded-tl-sm p-4 border border-indigo-500/10 w-full">
                    <p className="text-card-foreground mb-3">Based on your recent activity, here is why your grade trended downwards:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                      <li>You scored 60% on <strong>Quiz 4 (Kinetics)</strong>.</li>
                      <li>You missed the lecture on Tuesday.</li>
                      <li>You have not accessed the supplemental reading materials for Chapter 5.</li>
                    </ul>
                    <p className="text-card-foreground mt-3 text-sm">Would you like me to generate a practice quiz for Kinetics?</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border bg-card/30">
              <div className="flex items-center gap-2 relative">
                <Input 
                  placeholder="Ask a question..." 
                  className="flex-1 bg-background border-border text-foreground pl-4 pr-12 h-12 rounded-xl" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <Button size="icon" className="absolute right-1.5 top-1.5 h-9 w-9 bg-indigo-600 hover:bg-indigo-700 text-foreground rounded-lg transition-transform hover:scale-105">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
