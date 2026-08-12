import { useState } from "react";
import { Settings, ShieldCheck, BellRing, UserCheck, CreditCard, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ParentSettingsPage() {
  const [selectedChild, setSelectedChild] = useState("STU-001");
  
  const [dataConsent, setDataConsent] = useState(true);
  const [aiConsent, setAiConsent] = useState(true);
  
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [alertFrequency, setAlertFrequency] = useState("immediate");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="h-8 w-8 text-fuchsia-400" />
            Family Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage consents, notifications, and preferences for your family account.
          </p>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="w-full space-y-6">
        <TabsList className="bg-card/50 border border-border p-1">
          <TabsTrigger value="notifications" className="data-[state=active]:bg-fuchsia-600 data-[state=active]:text-foreground">
            <BellRing className="w-4 h-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="consent" className="data-[state=active]:bg-fuchsia-600 data-[state=active]:text-foreground">
            <ShieldCheck className="w-4 h-4 mr-2" /> Consent Management
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-fuchsia-600 data-[state=active]:text-foreground">
            <CreditCard className="w-4 h-4 mr-2" /> Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6 m-0 animate-in fade-in duration-300">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Alert Preferences</CardTitle>
              <CardDescription className="text-muted-foreground">Choose how and when you receive updates about your children.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-4 pb-6 border-b border-white/5">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Channels</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="push" className="text-foreground text-base">Mobile Push Notifications</Label>
                    <span className="text-sm text-muted-foreground">Receive instant alerts via the mobile app/PWA.</span>
                  </div>
                  <Switch id="push" checked={pushEnabled} onCheckedChange={setPushEnabled} className="data-[state=checked]:bg-fuchsia-500" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="email" className="text-foreground text-base">Email Notifications</Label>
                    <span className="text-sm text-muted-foreground">Receive detailed reports and alerts via email.</span>
                  </div>
                  <Switch id="email" checked={emailEnabled} onCheckedChange={setEmailEnabled} className="data-[state=checked]:bg-fuchsia-500" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="sms" className="text-foreground text-base">SMS Text Messages</Label>
                    <span className="text-sm text-muted-foreground">Receive critical alerts via SMS (carrier charges may apply).</span>
                  </div>
                  <Switch id="sms" checked={smsEnabled} onCheckedChange={setSmsEnabled} className="data-[state=checked]:bg-fuchsia-500" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Frequency</h3>
                <div className="max-w-xs">
                  <Label className="text-foreground mb-2 block">Alert Digest</Label>
                  <Select value={alertFrequency} onValueChange={setAlertFrequency}>
                    <SelectTrigger className="w-full bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground">
                      <SelectItem value="immediate">Immediate (Real-time)</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">Critical safety alerts will always be sent immediately regardless of this setting.</p>
                </div>
              </div>

            </CardContent>
            <CardFooter className="border-t border-white/5 pt-4 bg-white/[0.02]">
              <Button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-foreground">
                <Save className="w-4 h-4 mr-2" /> Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="consent" className="space-y-6 m-0 animate-in fade-in duration-300">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-foreground">Data Consent Management</CardTitle>
                  <CardDescription className="text-muted-foreground">Manage platform permissions on behalf of your minor children.</CardDescription>
                </div>
                <div className="w-[200px]">
                  <Select value={selectedChild} onValueChange={setSelectedChild}>
                    <SelectTrigger className="w-full bg-background border-border text-foreground">
                      <SelectValue placeholder="Select a child" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground">
                      <SelectItem value="STU-001">Alice Johnson</SelectItem>
                      <SelectItem value="STU-002">Bob Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-200">
                  As the registered guardian, you have the authority to manage these settings for {selectedChild === 'STU-001' ? 'Alice' : 'Bob'}. 
                  Changes take effect immediately across the platform.
                </p>
              </div>

              <div className="space-y-6 mt-4">
                <div className="flex items-start justify-between space-x-4">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="child-data-consent" className="text-foreground text-base">Core Academic Processing</Label>
                    <span className="text-sm text-muted-foreground">
                      Allow the institution to process grades, attendance, and behavioral logs to generate reports and calculate basic risk scores. Required for enrollment.
                    </span>
                  </div>
                  <Switch 
                    id="child-data-consent" 
                    checked={dataConsent} 
                    onCheckedChange={setDataConsent}
                    className="data-[state=checked]:bg-emerald-500 mt-1"
                  />
                </div>

                <div className="flex items-start justify-between space-x-4">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="child-ai-consent" className="text-foreground text-base">Advanced AI Analytics</Label>
                    <span className="text-sm text-muted-foreground">
                      Allow the platform's AI models to analyze your child's data to discover hidden patterns, provide personalized recommendations, and project future performance.
                    </span>
                  </div>
                  <Switch 
                    id="child-ai-consent" 
                    checked={aiConsent} 
                    onCheckedChange={setAiConsent}
                    className="data-[state=checked]:bg-emerald-500 mt-1"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 pt-4 bg-white/[0.02]">
              <Button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-foreground">
                <Save className="w-4 h-4 mr-2" /> Save Consent Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 m-0 animate-in fade-in duration-300">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Tuition & Billing</CardTitle>
              <CardDescription className="text-muted-foreground">View balances and payment history.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center border-2 border-dashed border-border rounded-xl">
                <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-muted-foreground">No balances due</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2">All tuition and fee accounts are currently up to date.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
