import { KeyRound, FileText, StickyNote, UserCircle, ShieldCheck, Star, Shield, Receipt, FileBadge2, LucideIcon } from "lucide-react";

export type VaultItemType = 'PASSWORD' | 'DOCUMENT' | 'SECURE_NOTE' | 'IDENTITY' | 'SECURITY' | 'RECEIPT' | 'WARRANTY';

export interface CategoryStyle {
  icon: LucideIcon;
  textColor: string;
  bgColor: string;
  label: string;
}

export const CATEGORY_STYLES: Record<VaultItemType | 'FAVORITE', CategoryStyle> = {
  PASSWORD: {
    icon: KeyRound,
    textColor: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    label: 'Password'
  },
  DOCUMENT: {
    icon: FileText,
    textColor: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    label: 'Document'
  },
  SECURE_NOTE: {
    icon: StickyNote,
    textColor: 'text-amber-500',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    label: 'Secure Note'
  },
  IDENTITY: {
    icon: UserCircle,
    textColor: 'text-cyan-500',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    label: 'Identity'
  },
  SECURITY: {
    icon: ShieldCheck,
    textColor: 'text-emerald-500',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    label: 'Security'
  },
  FAVORITE: {
    icon: Star,
    textColor: 'text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    label: 'Favorite'
  },
  RECEIPT: {
    icon: Receipt,
    textColor: 'text-teal-500',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
    label: 'Receipt'
  },
  WARRANTY: {
    icon: FileBadge2,
    textColor: 'text-indigo-500',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    label: 'Warranty'
  }
};

export function getCategoryStyle(type: string): CategoryStyle {
  const style = CATEGORY_STYLES[type as VaultItemType];
  if (style) return style;
  
  // Fallback for unknown types
  return {
    icon: Shield,
    textColor: 'text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-900',
    label: 'Item'
  };
}
