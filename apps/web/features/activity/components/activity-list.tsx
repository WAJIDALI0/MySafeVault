"use client";

import { useEffect, useState } from 'react';
import { getActivities } from '../actions/activity.actions';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Fingerprint, FileText, KeyRound, StickyNote, LogIn, LogOut, Shield, Pencil, Trash } from 'lucide-react';

const filters = ['All', 'Vault', 'Passwords', 'Documents', 'Notes', 'Identity', 'Security', 'Account'];

function getActivityConfig(action: string, metadata: any = {}) {
  const noun = metadata?.title || metadata?.itemId || "Item";

  switch (action) {
    case "login": return { verb: "Logged", noun: "In", icon: LogIn, color: "text-emerald-500", bg: "bg-emerald-500/10" };
    case "logout": return { verb: "Logged", noun: "Out", icon: LogOut, color: "text-slate-500", bg: "bg-slate-500/10" };
    case "create_password": return { verb: "Added", noun, icon: KeyRound, color: "text-purple-500", bg: "bg-purple-500/10" };
    case "create_document": return { verb: "Uploaded", noun, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" };
    case "create_secure_note": return { verb: "Added", noun, icon: StickyNote, color: "text-amber-500", bg: "bg-amber-500/10" };
    case "create_identity": return { verb: "Added", noun, icon: Fingerprint, color: "text-pink-500", bg: "bg-pink-500/10" };
    case "create_receipt":
    case "create_warranty": return { verb: "Saved", noun, icon: FileText, color: "text-teal-500", bg: "bg-teal-500/10" };
    case "update_item": return { verb: "Updated", noun, icon: Pencil, color: "text-blue-500", bg: "bg-blue-500/10" }; 
    case "delete_item": return { verb: "Deleted", noun: "an item", icon: Trash, color: "text-red-500", bg: "bg-red-500/10" };
    case "view_item": return { verb: "Viewed", noun, icon: Shield, color: "text-purple-500", bg: "bg-purple-500/10" };
    default: return { verb: "Performed", noun: action, icon: Fingerprint, color: "text-slate-500", bg: "bg-slate-500/10" };
  }
}

export function ActivityList() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);

  const fetchActivities = async (filter: string, cursor?: string, isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await getActivities(filter, cursor, 20);
      if (!res.error && res.data) {
        if (isLoadMore) {
          setActivities(prev => [...prev, ...res.data]);
        } else {
          setActivities(res.data);
        }
        setNextCursor(res.nextCursor);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchActivities(activeFilter);
  }, [activeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-primary-500">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Fingerprint className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No activity yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2">
              Your vault activity will appear here as you create, view, update, and manage items.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {activities.map(activity => {
              const config = getActivityConfig(activity.action, activity.metadata);
              const Icon = config.icon;
              return (
                <div key={activity.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <div className="flex gap-4 items-center">
                    <div className={`p-3 rounded-xl ${config.bg} ${config.color} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {config.verb} <span className="font-normal text-slate-500 dark:text-slate-400">{config.noun}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {nextCursor && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => fetchActivities(activeFilter, nextCursor, true)}
            disabled={loadingMore}
            className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors flex items-center gap-2"
          >
            {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
