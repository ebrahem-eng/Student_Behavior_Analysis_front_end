import { useState } from "react";
import { AlertOctagon, BellRing, Sparkles, CheckCircle2, Search, MessageSquarePlus, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Mock Data
const MOCK_ALERTS = [
  { id: 1, student: "Eva Green", risk: "High", reason: "Missed 3 consecutive classes", time: "10 mins ago", status: "Unread" },
  { id: 2, student: "David Miller", risk: "Medium", reason: "Grade dropped below 60%", time: "2 hours ago", status: "Read" },
];

const MOCK_INTERVENTIONS = [
  { id: 1, student: "Eva Green", suggestion: "Schedule a 1-on-1 meeting to discuss attendance.", aiConfidence: 92, implemented: false },
  { id: 2, student: "David Miller", suggestion: "Assign peer tutor for upcoming physics exam.", aiConfidence: 85, implemented: true, outcome: "Improved" },
];

export default function TeacherIncidentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <AlertOctagon className="h-8 w-8 text-rose-500" />
            Early Alerts & Interventions
          </h1>
          <p className="text-slate-400 mt-1">
            Real-time risk inbox and AI-driven intervention recommendations.
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20 transition-all hover:scale-105">
              <MessageSquarePlus className="mr-2 h-4 w-4" /> Report Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-slate-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Report Behavioral Incident</DialogTitle>
              <DialogDescription className="text-slate-400">
                Log a new behavioral issue. This will affect the student's risk score.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="student" className="text-right">Student</Label>
                <Select>
                  <SelectTrigger className="col-span-3 bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10 text-white">
                    <SelectItem value="eva">Eva Green</SelectItem>
                    <SelectItem value="david">David Miller</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="severity" className="text-right">Severity</Label>
                <Select>
                  <SelectTrigger className="col-span-3 bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10 text-white">
                    <SelectItem value="low">Low - Warning</SelectItem>
                    <SelectItem value="medium">Medium - Detention</SelectItem>
                    <SelectItem value="high">High - Parent Contact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notes" className="text-right mt-2">Notes</Label>
                <textarea 
                  id="notes" 
                  className="col-span-3 h-24 rounded-md bg-white/5 border border-white/10 text-white p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  placeholder="Describe the incident..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/10 hover:text-white">Cancel</Button>
              <Button className="bg-rose-600 text-white hover:bg-rose-700">Submit Report</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="bg-slate-900/50 border border-white/5 mb-6">
          <TabsTrigger value="inbox" className="data-[state=active]:bg-primary data-[state=active]:text-white relative">
            <BellRing className="w-4 h-4 mr-2" /> 
            Early-Alert Inbox
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
          </TabsTrigger>
          <TabsTrigger value="interventions" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Sparkles className="w-4 h-4 mr-2 text-indigo-400" /> AI Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <div className="relative w-full sm:w-96 mb-6">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search alerts..."
              className="pl-9 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {MOCK_ALERTS.map(alert => (
              <Card key={alert.id} className={`bg-slate-900/50 border-l-4 transition-all hover:bg-slate-900/80 ${alert.risk === 'High' ? 'border-l-rose-500 border-white/10' : 'border-l-amber-500 border-white/10'}`}>
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-white text-lg">{alert.student}</h3>
                      {alert.status === "Unread" && <Badge className="bg-primary/20 text-primary border-primary/20">New</Badge>}
                    </div>
                    <p className="text-slate-300">{alert.reason}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {alert.time}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto border-white/10 text-slate-300 hover:text-white hover:bg-white/5">
                      Dismiss
                    </Button>
                    <Button className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90">
                      Take Action
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interventions" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {MOCK_INTERVENTIONS.map(intervention => (
              <Card key={intervention.id} className="bg-slate-900/50 border-white/10 overflow-hidden">
                <div className="bg-indigo-500/10 p-4 border-b border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <span className="font-semibold text-indigo-400">AI Suggestion for {intervention.student}</span>
                  </div>
                  <Badge variant="outline" className="border-indigo-500/30 text-indigo-300">
                    {intervention.aiConfidence}% Confidence
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <p className="text-white text-lg mb-6">{intervention.suggestion}</p>
                  
                  <Separator className="bg-white/10 mb-6" />
                  
                  {!intervention.implemented ? (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <span className="text-amber-400 text-sm font-medium flex items-center gap-2">
                        <AlertOctagon className="w-4 h-4" /> Action Pending
                      </span>
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Implemented
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Implemented
                      </div>
                      
                      {!intervention.outcome ? (
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10 space-y-4">
                          <Label className="text-slate-200">Log Outcome</Label>
                          <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300">
                              <TrendingUp className="w-4 h-4 mr-2" /> Improved
                            </Button>
                            <Button variant="outline" className="flex-1 bg-slate-800 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white">
                              No Change
                            </Button>
                            <Button variant="outline" className="flex-1 bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300">
                              <TrendingDown className="w-4 h-4 mr-2" /> Declined
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 w-fit">
                          <TrendingUp className="w-4 h-4" /> Outcome Logged: {intervention.outcome}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
