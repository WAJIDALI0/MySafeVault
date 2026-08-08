"use client";

import { Plus, ChevronDown } from "lucide-react";

export function QuickAdd() {
  return (
    <button className="hidden sm:flex items-center gap-2 bg-[#10B981] hover:bg-[#10B981]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
      <Plus className="w-4 h-4" />
      <span>Quick Add</span>
      <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
    </button>
  );
}
