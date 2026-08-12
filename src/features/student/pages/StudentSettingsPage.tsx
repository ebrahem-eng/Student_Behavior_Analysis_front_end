import { useState } from "react";
import { Settings, ShieldCheck, HeartPulse, Check, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export default function StudentSettingsPage() {
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [dataConsent, setDataConsent] = useState(true);
  const [aiConsent, setAiConsent] = useState(true);
  const [parentConsent, setParentConsent] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Settings className="h-8 w-8 text-slate-400" />
            Settings & Well-being
          </h1>
          <p className="text-slate-400 mt-1">
            Manage your privacy preferences and complete your weekly check-in.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <HeartPulse className="w-24 h-24 text-rose-500/5 -rotate-12" />
            </div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-rose-400" />
                Weekly Well-being Check-in
              </CardTitle>
              <CardDescription className="text-slate-400">
                Help us understand how you're feeling so we can better support your academic journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
              {surveySubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">Thank you!</h3>
                  <p className="text-slate-400 max-w-sm">Your feedback helps us tailor the support you receive. Have a great week!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base text-slate-200 mb-3 block">How would you rate your stress levels this week?</Label>
                      <RadioGroup defaultValue="moderate" className="flex gap-4">
                        <div className="flex items-center space-x-2 bg-slate-950 p-3 rounded-lg border border-white/5 flex-1">
                          <RadioGroupItem value="low" id="r1" className="border-emerald-500 text-emerald-500" />
                          <Label htmlFor="r1" className="cursor-pointer">Low</Label>
                        </div>
                        <div className="flex items-center space-x-2 bg-slate-950 p-3 rounded-lg border border-white/5 flex-1">
                          <RadioGroupItem value="moderate" id="r2" className="border-amber-500 text-amber-500" />
                          <Label htmlFor="r2" className="cursor-pointer">Moderate</Label>
                        </div>
                        <div className="flex items-center space-x-2 bg-slate-950 p-3 rounded-lg border border-white/5 flex-1">
                          <RadioGroupItem value="high" id="r3" className="border-rose-500 text-rose-500" />
                          <Label htmlFor="r3" className="cursor-pointer">High</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base text-slate-200">Are there any personal or academic challenges you'd like to share?</Label>
                      <Textarea 
                        placeholder="Optional: I've been struggling to balance part-time work with my Physics assignments..." 
                        className="bg-slate-950 border-white/10 resize-none h-32 focus-visible:ring-rose-500"
                      />
                    </div>
                  </div>
                  <Button onClick={() => setSurveySubmitted(true)} className="w-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/20">
                    Submit Check-in
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                Data & Privacy Consent
              </CardTitle>
              <CardDescription className="text-slate-400">
                Control how your data is used across the learning platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex items-center justify-between space-x-4">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="data-consent" className="text-white text-base">Academic Data Processing</Label>
                  <span className="text-sm text-slate-400">Allow the system to analyze grades and attendance to calculate risk scores. (Required for core functionality)</span>
                </div>
                <Switch 
                  id="data-consent" 
                  checked={dataConsent} 
                  onCheckedChange={setDataConsent}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between space-x-4">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="ai-consent" className="text-white text-base">AI Predictive Analytics</Label>
                  <span className="text-sm text-slate-400">Allow AI models to generate future performance projections and personalized study recommendations.</span>
                </div>
                <Switch 
                  id="ai-consent" 
                  checked={aiConsent} 
                  onCheckedChange={setAiConsent}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between space-x-4">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="parent-consent" className="text-white text-base">Parent/Guardian Visibility</Label>
                  <span className="text-sm text-slate-400">Allow linked parent accounts to view detailed risk alerts and AI recommendations.</span>
                </div>
                <Switch 
                  id="parent-consent" 
                  checked={parentConsent} 
                  onCheckedChange={setParentConsent}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>

              {(!dataConsent || !aiConsent) && (
                <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  <p className="text-sm text-rose-200">
                    Disabling core data processing or AI analytics will severely limit the platform's ability to provide you with early alerts and personalized guidance.
                  </p>
                </div>
              )}

            </CardContent>
            <CardFooter className="border-t border-white/5 pt-4 bg-white/[0.02]">
              <Button variant="outline" className="w-full border-white/10 text-slate-300 hover:text-white">
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
