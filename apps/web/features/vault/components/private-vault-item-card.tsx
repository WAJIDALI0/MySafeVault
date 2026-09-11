"use client";

import {
  Key,
  CreditCard,
  UserCheck,
  FileText,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Cpu,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DecryptedPrivateItem } from "../types/private-vault.types";

interface PrivateVaultItemCardProps {
  item: DecryptedPrivateItem;
  isRevealed: boolean;
  isCopied: boolean;
  onView: (item: DecryptedPrivateItem) => void;
  onToggleReveal: (id: string) => void;
  onCopy: (text: string, id: string) => void;
  onDelete: (id: string) => void;
}

export function PrivateVaultItemCard({
  item,
  isRevealed,
  isCopied,
  onView,
  onToggleReveal,
  onCopy,
  onDelete,
}: PrivateVaultItemCardProps) {
  const data = item.data || {};
  const isSeed = item.category === "note" && data.noteSubtype === "CRYPTO_SEED";
  const isApiKey = item.category === "note" && data.noteSubtype === "API_KEY";

  return (
    <div
      onClick={() => onView(item)}
      className="group relative rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-3 cursor-pointer"
    >
      <div>
        {/* Card Header with Icon & Category Badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              {item.category === "password" ? (
                <Key className="w-4 h-4" />
              ) : item.category === "card" ? (
                <CreditCard className="w-4 h-4" />
              ) : item.category === "identity" ? (
                <UserCheck className="w-4 h-4" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
            </div>
            <div className="truncate">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {item.title}
              </h4>
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                {item.category === "card"
                  ? `${data.cardBrand || "Card"}`
                  : item.category === "note"
                  ? isSeed
                    ? "Crypto Seed"
                    : isApiKey
                    ? "API Key"
                    : "Secure Note"
                  : item.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg"
              title="Delete Item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 1. PASSWORD CATEGORY PREVIEW */}
        {item.category === "password" && (
          <div className="space-y-1.5 pt-1">
            {data.username && (
              <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400">User:</span>
                <span className="font-mono font-medium truncate max-w-[180px]">
                  {data.username}
                </span>
              </div>
            )}

            {data.password && (
              <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400">Secret:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs">
                    {isRevealed ? data.password : "••••••••••••"}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleReveal(item.id);
                    }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  >
                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            {data.url && (
              <div className="text-[11px] text-slate-400 truncate flex items-center gap-1 pt-0.5">
                <ExternalLink className="w-3 h-3 text-slate-400" />
                <span className="truncate">{data.url.replace(/^https?:\/\//, "")}</span>
              </div>
            )}
          </div>
        )}

        {/* 2. PAYMENT CARD CATEGORY PREVIEW */}
        {item.category === "card" && (
          <div className="space-y-2 pt-1">
            <div className="p-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-mono text-xs flex items-center justify-between border border-slate-700/60">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="tracking-widest">
                  {isRevealed
                    ? data.cardNumber || "•••• •••• •••• ••••"
                    : data.cardNumber
                    ? `•••• •••• •••• ${data.cardNumber.slice(-4)}`
                    : "•••• •••• •••• ••••"}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleReveal(item.id);
                }}
                className="text-slate-400 hover:text-white"
              >
                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="truncate max-w-[150px] uppercase font-semibold">
                {data.cardholderName || "CARDHOLDER"}
              </span>
              <span>
                {data.cardExpMonth && data.cardExpYear
                  ? `${data.cardExpMonth}/${data.cardExpYear}`
                  : "MM/YY"}
              </span>
            </div>
          </div>
        )}

        {/* 3. SECURE NOTE / SEED / API KEY PREVIEW */}
        {item.category === "note" && (
          <div className="pt-1">
            {isSeed ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Crypto Mnemonic Seed</span>
                  <span className="font-mono">
                    {(data.seedPhraseRaw || "").trim().split(/\s+/).filter(Boolean).length} Words
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 font-mono text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {isRevealed
                    ? data.seedPhraseRaw
                    : "•••••••• •••••••• •••••••• •••••••• •••••••• ••••••••"}
                </div>
              </div>
            ) : isApiKey ? (
              <div className="space-y-1.5">
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Service: {data.apiKeyService || "API Key"}</span>
                  <span className="font-mono text-emerald-500">Active</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 font-mono text-xs text-slate-700 dark:text-slate-300 truncate">
                  {isRevealed ? data.apiSecretKey : "sk-••••••••••••••••••••••••"}
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 font-mono text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                {data.noteBody || data.notes || "Empty note"}
              </div>
            )}
          </div>
        )}

        {/* 4. DIGITAL IDENTITY PREVIEW */}
        {item.category === "identity" && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-400">Name:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                {data.fullName || "---"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-400">Number:</span>
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                {isRevealed ? data.idNumber : "••••••••••••"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer with Quick Copy Action */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <span className="text-[10px] text-slate-400">
          Updated {new Date(item.updatedAt).toLocaleDateString()}
        </span>

        <div className="flex items-center gap-1">
          {item.category === "password" && data.password && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCopy(data.password, item.id);
              }}
              className="h-7 px-2 text-[11px] font-semibold gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy Password
                </>
              )}
            </Button>
          )}

          {item.category === "card" && data.cardNumber && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCopy(data.cardNumber.replace(/\s/g, ""), item.id);
              }}
              className="h-7 px-2 text-[11px] font-semibold gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy Card
                </>
              )}
            </Button>
          )}

          {item.category === "note" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCopy(
                  data.seedPhraseRaw || data.apiSecretKey || data.noteBody || data.notes || "",
                  item.id
                );
              }}
              className="h-7 px-2 text-[11px] font-semibold gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy Secret
                </>
              )}
            </Button>
          )}

          {item.category === "identity" && data.idNumber && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCopy(data.idNumber, item.id);
              }}
              className="h-7 px-2 text-[11px] font-semibold gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy ID
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
