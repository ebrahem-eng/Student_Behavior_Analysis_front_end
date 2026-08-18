import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Bell, CheckCircle2, AlertTriangle, Info, X, Loader2, RefreshCw } from "lucide-react";
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
import { api } from "@/lib/api";

export interface NotificationItem {
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
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Fetch real notifications and alerts from backend
  const fetchLiveNotifications = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // 1. Fetch user notifications
      const notifRes = await api.get('/notifications').catch(() => ({ data: { data: [] } }));
      const rawNotifs = Array.isArray(notifRes.data) 
        ? notifRes.data 
        : (notifRes.data?.data || []);

      // 2. Fetch user alerts
      const alertRes = await api.get('/alerts').catch(() => ({ data: [] }));
      const rawAlerts = Array.isArray(alertRes.data)
        ? alertRes.data
        : (alertRes.data?.data || []);

      const formattedNotifs: NotificationItem[] = [
        ...rawNotifs.map((n: any) => ({
          id: `notif-${n.id}`,
          type: (n.data?.severity || n.type || "info") as any,
          title: n.data?.title || n.title || "Notification",
          message: n.data?.message || n.message || "",
          time: n.created_at ? formatTimeAgo(n.created_at, isAr) : "Recently",
          read: Boolean(n.read_at),
        })),
        ...rawAlerts.map((a: any) => ({
          id: `alert-${a.id}`,
          type: (a.level === "high" || a.level === "critical" || a.severity === "danger" ? "danger" : "warning") as any,
          title: a.title || "System Alert",
          message: a.message || a.description || "",
          time: a.created_at ? formatTimeAgo(a.created_at, isAr) : "Recently",
          read: Boolean(a.is_read),
        })),
      ];

      setNotifications(formattedNotifs);
    } catch (err) {
      console.warn("[Notifications] Could not fetch real notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user, isAr]);

  useEffect(() => {
    fetchLiveNotifications();
  }, [fetchLiveNotifications]);

  // Real-time WebSocket Listeners
  useEffect(() => {
    if (!echo) return;

    try {
      const alertChannel = echo.channel("alerts");
      alertChannel.listen(".new_alert", (event: any) => {
        const newNotif: NotificationItem = {
          id: `live-${event.id || Date.now()}`,
          type: event.severity || "warning",
          title: event.title || "New System Alert",
          message: event.message || "An early warning alert was generated.",
          time: isAr ? "الآن" : "Just now",
          read: false,
        };
        setNotifications((prev) => [newNotif, ...prev]);
      });

      if (user?.id) {
        const userChannel = echo.private(`user.${user.id}`);
        userChannel.listen(".user_notification", (event: any) => {
          const userNotif: NotificationItem = {
            id: `live-user-${event.id || Date.now()}`,
            type: event.type || "info",
            title: event.title || "Personal Notification",
            message: event.message,
            time: isAr ? "الآن" : "Just now",
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
  }, [user?.id, isAr]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.post('/notifications/read-all');
    } catch (e) {
      console.warn("Error marking all read:", e);
    }
  };

  const markSingleAsRead = async (id: number | string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    try {
      const strId = String(id);
      if (strId.startsWith('notif-')) {
        await api.patch(`/notifications/${strId.replace('notif-', '')}/read`);
      } else if (strId.startsWith('alert-')) {
        await api.patch(`/alerts/${strId.replace('alert-', '')}/read`);
      }
    } catch (e) {
      // ignore
    }
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
              {isAr ? "مركز الإشعارات والتنبيهات" : "Live Alert Feed"}
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
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchLiveNotifications}
              disabled={isLoading}
              className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground"
              title={isAr ? "تحديث الإشعارات" : "Refresh"}
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllRead}
                className="h-6 px-2 text-[10px] font-semibold text-primary hover:text-primary rounded-full hover:bg-primary/10"
              >
                {isAr ? "تحديد الكل كمقروء" : "Mark all read"}
              </Button>
            )}
          </div>
        </div>

        {/* List */}
        <ScrollArea className="max-h-[340px]">
          {isLoading && notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground space-y-2">
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" />
              <p className="text-xs">{isAr ? "جارٍ جلب التنبيهات من الخادم..." : "Fetching live alerts..."}</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-border/60">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markSingleAsRead(notif.id)}
                  className={`p-4 hover:bg-secondary/50 transition-colors cursor-pointer group flex items-start gap-3 ${
                    !notif.read ? "bg-primary/[0.03]" : "opacity-75"
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
              <p className="text-xs font-semibold">{isAr ? "لا توجد إشعارات حالياً في قاعدة البيانات." : "No notifications in database."}</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

function formatTimeAgo(dateString: string, isAr: boolean): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return isAr ? "الآن" : "Just now";
    if (diffMinutes < 60) return isAr ? `منذ ${diffMinutes} دقيقة` : `${diffMinutes}m ago`;
    if (diffHours < 24) return isAr ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    if (diffDays === 1) return isAr ? "أمس" : "Yesterday";
    return isAr ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
  } catch (e) {
    return dateString;
  }
}
