"use client";

import { Bell, Check, Info, ShieldAlert, Clock, X, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, clearAllReadNotifications } from "@/features/notifications/actions/notification.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
}

export function NotificationButton() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; type: 'delete' | 'clear'; targetId?: string }>({ isOpen: false, type: 'clear' });
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Listen for custom event to force refresh immediately
    const handleRefresh = () => fetchNotifications();
    window.addEventListener("refresh-notifications", handleRefresh);

    // Poll every 30 seconds as a fallback to catch background updates
    const interval = setInterval(fetchNotifications, 30000);

    return () => {
      window.removeEventListener("refresh-notifications", handleRefresh);
      clearInterval(interval);
    };
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    const res = await getNotifications();
    if (!res.error) {
      setNotifications(res.data || []);
      setUnreadCount(res.unreadCount || 0);
    }
    setLoading(false);
  };

  const handleOpen = () => {
    const newOpen = !open;
    setOpen(newOpen);
    if (newOpen) {
      fetchNotifications();
    }
  };

  const handleNotificationClick = async (n: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!n.is_read) {
      await markAsRead(n.id);
      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, is_read: true } : item));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    setOpen(false);
    
    if (n.action_url) {
      router.push(n.action_url);
    }
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDialog({ isOpen: true, type: 'delete', targetId: id });
  };

  const handleClearRead = () => {
    setConfirmDialog({ isOpen: true, type: 'clear' });
  };

  const executeConfirmAction = async () => {
    if (confirmDialog.type === 'delete' && confirmDialog.targetId) {
      await deleteNotification(confirmDialog.targetId);
      setNotifications(prev => prev.filter(n => n.id !== confirmDialog.targetId));
      const notification = notifications.find(n => n.id === confirmDialog.targetId);
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } else if (confirmDialog.type === 'clear') {
      await clearAllReadNotifications();
      setNotifications(prev => prev.filter(n => !n.is_read));
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case "SECURITY": return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case "EXPIRATION": return <Clock className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={handleOpen}
        title={`Notifications: Total ${notifications.length} | Unread ${unreadCount} | Read ${notifications.length - unreadCount}`}
        className="relative p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-[4px] text-[10px] font-bold text-white border-2 border-white dark:border-[#0b1120]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in duration-150 origin-top-right overflow-hidden flex flex-col max-h-[400px]">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0b1120]">
            <div className="flex flex-col">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Notifications</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                Total: {notifications.length} • Unread: {unreadCount} • Read: {notifications.length - unreadCount}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAll}
                  className="text-[10px] text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > unreadCount && (
                <button 
                  onClick={handleClearRead}
                  className="text-[10px] text-slate-500 hover:text-red-500 font-medium transition-colors"
                >
                  Clear read
                </button>
              )}
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <Check className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">You're all caught up</p>
                <p className="text-xs text-slate-500 mt-1">No new notifications.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    onClick={(e) => handleNotificationClick(n, e)}
                    className={`group flex items-start gap-3 p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!n.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className={`mt-0.5 p-1.5 rounded-full ${!n.is_read ? 'bg-white dark:bg-slate-800 shadow-sm' : 'bg-transparent'}`}>
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!n.is_read ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        {formatRelativeTime(n.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-start gap-1">
                      {!n.is_read && (
                        <button 
                          onClick={(e) => handleMarkAsRead(n.id, e)}
                          className="p-1 text-slate-400 hover:text-blue-500 transition-colors rounded"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={(e) => handleDelete(n.id, e)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded opacity-0 group-hover:opacity-100"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0b1120] text-center">
             <Link 
               href="/notifications" 
               onClick={() => setOpen(false)}
               className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
             >
               View all notifications
             </Link>
          </div>
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
