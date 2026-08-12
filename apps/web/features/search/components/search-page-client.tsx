"use client";

import { Search, Loader2, FileText, KeyRound, StickyNote, Fingerprint } from "lucide-react";
import { useState, useEffect } from "react";
import { searchVaultItems } from "../../dashboard/actions/search.actions";
import Link from "next/link";

export function SearchPageClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsSearching(false);
      setSearched(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      const res = await searchVaultItems(query);
      if (res.success && res.data) {
        setResults(res.data);
      }
      setIsSearching(false);
      setSearched(true);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const getIconForType = (type: string) => {
    switch (type) {
      case "PASSWORD": return <KeyRound className="w-5 h-5 text-purple-500" />;
      case "DOCUMENT": return <FileText className="w-5 h-5 text-blue-500" />;
      case "SECURE_NOTE": return <StickyNote className="w-5 h-5 text-amber-500" />;
      case "IDENTITY": return <Fingerprint className="w-5 h-5 text-pink-500" />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
        <input
          type="text"
          placeholder="Search items by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-14 pl-14 pr-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center text-lg text-slate-900 dark:text-white placeholder:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
          autoFocus
        />
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden min-h-[400px]">
        {query.length < 2 && (
          <div className="p-12 text-center flex flex-col items-center justify-center h-[400px] opacity-60">
            <Search className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Global Vault Search</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
              Start typing to securely search your vault metadata. Note that sensitive payloads are never decrypted during search.
            </p>
          </div>
        )}

        {searched && !isSearching && results.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center justify-center h-[400px]">
            <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No results found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              We couldn't find any items matching "{query}".
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {results.map((item) => (
              <Link
                key={item.id}
                href={`/vault?item=${item.id}`}
                className="flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                <div className="flex gap-4 items-center">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                    {getIconForType(item.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 capitalize">{item.type.replace('_', ' ').toLowerCase()}</p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
                    View Item
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
