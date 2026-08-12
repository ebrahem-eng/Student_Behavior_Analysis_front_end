import { useState } from "react";
import { Users, Bell, FileText, Download, AlertTriangle, CheckCircle2, ChevronRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const children = [
  { id: "STU-001", name: "Alice Johnson", grade: "10th Grade" },
  { id: "STU-002", name: "Bob Johnson", grade: "8th Grade" },
];

const mockAlerts = [
  { id: 1, studentId: "STU-001", type: "warning", title: "Attendance Notice", message: "Alice has missed 2 days this week.", date: "Today", isRead: false },
  { id: 2, studentId: "STU-001", type: "danger", title: "Academic Alert", message: "Alice's Math grade has dropped below 70%.", date: "Yesterday", isRead: true },
  { id: 3, studentId: "STU-002", type: "info", title: "Positive Feedback", message: "Bob showed great participation in Science today.", date: "2 days ago", isRead: true },
];

const mockReports = [
  { id: "R-101", title: "October Monthly Report", date: "Nov 1, 2024", type: "Monthly Progress" },
  { id: "R-102", title: "Mid-Term Academic Summary", date: "Oct 15, 2024", type: "Academic" },
  { id: "R-103", title: "September Monthly Report", date: "Oct 1, 2024", type: "Monthly Progress" },
];

export default function ParentDashboardPage() {
  const [selectedChild, setSelectedChild] = useState(children[0].id);

  const activeChildAlerts = mockAlerts.filter(a => a.studentId === selectedChild);
  const activeChild = children.find(c => c.id === selectedChild);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="h-8 w-8 text-fuchsia-400" />
            Family Dashboard
          </h1>
          <p className="text-slate-400 mt-1">
            Monitor your children's progress, alerts, and official reports.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-xl border border-white/10">
          <span className="text-sm text-slate-400 font-medium px-2">Viewing:</span>
          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger className="w-[200px] bg-slate-950 border-white/10 text-white">
              <SelectValue placeholder="Select a child" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white">
              {children.map(child => (
                <SelectItem key={child.id} value={child.id}>{child.name} ({child.grade})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/50 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/5">
              <div className="space-y-1">
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Bell className="h-5 w-5 text-amber-400" />
                  Recent Alerts for {activeChild?.name.split(' ')[0]}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Important notifications regarding academic and behavioral status.
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                {activeChildAlerts.filter(a => !a.isRead).length} Unread
              </Badge>
            </CardHeader>
            <CardContent className="pt-4 p-0">
              <div className="divide-y divide-white/5">
                {activeChildAlerts.length > 0 ? (
                  activeChildAlerts.map(alert => (
                    <div key={alert.id} className={`p-4 hover:bg-white/5 transition-colors ${!alert.isRead ? 'bg-white/[0.02]' : ''}`}>
                      <div className="flex justify-between gap-4">
                        <div className="flex gap-3">
                          <div className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full ${!alert.isRead ? 'bg-amber-400' : 'bg-transparent'}`} />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {alert.type === 'danger' && <AlertTriangle className="h-4 w-4 text-rose-500" />}
                              {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                              {alert.type === 'info' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                              <h4 className={`text-sm font-semibold ${!alert.isRead ? 'text-white' : 'text-slate-300'}`}>{alert.title}</h4>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed mb-2">{alert.message}</p>
                            <span className="text-[10px] text-slate-500">{alert.date}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-white shrink-0">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/50 mb-3" />
                    No recent alerts for {activeChild?.name.split(' ')[0]}.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-white/10">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-fuchsia-400" />
                Periodic Reports
              </CardTitle>
              <CardDescription className="text-slate-400">
                Download monthly and mid-term academic summaries.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="rounded-md border border-white/10 overflow-hidden bg-slate-950/50">
                <Table>
                  <TableHeader className="bg-slate-900/50">
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-slate-300">Report Name</TableHead>
                      <TableHead className="text-slate-300">Type</TableHead>
                      <TableHead className="text-slate-300">Date Issued</TableHead>
                      <TableHead className="text-right text-slate-300">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReports.map((report) => (
                      <TableRow key={report.id} className="border-white/10 hover:bg-white/5 transition-colors">
                        <TableCell className="font-medium text-white">{report.title}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                            {report.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">{report.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="h-8 border-fuchsia-500/30 text-fuchsia-400 hover:bg-fuchsia-500/10 hover:text-fuchsia-300">
                            <Download className="w-3 h-3 mr-2" /> PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-white/10 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-lg text-white">Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Overall GPA</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-white">3.4</span>
                    <span className="text-sm text-emerald-400 flex items-center mb-1">
                      <TrendingUp className="w-3 h-3 mr-1" /> +0.2
                    </span>
                  </div>
                </div>
                <div className="w-full h-px bg-white/10 my-4" />
                <div>
                  <p className="text-sm text-slate-400 mb-1">Attendance Rate</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-white">92%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-white/10 hover:border-fuchsia-500/30 transition-colors cursor-pointer group">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-fuchsia-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white group-hover:text-fuchsia-400 transition-colors">Advisor Communications</h3>
                  <p className="text-xs text-slate-400">Message {activeChild?.name.split(' ')[0]}'s assigned advisor.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-fuchsia-400 transition-colors" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
