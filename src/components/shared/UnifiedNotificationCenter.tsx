import { useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export function UnifiedNotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: "danger", title: "Risk Alert", message: "Student John Doe entered high risk tier.", time: "10m ago", read: false },
    { id: 2, type: "warning", title: "Attendance Drop", message: "Alice's attendance dropped below 80%.", time: "1h ago", read: false },
    { id: 3, type: "info", title: "System Update", message: "Scheduled maintenance tonight at 2AM.", time: "3h ago", read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hover:bg-secondary">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 bg-card border-border shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-rose-500/10 text-rose-400 border-rose-500/20">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground">
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-white/5">
              {notifications.map(notif => (
                <div key={notif.id} className={`p-4 hover:bg-secondary/50 transition-colors cursor-pointer group ${!notif.read ? 'bg-white/[0.02]' : ''}`}>
                  <div className="flex gap-3">
                    <div className="shrink-0 mt-0.5">
                      {notif.type === 'danger' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                      {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {notif.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                      {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium leading-none ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notif.title}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
                          onClick={(e) => removeNotification(notif.id, e)}
                        >
                          <X className="w-3 h-3 text-slate-500 hover:text-foreground" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{notif.message}</p>
                      <p className="text-[10px] text-slate-500">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/30 mb-3" />
              <p className="text-sm">You're all caught up!</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
