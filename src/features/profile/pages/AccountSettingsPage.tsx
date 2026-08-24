import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  User, Mail, Phone, Lock, Shield, Key, Save, CheckCircle2, 
  AlertCircle, Loader2, Sparkles, Building, GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";
import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/lib/api";

export default function AccountSettingsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const user = useAppStore((state) => state.user);
  const userRole = useAppStore((state) => state.userRole);
  const setUser = useAppStore((state) => state.setUser);

  // Profile Form State
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Sync state when store updates
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  // Fetch latest profile on mount
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const latestUser = await authService.getMe();
        if (latestUser) {
          setUser(latestUser);
          setName(latestUser.name || "");
          setEmail(latestUser.email || "");
          setPhone(latestUser.phone || "");
        }
      } catch (e) {
        console.warn("[Profile] Could not refresh user profile from server:", e);
      }
    };
    fetchLatest();
  }, [setUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccess(false);
    setProfileError(null);

    try {
      const updated = await authService.updateProfile({
        name,
        email,
        phone,
      });
      setUser(updated);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 4000);
    } catch (err: any) {
      setProfileError(getApiErrorMessage(err, isAr));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(false);
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError(isAr ? "كلمة المرور الجديدة غير متطابقة." : "New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(isAr ? "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل." : "Password must be at least 8 characters.");
      return;
    }

    setIsSavingPassword(true);
    try {
      await authService.updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: any) {
      setPasswordError(getApiErrorMessage(err, isAr));
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary tracking-wide uppercase">
              {isAr ? "إدارة الحساب الشخصي" : "Account & Identity"}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {isAr ? "إعدادات الحساب والملف الشخصي" : "My Account & Settings"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isAr
              ? "تعديل البيانات الشخصية، تحديث كلمة المرور، وإدارة تفضيلات الأمان."
              : "Update your personal credentials, manage password security, and configure portal preferences."}
          </p>
        </div>

        {/* User Identity Capsule */}
        <div className="flex items-center gap-3 p-2.5 pr-4 rounded-full bg-card/90 border border-border shadow-xs">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">{name || user?.name || "User"}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] capitalize px-2 py-0 bg-primary/10 text-primary border-primary/20">
                {userRole || "Member"}
              </Badge>
              <span className="text-[11px] text-muted-foreground">{email || user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-card/85 backdrop-blur-xl border border-border rounded-full p-1 flex flex-wrap h-auto">
          <TabsTrigger value="profile" className="rounded-full text-xs font-semibold">
            <User className="w-3.5 h-3.5 mr-1.5" /> {isAr ? "البيانات الشخصية" : "Profile Details"}
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-full text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 mr-1.5" /> {isAr ? "كلمة المرور والأمان" : "Security & Password"}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-full text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 mr-1.5" /> {isAr ? "تفضيلات الإشعارات" : "Notification Preferences"}
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* PROFILE DETAILS TAB */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-sm">
              <CardHeader className="p-0 pb-6">
                <CardTitle className="text-lg font-bold text-foreground">
                  {isAr ? "المعلومات الأساسية" : "Personal Information"}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {isAr
                    ? "يتم حفظ هذه البيانات مباشرة في جدول المستخدمين في MySQL."
                    : "These details are updated live in your backend MySQL users record."}
                </CardDescription>
              </CardHeader>

              {profileSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{isAr ? "تم تحديث بيانات الملف الشخصي بنجاح!" : "Profile details updated successfully!"}</span>
                </div>
              )}

              {profileError && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="prof-name" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                      <span>{isAr ? "الاسم الكامل" : "Full Name"}</span>
                    </Label>
                    <Input
                      id="prof-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 rounded-2xl bg-secondary/60 border-border text-xs focus-visible:ring-primary/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prof-email" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-primary" />
                      <span>{isAr ? "البريد الإلكتروني" : "Email Address"}</span>
                    </Label>
                    <Input
                      id="prof-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 rounded-2xl bg-secondary/60 border-border text-xs focus-visible:ring-primary/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prof-phone" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      <span>{isAr ? "رقم الهاتف / الجوال" : "Phone Number"}</span>
                    </Label>
                    <Input
                      id="prof-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+966 50 000 0000"
                      className="h-11 rounded-2xl bg-secondary/60 border-border text-xs focus-visible:ring-primary/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-primary" />
                      <span>{isAr ? "المؤسسة التعليمية" : "Educational Institution"}</span>
                    </Label>
                    <Input
                      disabled
                      value={user?.institution?.name || user?.institution_name || (isAr ? "الجامعة الرئيسية" : "Main Campus")}
                      className="h-11 rounded-2xl bg-secondary/30 border-border text-xs text-muted-foreground cursor-not-allowed"
                    />
                  </div>

                  {user?.college && (
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-primary" />
                        <span>{isAr ? "الكلية / القسم الأكاديمي التابع له" : "Assigned College / Faculty"}</span>
                      </Label>
                      <Input
                        disabled
                        value={`${user.college.name} ${user.college.code ? `(${user.college.code})` : ''}`}
                        className="h-11 rounded-2xl bg-primary/5 border-primary/20 text-xs text-primary font-bold cursor-not-allowed"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t border-border/80">
                  <Button
                    type="submit"
                    disabled={isSavingProfile}
                    className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold px-6 h-10 shadow-lg shadow-primary/20"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        <span>{isAr ? "جارٍ الحفظ..." : "Saving..."}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        <span>{isAr ? "حفظ التغييرات" : "Save Changes"}</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>

          {/* SECURITY & PASSWORD TAB */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-sm">
              <CardHeader className="p-0 pb-6">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Key className="w-4 h-4 text-primary" />
                  <span>{isAr ? "تغيير كلمة المرور" : "Update Password"}</span>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {isAr
                    ? "تأكد من اختيار كلمة مرور قوية تحتوي على 8 أحرف على الأقل."
                    : "Ensure your account is using a long, random password to stay secure."}
                </CardDescription>
              </CardHeader>

              {passwordSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{isAr ? "تم تحديث كلمة المرور بنجاح!" : "Password has been updated successfully!"}</span>
                </div>
              )}

              {passwordError && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-5">
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="cur-pwd" className="text-xs font-bold text-foreground">
                      {isAr ? "كلمة المرور الحالية" : "Current Password"}
                    </Label>
                    <Input
                      id="cur-pwd"
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 rounded-2xl bg-secondary/60 border-border text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-pwd" className="text-xs font-bold text-foreground">
                      {isAr ? "كلمة المرور الجديدة" : "New Password"}
                    </Label>
                    <Input
                      id="new-pwd"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 rounded-2xl bg-secondary/60 border-border text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conf-pwd" className="text-xs font-bold text-foreground">
                      {isAr ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"}
                    </Label>
                    <Input
                      id="conf-pwd"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 rounded-2xl bg-secondary/60 border-border text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border/80">
                  <Button
                    type="submit"
                    disabled={isSavingPassword}
                    className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold px-6 h-10 shadow-lg shadow-primary/20"
                  >
                    {isSavingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        <span>{isAr ? "جارٍ التحديث..." : "Updating..."}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        <span>{isAr ? "تحديث كلمة المرور" : "Update Password"}</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>

          {/* NOTIFICATION PREFERENCES TAB */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-sm">
              <CardHeader className="p-0 pb-6">
                <CardTitle className="text-lg font-bold text-foreground">
                  {isAr ? "قنوات والتنبيهات المباشرة" : "Live Alert Routing & Channels"}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {isAr
                    ? "تخصيص القنوات التي تصلك من خلالها تنبيهات الإنذار المبكر."
                    : "Configure where and when you receive high-priority student intelligence alerts."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground">
                      {isAr ? "إشعارات البريد الإلكتروني الفورية" : "Immediate Email Notifications"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {isAr ? "استلام إشعار عند ظهور حالة حرجة جديدة." : "Receive urgent alerts directly to your registered inbox."}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground">
                      {isAr ? "تنبيهات البث المباشر (WebSockets)" : "Real-time Live Bell Alerts"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {isAr ? "إشعارات دفع لحظية على لوحة التحكم." : "Push toast popups via Laravel Reverb engine."}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
