import { Bell, AlertTriangle, Lightbulb, CheckCircle2, TrendingUp, TrendingDown, Clock, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockAlerts = [
  { id: 1, type: 'warning', title: 'Attendance Alert', message: 'You have missed 2 consecutive sessions in Physics I. One more absence will affect your final grade.', time: '2 hours ago', icon: Clock },
  { id: 2, type: 'danger', title: 'Grade Risk', message: 'Your performance in Data Structures has dropped below the class average. Risk level elevated.', time: '1 day ago', icon: TrendingDown },
];

const mockRecommendations = [
  { id: 1, title: 'Schedule Tutoring', description: 'Based on your recent quiz scores, we recommend scheduling a 1-on-1 peer tutoring session for Data Structures.', impact: 'High Impact', action: 'Book Session' },
  { id: 2, title: 'Study Group', description: 'Join the Physics I study group meeting this Thursday to review Kinetics before the midterm.', impact: 'Medium Impact', action: 'Join Group' },
  { id: 3, title: 'Review Lecture Materials', description: 'You spent 40% less time reviewing lecture slides this week. Try to allocate 30 extra minutes per day.', impact: 'Medium Impact', action: 'View Materials' },
];

export default function StudentAlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bell className="h-8 w-8 text-amber-400" />
            Alerts & Recommendations
          </h1>
          <p className="text-slate-400 mt-1">
            Stay on track with personalized insights and early warnings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-slate-900/50 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
                Risk Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full border-4 border-amber-500 flex items-center justify-center mb-3 bg-amber-500/10">
                  <span className="text-2xl font-bold text-amber-400">Elevated</span>
                </div>
                <p className="text-sm text-slate-300">
                  Your academic risk level has recently increased due to low assignment scores in Data Structures.
                </p>
                <Button className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white">
                  Speak to Advisor
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-white/10">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-slate-400" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 p-0">
              <div className="divide-y divide-white/5">
                {mockAlerts.map(alert => (
                  <div key={alert.id} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex gap-3">
                      <div className={`mt-0.5 p-2 rounded-full h-fit ${alert.type === 'danger' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        <alert.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">{alert.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-2">{alert.message}</p>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" /> {alert.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/50 border-white/10 h-full">
            <CardHeader className="pb-3 border-b border-white/5">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-400" />
                    Personalized Recommendations
                  </CardTitle>
                  <CardDescription className="text-slate-400 mt-1">
                    AI-generated suggestions based on your learning patterns and current struggles.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                  <TrendingUp className="h-3 w-3 mr-1" /> To Improve
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {mockRecommendations.map(rec => (
                  <div key={rec.id} className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/50 p-5 hover:border-indigo-500/30 transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50 group-hover:bg-indigo-500 transition-colors" />
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 ml-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
                          <Badge variant="secondary" className="bg-slate-800 text-slate-300 text-[10px] h-5">
                            {rec.impact}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                          {rec.description}
                        </p>
                      </div>
                      
                      <div className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                        <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20">
                          <CheckCircle2 className="mr-2 h-4 w-4" /> {rec.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
