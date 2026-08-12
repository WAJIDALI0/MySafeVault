"use client";

import { Search, Command, Loader2, FileText, KeyRound, StickyNote, Fingerprint } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { searchVaultItems } from "../../actions/search.actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  
  // Keyboard shortcut listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Debounce logic
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      const res = await searchVaultItems(query);
      if (res.success && res.data) {
        setResults(res.data);
      }
      setIsSearching(false);
    }, 350); // 350ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle open state change safely (reset state on close)
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setQuery("");
        setResults([]);
      }, 200);
    }
  }, [open]);

  const getIconForType = (type: string) => {
    switch (type) {
      case "PASSWORD": return <KeyRound className="w-4 h-4 text-purple-500" />;
      case "DOCUMENT": return <FileText className="w-4 h-4 text-blue-500" />;
      case "SECURE_NOTE": return <StickyNote className="w-4 h-4 text-amber-500" />;
      case "IDENTITY": return <Fingerprint className="w-4 h-4 text-pink-500" />;
      default: return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <>
      <div 
        className="relative hidden md:flex items-center w-full max-w-md cursor-text"
        onClick={() => setOpen(true)}
      >
        <Search className="absolute left-3 w-4 h-4 text-slate-400" />
        <div className="w-full h-10 pl-10 pr-12 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg flex items-center text-sm text-slate-400 hover:border-slate-700 transition-colors">
          Search anything in your vault...
        </div>
        <div className="absolute right-3 flex items-center gap-1 text-[10px] text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white dark:bg-[#0b1120] border-slate-200 dark:border-slate-800 top-[20%] translate-y-0 gap-0">
          {/* We must include a visually hidden title for accessibility in Dialog */}
          <DialogTitle className="sr-only">Search Vault</DialogTitle>
          <DialogDescription className="sr-only">Search your secure items by title</DialogDescription>
          
          <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input
              type="text"
              placeholder="Search by title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-500 text-base h-10"
              autoFocus
            />
            {isSearching && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
            <button 
              onClick={() => setOpen(false)}
              className="ml-2 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded border border-slate-200 dark:border-slate-700"
            >
              ESC
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
            {query.length < 2 && (
              <div className="py-10 text-center text-sm text-slate-500">
                Type at least 2 characters to search...
              </div>
            )}

            {query.length >= 2 && !isSearching && results.length === 0 && (
              <div className="py-10 text-center text-sm text-slate-500 flex flex-col items-center gap-2">
                <Search className="w-8 h-8 text-slate-700" />
                <p>No results found for "{query}"</p>
                <p className="text-xs text-slate-600">Try checking your spelling or using a broader term.</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="flex flex-col">
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Matches
                </div>
                {results.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setOpen(false);
                      router.push(`/vault?item=${item.id}`);
                    }}
                    className="flex items-center gap-3 px-3 py-3 w-full text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group focus:bg-slate-100 dark:focus:bg-slate-800/50 outline-none"
                  >
                    <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800/80 group-hover:bg-white dark:group-hover:bg-[#0b1120] transition-colors">
                      {getIconForType(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">{item.title}</p>
                      <p className="text-xs text-slate-500 truncate">{item.type.replace('_', ' ')}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
