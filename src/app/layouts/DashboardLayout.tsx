import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell, Globe, LogOut, Menu, User, Users, Building, LayoutDashboard, Settings, BookOpen, UserCheck, AlertOctagon, Sparkles, ShieldAlert, Inbox, MessageCircle, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAppStore } from "@/lib/store";

export function DashboardLayout() {
  const { i18n } = useTranslation();
  const userRole = useAppStore((state) => state.userRole);
  const setUserRole = useAppStore((state) => state.setUserRole);
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  const handleLogout = () => {
    setUserRole(null);
    navigate("/login");
  };

  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-xl border-r border-white/10 p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 bg-primary rounded-lg rotate-45 shrink-0" />
        <span className="font-bold text-lg text-white">SBA Platform</span>
      </div>
      
      <nav className="flex-1 space-y-2 mt-4">
        {userRole === "admin" && (
          <>
            <Button variant="ghost" asChild className={`w-full justify-start ${location.pathname === '/admin' ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
              <Link to="/admin">
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" asChild className={`w-full justify-start ${location.pathname.startsWith('/admin/accounts') ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
              <Link to="/admin/accounts">
                <Users className="mr-3 h-5 w-5" />
                Accounts & Permissions
              </Link>
            </Button>
            <Button variant="ghost" asChild className={`w-full justify-start ${location.pathname.startsWith('/admin/institutions') ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
              <Link to="/admin/institutions">
                <Building className="mr-3 h-5 w-5" />
                Institutions
              </Link>
            </Button>
            <Button variant="ghost" asChild className={`w-full justify-start ${location.pathname.startsWith('/admin/settings') ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
              <Link to="/admin/settings">
                <Settings className="mr-3 h-5 w-5" />
                System Settings
              </Link>
            </Button>
          </>
        )}

        {userRole === "teacher" && (
          <>
            <Button variant="ghost" asChild className={`w-full justify-start ${location.pathname === '/teacher' ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
              <Link to="/teacher">
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Classroom Dashboard
              </Link>
            </Button>
            <Button variant="ghost" asChild className={`w-full justify-start ${location.pathname.startsWith('/teacher/grades') ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
              <Link to="/teacher/grades">
                <BookOpen className="mr-3 h-5 w-5" />
                Data Entry & Grades
              </Link>
            </Button>
            <Button variant="ghost" asChild className={`w-full justify-start ${location.pathname.startsWith('/teacher/attendance') ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
              <Link to="/teacher/attendance">
                <UserCheck className="mr-3 h-5 w-5" />
                Attendance Logging
              </Link>
            </Button>
            <Button variant="ghost" asChild className={`w-full justify-start ${location.pathname.startsWith('/teacher/incidents') ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
              <Link to="/teacher/incidents">
                <AlertOctagon className="mr-3 h-5 w-5" />
                Incident Reports
              </Link>
            </Button>
            <Button variant="ghost" asChild className={`w-full justify-start ${location.pathname.startsWith('/teacher/feedback') ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
              <Link to="/teacher/feedback">
                <Sparkles className="mr-3 h-5 w-5" />
                AI Feedback Hub
              </Link>
            </Button>
          </>
        )}

        {userRole === "advisor" && (
          <>
            <Button variant="ghost" asChild className={`w-full justify-start ${location.pathname === '/advisor' ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
              <Link to="/advisor">
                <ShieldAlert className="mr-3 h-5 w-5" />
                At-Risk Roster
              </Link>
            </Button>
            <Button variant="ghost" asChild className={`w-full justify-start ${location.pathname.startsWith('/advisor/inbox') ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
              <Link to="/advisor/inbox">
                <Inbox className="mr-3 h-5 w-5" />
                Early-Alert Inbox
              </Link>
            </Button>
            <Button variant="ghost" asChild className={`w-full justify-start ${location.pathname.startsWith('/advisor/communications') ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
              <Link to="/advisor/communications">
                <MessageCircle className="mr-3 h-5 w-5" />
                Comms & AI Hub
              </Link>
            </Button>
            <Button variant="ghost" asChild className={`w-full justify-start ${location.pathname.startsWith('/advisor/analytics') ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
              <Link to="/advisor/analytics">
                <Network className="mr-3 h-5 w-5" />
                Predictive Analytics
              </Link>
            </Button>
            <Button variant="ghost" asChild className={`w-full justify-start ${location.pathname.startsWith('/advisor/student') ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
              <Link to="/advisor/student">
                <User className="mr-3 h-5 w-5" />
                Student 360 View
              </Link>
            </Button>
          </>
        )}
        {userRole === "student" && (
          <>
            <Button variant="ghost" asChild className={`w-full justify-start ${location.pathname === '/student' ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
              <Link to="/student">
                <LayoutDashboard className="mr-3 h-5 w-5" />
                My Dashboard
              </Link>
            </Button>
            <Button variant="ghost" asChild className={`w-full justify-start ${location.pathname.startsWith('/student/alerts') ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
              <Link to="/student/alerts">
                <Bell className="mr-3 h-5 w-5" />
                Alerts & Feedback
              </Link>
            </Button>
            <Button variant="ghost" asChild className={`w-full justify-start ${location.pathname.startsWith('/student/academics') ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}>
              <Link to="/student/academics">
                <BookOpen className="mr-3 h-5 w-5" />
                Academics & AI Guide
              </Link>
            </Button>
          </>
        )}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10">
        <p className="text-xs text-slate-400 px-2 capitalize">Role: {userRole}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#0B0F19] text-slate-200">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 glass z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-slate-300 hover:text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 bg-[#0B0F19] border-r-white/10 text-white w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" onClick={toggleLanguage} className="text-slate-300 hover:text-white hover:bg-white/10">
              <Globe className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-white/10 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/30">
                  <User className="h-4 w-4 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-900 border-white/10 text-slate-200" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">John Doe</p>
                    <p className="text-xs leading-none text-slate-400">john.doe@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="focus:bg-red-500/20 focus:text-red-400 cursor-pointer text-red-400" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 relative">
          {/* Subtle background glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 h-full animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
