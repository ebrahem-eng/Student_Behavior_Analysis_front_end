import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Globe,
  LogOut,
  Menu,
  User,
  Users,
  Building,
  LayoutDashboard,
  Settings,
  BookOpen,
  UserCheck,
  AlertOctagon,
  Sparkles,
  ShieldAlert,
  Inbox,
  MessageCircle,
  Network,
  CalendarDays,
  Bell,
  ArrowRight,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppStore } from "@/lib/store";
import { UnifiedNotificationCenter } from "@/components/shared/UnifiedNotificationCenter";
import { ChatbotWidget } from "@/components/shared/ChatbotWidget";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandLogo } from "@/components/shared/BrandLogo";

export function DashboardLayout() {
  const { i18n } = useTranslation();
  const user = useAppStore((state) => state.user);
  const userRole = useAppStore((state) => state.userRole);
  const setUserRole = useAppStore((state) => state.setUserRole);
  const navigate = useNavigate();
  const location = useLocation();
  const isAr = i18n.language === "ar";

  const toggleLanguage = () => {
    const newLang = isAr ? "en" : "ar";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  const handleLogout = () => {
    setUserRole(null);
    navigate("/login");
  };

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case "admin": return isAr ? "مدير النظام" : "System Admin";
      case "teacher": return isAr ? "عضو هيئة التدريس" : "Faculty / Teacher";
      case "advisor": return isAr ? "المرشد الطلابي" : "Academic Advisor";
      case "student": return isAr ? "طالب" : "Student";
      case "parent": return isAr ? "ولي أمر" : "Guardian / Parent";
      default: return isAr ? "مستخدم" : "User";
    }
  };

  const navItems = {
    admin: [
      { label: isAr ? "نظرة عامة على النظام" : "System Overview", href: "/admin", icon: LayoutDashboard },
      { label: isAr ? "الحسابات والصلاحيات" : "Accounts & Permissions", href: "/admin/accounts", icon: Users },
      { label: isAr ? "المؤسسات التعليمية" : "Institutions", href: "/admin/institutions", icon: Building },
      { label: isAr ? "إعدادات النظام" : "System Settings", href: "/admin/settings", icon: Settings },
    ],
    teacher: [
      { label: isAr ? "لوحة الفصل الدراسي" : "Classroom Dashboard", href: "/teacher", icon: LayoutDashboard },
      { label: isAr ? "رصد الدرجات والتقييم" : "Grades & Evaluation", href: "/teacher/grades", icon: BookOpen },
      { label: isAr ? "سجل الحضور والغياب" : "Attendance Logging", href: "/teacher/attendance", icon: UserCheck },
      { label: isAr ? "تقارير السلوك والملاحظات" : "Incident Reports", href: "/teacher/incidents", icon: AlertOctagon },
      { label: isAr ? "مركز الرؤى الذكية" : "AI Feedback Hub", href: "/teacher/feedback", icon: Sparkles },
    ],
    advisor: [
      { label: isAr ? "قائمة الطلاب تحت المتابعة" : "At-Risk Student Roster", href: "/advisor", icon: ShieldAlert },
      { label: isAr ? "صندوق الإنذار المبكر" : "Early-Alert Inbox", href: "/advisor/inbox", icon: Inbox },
      { label: isAr ? "مركز التواصل والذكاء" : "Comms & AI Hub", href: "/advisor/communications", icon: MessageCircle },
      { label: isAr ? "التحليلات التنبؤية" : "Predictive Analytics", href: "/advisor/analytics", icon: Network },
      { label: isAr ? "الملف الشامل للطالب" : "Student 360 View", href: "/advisor/student", icon: User },
    ],
    student: [
      { label: isAr ? "لوحة الطالب" : "My Dashboard", href: "/student", icon: LayoutDashboard },
      { label: isAr ? "التنبيهات والتوجيهات" : "Alerts & Guidance", href: "/student/alerts", icon: Bell },
      { label: isAr ? "المسار الأكاديمي والذكاء" : "Academics & AI Guide", href: "/student/academics", icon: BookOpen },
      { label: isAr ? "التسجيل ومعدل الإنجاز" : "Registration & Progress", href: "/student/registration", icon: CalendarDays },
      { label: isAr ? "الإعدادات وجودة التعلم" : "Settings & Well-being", href: "/student/settings", icon: Settings },
    ],
    parent: [
      { label: isAr ? "لوحة متابعة الأسرة" : "Family Dashboard", href: "/parent", icon: Users },
      { label: isAr ? "المحادثات والتواصل" : "Communications", href: "/parent/communications", icon: MessageCircle },
      { label: isAr ? "إعدادات حساب الأسرة" : "Family Settings", href: "/parent/settings", icon: Settings },
    ],
  };

  const currentRoleNav = userRole && navItems[userRole as keyof typeof navItems] ? navItems[userRole as keyof typeof navItems] : [];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card/85 dark:bg-card/80 backdrop-blur-xl border-r border-border/80 p-5 select-none">
      {/* Brand Logo Lockup */}
      <div className="mb-6 px-1">
        <BrandLogo size="md" showSubtitle={true} to={`/${userRole || 'admin'}`} />
      </div>

      {/* Role Badge Capsule */}
      <div className="mb-6 px-3 py-2 rounded-2xl bg-secondary/60 border border-border/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-bold text-foreground">
            {getRoleLabel(userRole)}
          </span>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-card border border-border text-muted-foreground uppercase">
          {userRole}
        </span>
      </div>
      
      {/* Role-Specific Navigation Menu */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {currentRoleNav.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || (item.href !== `/${userRole}` && location.pathname.startsWith(item.href));
          return (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={`w-full justify-start rounded-full px-4 py-2.5 h-11 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/95 hover:text-primary-foreground scale-[1.01]"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
              }`}
            >
              <Link to={item.href} className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Bottom User Action & Back to Home */}
      <div className="mt-auto pt-4 border-t border-border/80 space-y-2">
        <Link
          to="/"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <span className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>{isAr ? "الرئيسية العامة" : "Landing Home"}</span>
          </span>
          <ArrowRight className="w-3 h-3 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary transition-colors duration-200">
      {/* Desktop Floating Sidebar */}
      <aside className="hidden md:block w-72 shrink-0">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Floating Glassmorphic Header */}
        <div className="p-3 sm:p-5 pb-0 z-20 sticky top-0">
          <header className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-7 max-w-[1400px] mx-auto bg-card/85 dark:bg-card/80 backdrop-blur-xl border border-border/80 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)] transition-all duration-300">
            {/* Mobile Sheet Trigger & Logo */}
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-foreground rounded-full">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={isAr ? "right" : "left"} className="p-0 bg-background border-border text-foreground w-72">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                  </SheetHeader>
                  <SidebarContent />
                </SheetContent>
              </Sheet>

              <div className="md:hidden">
                <BrandLogo size="sm" showSubtitle={false} to={`/${userRole || 'admin'}`} />
              </div>

              {/* Breadcrumb Eyebrow on Desktop */}
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  {getRoleLabel(userRole)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {isAr ? "نظام التحليل السلوكي والإنذار المبكر" : "Behavioral Intelligence Portal"}
                </span>
              </div>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <UnifiedNotificationCenter />
              <ThemeToggle className="rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary" />
              
              {/* Language Switcher Pill */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary border border-border/70 transition-all duration-200 active:scale-95"
                title={isAr ? "Switch to English" : "التبديل إلى العربية"}
              >
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span>{isAr ? "EN" : "العربية"}</span>
              </button>
              
              {/* User Profile Dropdown Pill */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 h-auto rounded-full bg-secondary/70 hover:bg-secondary border border-border/70 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : (userRole ? userRole.charAt(0).toUpperCase() : "U")}
                    </div>
                    <span className="hidden sm:inline-block text-xs font-bold text-foreground capitalize">
                      {user?.name?.split(" ")[0] || userRole || "User"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60 bg-card/95 backdrop-blur-xl border-border text-foreground rounded-2xl p-2 shadow-xl" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs font-bold leading-none text-foreground">{user?.name || `${userRole || 'User'} Portal`}</p>
                      <p className="text-[11px] leading-none text-muted-foreground truncate">{user?.email || `${userRole || 'user'}@sba-platform.edu`}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    className="focus:bg-secondary focus:text-foreground cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-2"
                    onClick={() => navigate(`/${userRole || 'admin'}/profile`)}
                  >
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span>{isAr ? "الملف الشخصي والإعدادات" : "My Profile & Settings"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    className="focus:bg-rose-500/10 focus:text-rose-500 cursor-pointer text-rose-500 rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isAr ? "تسجيل الخروج" : "Log out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
        </div>

        {/* Main Content View with Ambient Glow */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 relative">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-12 left-1/3 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[140px] pointer-events-none -z-0" />
          <div className="absolute bottom-12 right-1/4 w-[500px] h-[500px] bg-indigo-500/[0.03] rounded-full blur-[140px] pointer-events-none -z-0" />
          
          <div className="relative z-10 max-w-[1400px] mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Shared Chatbot Widget */}
      {(userRole === "student" || userRole === "advisor") && (
        <ChatbotWidget />
      )}
    </div>
  );
}
