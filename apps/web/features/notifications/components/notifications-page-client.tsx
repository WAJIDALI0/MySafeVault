"use client";

import { useEffect, useState } from "react";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, clearAllReadNotifications } from "../../notifications/actions/notification.actions";
import { formatDistanceToNow } from "date-fns";
import { Bell, ShieldAlert, Key, Loader2, CheckCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function NotificationsPageClient() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; type: 'delete' | 'clear'; targetId?: string }>({ isOpen: false, type: 'clear' });
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    const res = await getNotifications();
    if (!res.error) {
      setNotifications(res.data || []);
    }
    setLoading(false);
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await markAllAsRead();
  };

  const handleClearRead = () => {
    setConfirmDialog({ isOpen: true, type: 'clear' });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDialog({ isOpen: true, type: 'delete', targetId: id });
  };

  const executeConfirmAction = async () => {
    if (confirmDialog.type === 'delete' && confirmDialog.targetId) {
      await deleteNotification(confirmDialog.targetId);
      setNotifications((prev) => prev.filter((n) => n.id !== confirmDialog.targetId));
    } else if (confirmDialog.type === 'clear') {
      await clearAllReadNotifications();
      setNotifications((prev) => prev.filter((n) => !n.is_read));
    }
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.is_read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
      await markAsRead(notification.id);
    }

    if (notification.action_url) {
      router.push(notification.action_url);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "SECURITY": return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case "EXPIRATION": return <Key className="w-5 h-5 text-amber-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden min-h-[400px]">
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            Notifications 
            {unreadCount > 0 && (
              <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Total: {notifications.length} • Unread: {unreadCount} • Read: {notifications.length - unreadCount}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
          {notifications.length > unreadCount && (
            <button
              onClick={handleClearRead}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear read
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-lg font-medium text-slate-900 dark:text-white">You're all caught up</p>
          <p className="text-slate-500 text-sm mt-1">No new notifications.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleNotificationClick(notification);
                }
              }}
              className={`group w-full text-left p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-4 items-center cursor-pointer ${
                !notification.is_read ? "bg-slate-50/50 dark:bg-slate-800/20" : ""
              }`}
            >
              <div className="mt-1 bg-white dark:bg-slate-950 p-2 rounded-full shadow-sm shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm ${
                    !notification.is_read
                      ? "font-semibold text-slate-900 dark:text-white"
                      : "font-medium text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {notification.title}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </p>
              </div>
              <div className="shrink-0 flex items-center justify-center gap-3">
                {!notification.is_read && (
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                )}
                <button
                  onClick={(e) => handleDelete(notification.id, e)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={executeConfirmAction}
        title={confirmDialog.type === 'delete' ? "Delete Notification" : "Clear Read Notifications"}
        description={confirmDialog.type === 'delete' ? "Are you sure you want to delete this notification? This action cannot be undone." : "Are you sure you want to clear all read notifications? This action cannot be undone."}
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
