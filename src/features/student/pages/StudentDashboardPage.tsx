import { LayoutDashboard, GraduationCap, Clock, Activity, AlertTriangle, ChevronRight, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock Data
const gpaHistory = [
  { term: "Fall '22", gpa: 3.2 },
  { term: "Spr '23", gpa: 3.4 },
  { term: "Fall '23", gpa: 3.1 },
  { term: "Spr '24", gpa: 2.8 },
  { term: "Current", gpa: 2.9 },
];

const activityData = [
  { week: "W1", logins: 12, assignments: 4 },
  { week: "W2", logins: 15, assignments: 5 },
  { week: "W3", logins: 10, assignments: 3 },
  { week: "W4", logins: 8, assignments: 2 },
  { week: "W5", logins: 5, assignments: 1 },
];

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-cyan-400" />
            My Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here is a summary of your academic performance and activity.
          </p>
        </div>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 py-1.5 px-3">
          <AlertTriangle className="w-4 h-4 mr-2" /> 2 Alerts Pending
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current GPA</CardTitle>
            <GraduationCap className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">2.90</div>
            <p className="text-xs text-rose-400 flex items-center mt-1">
              <TrendingDown className="w-3 h-3 mr-1" /> -0.2 from last term
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attendance</CardTitle>
            <Clock className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">82%</div>
            <Progress value={82} className="h-1.5 mt-2 bg-muted" indicatorColor="bg-emerald-500" />
            <p className="text-xs text-muted-foreground mt-2">Target: 90%</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Activity Level</CardTitle>
            <Activity className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">Low</div>
            <p className="text-xs text-rose-400 flex items-center mt-1">
              <TrendingDown className="w-3 h-3 mr-1" /> System logins down 40%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border border-l-4 border-l-rose-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Weak Subjects</CardTitle>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">Physics I</div>
            <div className="text-sm text-muted-foreground mt-1">Data Structures</div>
            <p className="text-xs text-rose-400 mt-2">Action required</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">GPA Trend</CardTitle>
            <CardDescription className="text-muted-foreground">Your historical performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gpaHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="term" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} />
                  <YAxis domain={[0, 4]} stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', color: '#fff' }} />
                  <Area type="monotone" dataKey="gpa" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorGpa)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Recent Engagement</CardTitle>
            <CardDescription className="text-muted-foreground">Portal logins vs assignments submitted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="week" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', color: '#fff' }} cursor={{fill: '#ffffff05'}} />
                  <Bar dataKey="logins" name="System Logins" fill="#818cf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="assignments" name="Submitted Work" fill="#34d399" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground">Upcoming Tasks & Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/50 border border-border rounded-lg hover:bg-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">Physics I Midterm</p>
                  <p className="text-xs text-muted-foreground">Due in 2 days</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-8 border-border text-muted-foreground hover:text-foreground">
                View <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 border border-border rounded-lg hover:bg-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">Advisor Meeting Scheduling</p>
                  <p className="text-xs text-muted-foreground">Required before registration</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-8 border-border text-muted-foreground hover:text-foreground">
                Schedule <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
