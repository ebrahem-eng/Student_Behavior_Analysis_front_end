import { useState } from "react";
import { Inbox, AlertOctagon, CheckCircle2, XCircle, Search, ShieldAlert, FileText, ChevronRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

// Mock Data
const MOCK_INBOX_ALERTS = [
  { id: 1, student: "Eva Green", risk: "Critical", source: "System AI", description: "Consecutive absences combined with a mid-term grade of 55%. High probability of failure.", time: "10 mins ago", status: "Unread" },
  { id: 2, student: "David Miller", risk: "High", source: "Prof. Smith (Math 101)", description: "Student seems distracted and missed the last two homework assignments.", time: "2 hours ago", status: "Read" },
];

const MOCK_RECOMMENDATIONS = [
  { id: 1, student: "Eva Green", suggestion: "Schedule a mandatory 1-on-1 counseling session and notify parents.", aiConfidence: 95, status: "Pending" },
  { id: 2, student: "Charlie Brown", suggestion: "Assign a peer tutor for upcoming physics exam.", aiConfidence: 82, status: "Approved" },
];

export default function AdvisorInboxPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Inbox className="h-8 w-8 text-indigo-500" />
            Early-Alert Inbox
          </h1>
          <p className="text-slate-400 mt-1">
            Review incoming risk alerts and manage AI-generated intervention plans.
          </p>
        </div>
      </div>

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="bg-slate-900/50 border border-white/5 mb-6">
          <TabsTrigger value="alerts" className="data-[state=active]:bg-primary data-[state=active]:text-white relative">
            <AlertOctagon className="w-4 h-4 mr-2" /> 
            Incoming Alerts
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" /> 
            Intervention Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <div className="relative w-full sm:w-96 mb-6">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search alerts by student..."
              className="pl-9 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {MOCK_INBOX_ALERTS.map(alert => (
              <Card key={alert.id} className={`bg-slate-900/50 border-l-4 transition-all hover:bg-slate-900/80 ${alert.risk === 'Critical' ? 'border-l-rose-500 border-white/10' : 'border-l-orange-500 border-white/10'}`}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-white text-lg">{alert.student}</h3>
                        {alert.status === "Unread" && <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/20">New</Badge>}
                        <Badge variant="outline" className={alert.risk === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}>
                          {alert.risk} Risk
                        </Badge>
                      </div>
                      <div className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" /> Source: {alert.source}
                      </div>
                      <p className="text-slate-300 bg-white/5 p-3 rounded-md border border-white/5 mt-2">
                        {alert.description}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Received {alert.time}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <Button className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90">
                        View Profile <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                      <Button variant="outline" className="w-full sm:w-auto border-white/10 text-slate-300 hover:text-white hover:bg-white/5">
                        <MessageSquare className="w-4 h-4 mr-2" /> Message Student
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {MOCK_RECOMMENDATIONS.map(rec => (
              <Card key={rec.id} className="bg-slate-900/50 border-white/10 overflow-hidden">
                <div className="bg-indigo-500/10 p-4 border-b border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <span className="font-semibold text-indigo-400">AI Plan for {rec.student}</span>
                  </div>
                  <Badge variant="outline" className="border-indigo-500/30 text-indigo-300">
                    {rec.aiConfidence}% Confidence
                  </Badge>
                </div>
                <CardContent className="p-6">
                  {rec.status === "Pending" ? (
                    <div className="space-y-4">
                      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Proposed Action</label>
                        <Textarea 
                          defaultValue={rec.suggestion}
                          className="bg-slate-950 border-white/20 text-white min-h-[100px]"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <Button variant="outline" className="border-rose-500/50 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300">
                          <XCircle className="w-4 h-4 mr-2" /> Reject Plan
                        </Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Approve & Enact
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-white text-lg">{rec.suggestion}</p>
                      <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 w-fit">
                        <CheckCircle2 className="w-4 h-4" /> Approved & Active
                      </div>
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
