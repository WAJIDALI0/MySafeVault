"use client";

import { 
  Search, 
  Command, 
  Loader2, 
  FileText, 
  KeyRound, 
  StickyNote, 
  Fingerprint, 
  X, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  ExternalLink,
  Plus
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { searchVaultItems } from "../../actions/search.actions";
import { useRouter } from "next/navigation";

const quickNav = [
  { name: "All Vault Items", href: "/vault", icon: ShieldCheck, category: "Navigation", color: "text-emerald-500 bg-emerald-500/10" },
  { name: "Passwords", href: "/vault?category=PASSWORD", icon: KeyRound, category: "Vault", color: "text-purple-500 bg-purple-500/10" },
  { name: "Documents", href: "/vault?category=DOCUMENT", icon: FileText, category: "Vault", color: "text-blue-500 bg-blue-500/10" },
  { name: "Secure Notes", href: "/vault?category=SECURE_NOTE", icon: StickyNote, category: "Vault", color: "text-amber-500 bg-amber-500/10" },
  { name: "Digital Identity", href: "/vault?category=IDENTITY", icon: Fingerprint, category: "Vault", color: "text-cyan-500 bg-cyan-500/10" },
  { name: "Security Audit & Score", href: "/settings/security", icon: Sparkles, category: "Security", color: "text-rose-500 bg-rose-500/10" },
];

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Debounce search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      const res = await searchVaultItems(query.trim());
      if (res.success && res.data) {
        setResults(res.data);
      }
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Reset query on close
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setQuery("");
        setResults([]);
        setSelectedFilter("ALL");
      }, 150);
    }
  }, [open]);

  const filteredResults = useMemo(() => {
    if (selectedFilter === "ALL") return results;
    return results.filter((item) => item.type === selectedFilter);
  }, [results, selectedFilter]);

  const getIconForType = (type: string) => {
    switch (type) {
      case "PASSWORD":
        return <KeyRound className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case "DOCUMENT":
        return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "SECURE_NOTE":
        return <StickyNote className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case "IDENTITY":
        return <Fingerprint className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const formatted = type.replace("_", " ");
    switch (type) {
      case "PASSWORD":
        return <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-md border border-purple-200/60 dark:border-purple-800/60">{formatted}</span>;
      case "DOCUMENT":
        return <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800/60">{formatted}</span>;
      case "SECURE_NOTE":
        return <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/60">{formatted}</span>;
      case "IDENTITY":
        return <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/50 px-2 py-0.5 rounded-md border border-cyan-200/60 dark:border-cyan-800/60">{formatted}</span>;
      default:
        return <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{formatted}</span>;
    }
  };

  return (
    <>
      {/* Top Search Bar Input Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative hidden md:flex items-center w-full max-w-md cursor-pointer group text-left outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
        aria-label="Open command palette search"
      >
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors pointer-events-none" />
        <div className="w-full h-10 pl-10 pr-16 bg-slate-50/90 dark:bg-[#111827]/90 border border-slate-200/80 dark:border-slate-800 rounded-xl flex items-center text-sm font-medium text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:border-emerald-400/80 dark:group-hover:border-emerald-500/50 group-hover:bg-white dark:group-hover:bg-[#111827] shadow-2xs group-hover:shadow-sm transition-all">
          Search anything in your vault...
        </div>
        <div className="absolute right-3 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/90 dark:border-slate-700 shadow-2xs">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </button>

      {/* Mobile Search Icon Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
        aria-label="Open search"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Modern Command Palette Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className="sm:max-w-[640px] p-0 overflow-hidden bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl top-[15%] translate-y-0 gap-0 [&>button:last-child]:hidden"
        >
          <DialogTitle className="sr-only">Search Vault</DialogTitle>
          <DialogDescription className="sr-only">Search your encrypted vault items and jump to features</DialogDescription>
          
          {/* Search Header Row */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Search className="w-4 h-4" />
            </div>
            
            <input
              type="text"
              placeholder="Search passwords, documents, notes, identity..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base font-medium h-10"
              autoFocus
            />

            {isSearching && (
              <Loader2 className="w-4 h-4 text-emerald-500 animate-spin shrink-0" />
            )}

            {query && (
              <button 
                type="button"
                onClick={() => setQuery("")}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
                title="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Clean Close & ESC Indicator */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800 shrink-0">
              <button 
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <span>ESC</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills (shown when searching) */}
          {query.trim().length >= 2 && results.length > 0 && (
            <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800/60 overflow-x-auto text-xs">
              {["ALL", "PASSWORD", "DOCUMENT", "SECURE_NOTE", "IDENTITY"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedFilter === cat
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                  }`}
                >
                  {cat === "ALL" ? "All" : cat.replace("_", " ")}
                </button>
              ))}
            </div>
          )}

          {/* Results / Navigation Body */}
          <div className="max-h-[380px] overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {/* Case 1: Empty Query - Show Quick Links & Shortcuts */}
            {query.trim().length < 2 && (
              <div className="space-y-4 py-2">
                <div>
                  <div className="px-3 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Quick Navigation</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {quickNav.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            router.push(item.href);
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/60 transition-all text-left group"
                        >
                          <div className={`p-2 rounded-lg ${item.color} group-hover:scale-105 transition-transform shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {item.name}
                            </p>
                            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{item.category}</p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 px-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Keyboard Shortcuts
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                      <kbd className="font-bold font-mono">⌘</kbd> + <kbd className="font-bold font-mono">K</kbd> to open
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                      <kbd className="font-bold font-mono">ESC</kbd> to dismiss
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Case 2: Query entered but no matches found */}
            {query.trim().length >= 2 && !isSearching && filteredResults.length === 0 && (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center mb-1">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No vault items found for "{query}"</p>
                <p className="text-xs text-slate-400 max-w-xs">Try searching for a different title or select "All" category filter above.</p>
              </div>
            )}

            {/* Case 3: Matching results */}
            {filteredResults.length > 0 && (
              <div className="flex flex-col space-y-1">
                <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Results ({filteredResults.length})</span>
                  <span className="text-[11px] lowercase font-normal">click to open</span>
                </div>
                {filteredResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      router.push(`/vault?item=${item.id}`);
                    }}
                    className="flex items-center gap-3 px-3.5 py-3 w-full text-left rounded-xl hover:bg-emerald-50/50 dark:hover:bg-slate-800/60 border border-transparent hover:border-emerald-200/70 dark:hover:border-emerald-500/30 transition-all group focus:bg-emerald-50/50 dark:focus:bg-slate-800/60 outline-none"
                  >
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 group-hover:bg-white dark:group-hover:bg-[#0b1120] transition-colors border border-slate-200/60 dark:border-slate-700/60 shrink-0">
                      {getIconForType(item.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {getTypeBadge(item.type)}
                        {item.updated_at && (
                          <span className="text-[11px] text-slate-400 font-medium">
                            Updated {new Date(item.updated_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <ExternalLink className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Modal Command Palette Footer */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#080d1a] border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-semibold">MySafeVault Spotlight</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium">
              <span>Press <kbd className="font-bold font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">ESC</kbd> to exit</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

