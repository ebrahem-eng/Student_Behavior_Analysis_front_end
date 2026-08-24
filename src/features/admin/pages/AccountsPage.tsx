import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, UserCog, Loader2, Trash2, RefreshCw, Building, GraduationCap, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { api, getApiErrorMessage } from "@/lib/api";
import type { User, Institution, College } from "@/types/api";

const ROLES = ["admin", "teacher", "student", "advisor", "parent"];

export default function AccountsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [users, setUsers] = useState<User[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form state for creating user
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password");
  const [selectedRole, setSelectedRole] = useState("student");
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>("");
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, instsRes, collegesRes] = await Promise.allSettled([
        api.get('/admin/users'),
        api.get('/admin/institutions'),
        api.get('/admin/colleges'),
      ]);

      if (usersRes.status === 'fulfilled') {
        const data = Array.isArray(usersRes.value.data) ? usersRes.value.data : (usersRes.value.data?.data || []);
        setUsers(data);
      }

      if (instsRes.status === 'fulfilled') {
        const data = Array.isArray(instsRes.value.data) ? instsRes.value.data : (instsRes.value.data?.data || []);
        setInstitutions(data);
      }

      if (collegesRes.status === 'fulfilled') {
        const data = Array.isArray(collegesRes.value.data) ? collegesRes.value.data : (collegesRes.value.data?.data || []);
        setColleges(data);
      }
    } catch (e) {
      console.warn('[Accounts] Error loading data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload: any = {
        name,
        email,
        password,
        role: selectedRole,
      };

      if (selectedInstitutionId && selectedInstitutionId !== "none") {
        payload.institution_id = Number(selectedInstitutionId);
      }

      if (selectedCollegeId && selectedCollegeId !== "none") {
        payload.college_id = Number(selectedCollegeId);
      }

      await api.post('/admin/users', payload);
      setIsDialogOpen(false);
      setName("");
      setEmail("");
      setPassword("password");
      setSelectedInstitutionId("");
      setSelectedCollegeId("");
      loadData();
    } catch (err: any) {
      setFormError(getApiErrorMessage(err, isAr));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string | number) => {
    if (!confirm(isAr ? "هل أنت متأكد من حذف هذا المستخدم؟" : "Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      loadData();
    } catch (err) {
      alert(getApiErrorMessage(err, isAr));
    }
  };

  // Available colleges for the selected institution in the form
  const availableColleges = selectedInstitutionId && selectedInstitutionId !== "none"
    ? colleges.filter((c) => String(c.institution_id) === String(selectedInstitutionId))
    : [];

  const filteredUsers = users.filter((user) => {
    const userRole = (user.roles?.[0] || user.role || "").toLowerCase();
    const matchesRole = activeTab === "All" || userRole === activeTab.toLowerCase();
    const matchesSearch =
      (user.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.institution?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.college?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserCog className="h-8 w-8 text-primary" />
            {isAr ? "إدارة الحسابات وتوزيع المؤسسات والكليات" : "Accounts & Academic Affiliation"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "إنشاء وإدارة حسابات الطلاب، المعلمين، والمرشدين وتعيين انتمائهم للمؤسسة التعليمية والكلية التابعة لها."
              : "Manage user accounts live from MySQL and assign each actor to their respective institution and college."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={isLoading}
            className="rounded-full text-xs font-semibold px-4 h-9 border-border bg-secondary/60 hover:bg-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isAr ? "تحديث" : "Refresh"}</span>
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold px-4 h-9 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <Plus className="mr-1.5 h-4 w-4" /> {isAr ? "إضافة مستخدم جديد" : "Add User"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card border-border text-foreground rounded-3xl">
              <DialogHeader>
                <DialogTitle>{isAr ? "إنشاء حساب مستخدم جديد" : "Create New User Account"}</DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs">
                  {isAr ? "سيتم حفظ الحساب وربطه بالمؤسسة والكلية في MySQL." : "Save user credentials and institutional affiliation directly into MySQL."}
                </DialogDescription>
              </DialogHeader>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-3.5 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-xs font-semibold">{isAr ? "الاسم الكامل" : "Full Name"}</Label>
                    <Input
                      id="name"
                      required
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-9 rounded-xl bg-secondary/60 border-border text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="role" className="text-xs font-semibold">{isAr ? "الدور / الصلاحية" : "Role"}</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="h-9 rounded-xl bg-secondary/60 border-border text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border rounded-2xl">
                        {ROLES.map((r) => (
                          <SelectItem key={r} value={r} className="text-xs font-semibold capitalize">
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs font-semibold">{isAr ? "البريد الإلكتروني" : "Email Address"}</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="user@institution.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-9 rounded-xl bg-secondary/60 border-border text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-xs font-semibold">{isAr ? "كلمة المرور" : "Password"}</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-9 rounded-xl bg-secondary/60 border-border text-xs"
                    />
                  </div>
                </div>

                {/* Educational Institution Selector */}
                <div className="space-y-1">
                  <Label htmlFor="inst-select" className="text-xs font-semibold flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-primary" />
                    <span>{isAr ? "المؤسسة التعليمية التابع لها" : "Assigned Institution"}</span>
                  </Label>
                  <Select
                    value={selectedInstitutionId}
                    onValueChange={(val) => {
                      setSelectedInstitutionId(val);
                      setSelectedCollegeId(""); // reset college when institution changes
                    }}
                  >
                    <SelectTrigger className="h-9 rounded-xl bg-secondary/60 border-border text-xs">
                      <SelectValue placeholder={isAr ? "اختر الجامعة أو المدرسة..." : "Select university or school..."} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-2xl">
                      <SelectItem value="none" className="text-xs text-muted-foreground">
                        {isAr ? "بدون مؤسسة محددة (عام)" : "None / General"}
                      </SelectItem>
                      {institutions.map((inst) => (
                        <SelectItem key={inst.id} value={String(inst.id)} className="text-xs font-semibold">
                          {inst.name} ({inst.type === 'university' ? (isAr ? 'جامعة' : 'University') : (isAr ? 'مدرسة' : 'School')})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* College / Faculty Selector (Active if University is selected) */}
                {selectedInstitutionId && selectedInstitutionId !== "none" && availableColleges.length > 0 && (
                  <div className="space-y-1 p-3 bg-primary/5 rounded-2xl border border-primary/15">
                    <Label htmlFor="college-select" className="text-xs font-semibold flex items-center gap-1.5 text-primary">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>{isAr ? "الكلية / القسم الأكاديمي" : "College / Faculty"}</span>
                    </Label>
                    <Select value={selectedCollegeId} onValueChange={setSelectedCollegeId}>
                      <SelectTrigger className="h-9 rounded-xl bg-card border-border text-xs">
                        <SelectValue placeholder={isAr ? "اختر الكلية التابع لها الطالب/المعلم..." : "Select College / Faculty..."} />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border rounded-2xl">
                        <SelectItem value="none" className="text-xs text-muted-foreground">
                          {isAr ? "الجامعة بالكامل (بدون كلية محددة)" : "Entire University"}
                        </SelectItem>
                        {availableColleges.map((col) => (
                          <SelectItem key={col.id} value={String(col.id)} className="text-xs font-semibold">
                            {col.name} {col.code ? `(${col.code})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-full text-xs font-semibold">
                    {isAr ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="rounded-full bg-primary text-primary-foreground text-xs font-bold px-5">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                    {isAr ? "إنشاء الحساب" : "Create User"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Role Tabs and Search Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="bg-card/80 border border-border p-1 rounded-2xl">
            <TabsTrigger value="All" className="rounded-xl text-xs font-semibold px-3 py-1.5">
              {isAr ? "الكل" : "All"} ({users.length})
            </TabsTrigger>
            {ROLES.map((role) => {
              const count = users.filter((u) => (u.roles?.[0] || u.role || "").toLowerCase() === role).length;
              return (
                <TabsTrigger key={role} value={role} className="rounded-xl text-xs font-semibold px-3 py-1.5 capitalize">
                  {role} ({count})
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3.5" />
          <Input
            placeholder={isAr ? "بحث بالاسم، البريد، المؤسسة..." : "Search user, institution, college..."}
            className="pl-10 rtl:pl-3 rtl:pr-10 h-10 rounded-full bg-secondary/60 border-border text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <Card className="bg-card/85 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow className="border-border">
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "المستخدم" : "User"}</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "الدور" : "Role"}</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">{isAr ? "المؤسسة والكلية" : "Institution & College"}</TableHead>
              <TableHead className="text-right rtl:text-left text-xs font-bold text-muted-foreground uppercase">{isAr ? "الإجراءات" : "Actions"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-xs text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                  {isAr ? "جارٍ جلب الحسابات من MySQL..." : "Loading accounts from MySQL..."}
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-xs text-muted-foreground">
                  <UserCog className="w-8 h-8 mx-auto mb-2 text-primary/30" />
                  {isAr ? "لا توجد حسابات مطابقة للبحث." : "No accounts match the current filter."}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const userRole = (user.roles?.[0] || user.role || "student").toLowerCase();

                // Role badge colors
                let badgeClass = "bg-primary/10 text-primary border-primary/20";
                if (userRole === "admin") badgeClass = "bg-rose-500/10 text-rose-500 border-rose-500/20";
                if (userRole === "teacher") badgeClass = "bg-amber-500/10 text-amber-500 border-amber-500/20";
                if (userRole === "advisor") badgeClass = "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
                if (userRole === "parent") badgeClass = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";

                const instName = user.institution?.name || (user as any).institution_name;
                const colName = user.college?.name;

                return (
                  <TableRow key={user.id} className="border-border hover:bg-secondary/30 transition-colors">
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-secondary border border-border flex items-center justify-center font-bold text-xs text-foreground shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-foreground">{user.name}</p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className={`rounded-full text-[10px] font-bold px-2.5 py-0.5 capitalize ${badgeClass}`}>
                        {userRole}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        {instName ? (
                          <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
                            <Building className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{instName}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground font-medium">
                            {isAr ? "غير محدد" : "Unassigned"}
                          </span>
                        )}

                        {colName && (
                          <div className="flex items-center gap-1.5 text-[11px] text-primary font-bold bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10 w-fit">
                            <GraduationCap className="w-3 h-3 text-primary shrink-0" />
                            <span>{colName}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right rtl:text-left">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteUser(user.id)}
                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
