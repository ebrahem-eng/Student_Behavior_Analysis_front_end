import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Bell, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/lib/store";
import { echo } from "@/lib/echo";

interface NotificationItem {
  id: number | string;
  type: "danger" | "warning" | "info" | "success";
  title: string;
  title_ar?: string;
  message: string;
  message_ar?: string;
  time: string;
  read: boolean;
}

export function UnifiedNotificationCenter() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const user = useAppStore((state) => state.user);

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      type: "danger",
      title: "Risk Tier Alert",
      title_ar: "إنذار دخول مرحلة الخطر",
      message: "Student Eva Green flagged with critical attendance drop (-35%).",
      message_ar: "تم رصد انخفاض حاد في حضور الطالبة إيفا جرين (-35%).",
      time: "5m ago",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      title: "Midterm Grade Dip",
      title_ar: "انخفاض درجات منتصف الفصل",
      message: "Calculus II class average is 8% below previous term baseline.",
      message_ar: "متوسط درجات شعبة التفاضل 2 أقل بـ 8% عن الفصل السابق.",
      time: "45m ago",
      read: false,
    },
    {
      id: 3,
      type: "success",
      title: "Intervention Completed",
      title_ar: "اكتمال خطة التدخل",
      message: "Advisor Marcus scheduled a study support session for David Miller.",
      message_ar: "تمت جدولة جلسة دعم أكاديمي بنجاح للطالب ديفيد ميلر.",
      time: "2h ago",
      read: true,
    },
  ]);

  // Subscribe to real-time Laravel Echo channels
  useEffect(() => {
    if (!echo) return;

    try {
      // Public / Broadcast alerts channel
      const alertChannel = echo.channel("alerts");
      alertChannel.listen(".new_alert", (event: any) => {
        const newNotif: NotificationItem = {
          id: event.id || Date.now(),
          type: event.severity || "warning",
          title: event.title || "New System Alert",
          message: event.message || "An early warning alert was generated.",
          time: "Just now",
          read: false,
        };
        setNotifications((prev) => [newNotif, ...prev]);
      });

      // Private user channel if user is authenticated
      if (user?.id) {
        const userChannel = echo.private(`user.${user.id}`);
        userChannel.listen(".user_notification", (event: any) => {
          const userNotif: NotificationItem = {
            id: event.id || Date.now(),
            type: event.type || "info",
            title: event.title || "Personal Notification",
            message: event.message,
            time: "Just now",
            read: false,
          };
          setNotifications((prev) => [userNotif, ...prev]);
        });
      }
    } catch (e) {
      console.warn("Laravel Echo subscription note:", e);
    }

    return () => {
      try {
        echo.leaveChannel("alerts");
        if (user?.id) echo.leaveChannel(`user.${user.id}`);
      } catch (e) {}
    };
  }, [user?.id]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: number | string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/70 h-9 w-9"
          title={isAr ? "مركز الإشعارات والتنبيهات" : "Notifications Center"}
        >
          <Bell className="w-4 h-4 text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 rtl:right-auto rtl:left-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={isAr ? "start" : "end"}
        className="w-80 sm:w-96 p-0 bg-card/95 backdrop-blur-2xl border border-border/80 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/70 bg-secondary/40">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-xs text-foreground uppercase tracking-wide">
              {isAr ? "مركز الإشعارات الحية" : "Live Alert Feed"}
            </h3>
            {unreadCount > 0 ? (
              <Badge variant="secondary" className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount} {isAr ? "جديد" : "New"}
              </Badge>
            ) : (
              <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{isAr ? "مكتمل" : "All Clear"}</span>
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllRead}
              className="h-7 px-2.5 text-[11px] font-semibold text-primary hover:text-primary rounded-full hover:bg-primary/10"
            >
              {isAr ? "تحديد الكل كمقروء" : "Mark all read"}
            </Button>
          )}
        </div>

        {/* List */}
        <ScrollArea className="max-h-[340px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-border/60">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-secondary/50 transition-colors cursor-pointer group flex items-start gap-3 ${
                    !notif.read ? "bg-primary/[0.03]" : ""
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {notif.type === "danger" && (
                      <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    )}
                    {notif.type === "warning" && (
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    )}
                    {notif.type === "info" && (
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
                        <Info className="w-4 h-4" />
                      </div>
                    )}
                    {notif.type === "success" && (
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs font-bold leading-snug truncate ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {isAr ? (notif.title_ar || notif.title) : notif.title}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
                        onClick={(e) => removeNotification(notif.id, e)}
                      >
                        <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isAr ? (notif.message_ar || notif.message) : notif.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/40" />
              <p className="text-xs font-semibold">{isAr ? "لا توجد إشعارات جديدة حالياً." : "No new notifications."}</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
