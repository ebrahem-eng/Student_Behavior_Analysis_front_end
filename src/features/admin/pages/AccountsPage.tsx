import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, UserCog, Loader2, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { User } from "@/types/api";

const ROLES = ["admin", "teacher", "student", "advisor", "parent"];

export default function AccountsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [users, setUsers] = useState<User[]>([]);
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

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/users');
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setUsers(data);
    } catch (e) {
      console.warn('[Accounts] Error loading users:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      await api.post('/admin/users', {
        name,
        email,
        password,
        password_confirmation: password,
        role: selectedRole,
      });
      setIsDialogOpen(false);
      setName("");
      setEmail("");
      loadUsers();
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
      loadUsers();
    } catch (err) {
      alert(getApiErrorMessage(err, isAr));
    }
  };

  const filteredUsers = users.filter((user) => {
    const userRole = (user.roles?.[0] || user.role || "").toLowerCase();
    const matchesRole = activeTab === "All" || userRole === activeTab.toLowerCase();
    const matchesSearch =
      (user.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserCog className="h-8 w-8 text-primary" />
            {isAr ? "إدارة الحسابات والمستخدمين" : "Accounts & Access Control"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isAr
              ? "استعراض وإدارة جميع الحسابات المسجلة في قاعدة بيانات MySQL وتعيين أدوارهم وصلاحياتهم."
              : "Manage all user accounts live from your MySQL database and configure role permissions."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadUsers}
            disabled={isLoading}
            className="rounded-full text-xs font-semibold px-4 h-9 border-border bg-secondary/60 hover:bg-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isAr ? "تحديث" : "Refresh"}</span>
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-foreground text-xs font-bold px-4 h-9 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <Plus className="mr-2 h-4 w-4" /> {isAr ? "إضافة مستخدم جديد" : "Add User"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] bg-card border-border text-foreground rounded-3xl">
              <DialogHeader>
                <DialogTitle>{isAr ? "إنشاء حساب مستخدم جديد" : "Create New User"}</DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs">
                  {isAr ? "سيتم حفظ الحساب مباشرة في جدول users في قاعدة بيانات MySQL." : "The new user will be saved directly into your MySQL users table."}
                </DialogDescription>
              </DialogHeader>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold">{isAr ? "الاسم الكامل" : "Full Name"}</Label>
                  <Input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Dr. Ahmed Hassan"
                    className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">{isAr ? "البريد الإلكتروني" : "Email Address"}</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@sba-platform.edu"
                    className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-xs font-semibold">{isAr ? "الدور الأكاديمي" : "Role"}</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="h-10 rounded-xl bg-secondary/60 border-border text-xs">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="admin">System Admin</SelectItem>
                      <SelectItem value="teacher">Teacher / Faculty</SelectItem>
                      <SelectItem value="advisor">Academic Advisor</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="parent">Parent / Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pwd" className="text-xs font-semibold">{isAr ? "كلمة المرور الافتراضية" : "Password"}</Label>
                  <Input
                    id="pwd"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 rounded-xl bg-secondary/60 border-border text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-full text-xs"
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-primary text-primary-foreground text-xs font-bold"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (isAr ? "حفظ الحساب" : "Save User")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-card/85 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-border">
        <Tabs defaultValue="All" onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="bg-secondary/50 rounded-full p-1 border border-border">
              <TabsTrigger value="All" className="rounded-full text-xs font-semibold">{isAr ? "الكل" : "All Users"}</TabsTrigger>
              {ROLES.map((role) => (
                <TabsTrigger key={role} value={role} className="rounded-full text-xs font-semibold capitalize">
                  {role}s
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isAr ? "بحث بالاسم أو البريد..." : "Search users..."}
                className="pl-9 h-9 rounded-full bg-secondary/60 border-border text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border overflow-hidden bg-card/40">
            <Table>
              <TableHeader className="bg-secondary/40">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-semibold text-xs">{isAr ? "الاسم" : "Name"}</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-xs">{isAr ? "البريد الإلكتروني" : "Email"}</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-xs">{isAr ? "الدور" : "Role"}</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-xs">{isAr ? "تاريخ الإنشاء" : "Created"}</TableHead>
                  <TableHead className="text-right text-muted-foreground font-semibold text-xs">{isAr ? "الإجراءات" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-xs">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                      {isAr ? "جارٍ جلب المستخدمين من MySQL..." : "Loading users from MySQL..."}
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-xs">
                      {isAr ? "لم يتم العثور على أي مستخدمين مسجلين." : "No registered users found in MySQL."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const roleName = user.roles?.[0] || user.role || "student";
                    return (
                      <TableRow key={user.id} className="border-border hover:bg-secondary/40 transition-colors">
                        <TableCell className="font-semibold text-foreground text-xs">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground text-xs font-mono">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="rounded-full capitalize bg-primary/10 text-primary border-primary/20 text-[11px]">
                            {roleName}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Active"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-full h-8 px-2.5"
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
          </div>
        </Tabs>
      </div>
    </div>
  );
}
