"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Key,
  FileText,
  CreditCard,
  UserCheck,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Edit3,
  Calendar,
  Globe,
  Lock,
  Wifi,
  Cpu,
} from "lucide-react";
import { DecryptedPrivateItem } from "../hooks/use-private-vault";
import { getPasswordStrength } from "@/lib/password-utils";

interface PrivateVaultItemViewDialogProps {
  item: DecryptedPrivateItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (item: DecryptedPrivateItem) => void;
  onDelete: (id: string) => Promise<void>;
}

export function PrivateVaultItemViewDialog({
  item,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: PrivateVaultItemViewDialogProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!item) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleReveal = (fieldName: string) => {
    const next = new Set(revealedSecrets);
    if (next.has(fieldName)) next.delete(fieldName);
    else next.add(fieldName);
    setRevealedSecrets(next);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(item.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to delete private item:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const isRevealed = (field: string) => revealedSecrets.has(field);
  const data = item.data || {};
  const isSeed = item.category === "note" && data.noteSubtype === "CRYPTO_SEED";
  const isApiKey = item.category === "note" && data.noteSubtype === "API_KEY";
  const seedWords = isSeed
    ? (data.seedPhraseRaw || "").trim().split(/\s+/).filter(Boolean)
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                {item.category === "password" ? (
                  <Key className="w-5 h-5" />
                ) : item.category === "card" ? (
                  <CreditCard className="w-5 h-5" />
                ) : item.category === "identity" ? (
                  <UserCheck className="w-5 h-5" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white truncate">
                  {item.title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
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
                  <span className="text-[11px] text-slate-400">
                    Local Zero-Knowledge Encrypted
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* ============================================================= */}
          {/* 1. PAYMENT CARD VISUAL VIEW                                   */}
          {/* ============================================================= */}
          {item.category === "card" && (
            <div className="space-y-3">
              {/* Virtual Payment Card Mockup */}
              <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-950 text-white border border-emerald-500/30 shadow-xl">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between relative z-10 mb-6">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-7 h-7 text-amber-300" />
                    <Wifi className="w-4 h-4 text-slate-400 rotate-90" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-400 font-mono">
                    {data.cardBrand || "CREDIT CARD"}
                  </span>
                </div>

                {/* Card Number */}
                <div className="relative z-10 mb-5">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    Card Number
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base sm:text-lg tracking-widest font-semibold">
                      {isRevealed("cardNumber")
                        ? data.cardNumber || "•••• •••• •••• ••••"
                        : data.cardNumber
                        ? `•••• •••• •••• ${data.cardNumber.slice(-4)}`
                        : "•••• •••• •••• ••••"}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleReveal("cardNumber")}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                        title={isRevealed("cardNumber") ? "Hide card number" : "Reveal card number"}
                      >
                        {isRevealed("cardNumber") ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            (data.cardNumber || "").replace(/\s/g, ""),
                            "cardNumber"
                          )
                        }
                        className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg transition-colors"
                        title="Copy Card Number"
                      >
                        {copiedField === "cardNumber" ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cardholder & Expiry Row */}
                <div className="flex items-end justify-between relative z-10 text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Cardholder</span>
                    <span className="font-bold tracking-wide uppercase">
                      {data.cardholderName || "VALUED CARDHOLDER"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 uppercase block">Expires</span>
                    <span className="font-bold">
                      {data.cardExpMonth && data.cardExpYear
                        ? `${data.cardExpMonth} / ${data.cardExpYear}`
                        : "MM / YY"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Extra Card Details (CVV, PIN, Billing Zip) */}
              <div className="grid grid-cols-3 gap-2">
                {/* CVV */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                    Security Code
                  </span>
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-mono text-sm font-bold">
                      {isRevealed("cardCvv") ? data.cardCvv || "---" : "•••"}
                    </span>
                    {data.cardCvv && (
                      <button
                        type="button"
                        onClick={() => toggleReveal("cardCvv")}
                        className="p-0.5 text-slate-400 hover:text-slate-600"
                      >
                        {isRevealed("cardCvv") ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* PIN */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                    Card PIN
                  </span>
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-mono text-sm font-bold">
                      {isRevealed("cardPin") ? data.cardPin || "---" : "••••"}
                    </span>
                    {data.cardPin && (
                      <button
                        type="button"
                        onClick={() => toggleReveal("cardPin")}
                        className="p-0.5 text-slate-400 hover:text-slate-600"
                      >
                        {isRevealed("cardPin") ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Billing Zip */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                    Postal Code
                  </span>
                  <span className="font-mono text-sm font-bold">
                    {data.billingZip || "---"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* 2. PASSWORD / LOGIN VIEW                                      */}
          {/* ============================================================= */}
          {item.category === "password" && (
            <div className="space-y-3">
              {/* Website URL */}
              {data.url && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                      Service URL
                    </span>
                    <span className="text-xs font-mono text-slate-800 dark:text-slate-200 truncate block">
                      {data.url}
                    </span>
                  </div>
                  <a
                    href={data.url.startsWith("http") ? data.url : `https://${data.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg flex items-center gap-1 text-xs font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Visit
                  </a>
                </div>
              )}

              {/* Username */}
              {data.username && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                      Username / Email
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200 truncate block">
                      {data.username}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(data.username, "username")}
                    className="h-7 px-2 text-xs font-semibold text-slate-500 hover:text-emerald-500"
                  >
                    {copiedField === "username" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              )}

              {/* Password */}
              {data.password && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Secret Password
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500">
                      {getPasswordStrength(data.password)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {isRevealed("password") ? data.password : "••••••••••••••••"}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReveal("password")}
                        className="h-7 px-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {isRevealed("password") ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(data.password, "password")}
                        className="h-7 px-2 text-slate-400 hover:text-emerald-500"
                      >
                        {copiedField === "password" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* TOTP / 2FA Key */}
              {data.totpSecret && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                      2FA / TOTP Secret Key
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200 truncate block">
                      {isRevealed("totp") ? data.totpSecret : "••••••••••••"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleReveal("totp")}
                      className="h-7 px-2 text-slate-400"
                    >
                      {isRevealed("totp") ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(data.totpSecret, "totp")}
                      className="h-7 px-2 text-slate-400 hover:text-emerald-500"
                    >
                      {copiedField === "totp" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================= */}
          {/* 3. SECURE NOTE / CRYPTO SEED / API KEY VIEW                   */}
          {/* ============================================================= */}
          {item.category === "note" && (
            <div className="space-y-3">
              {/* Subtype A: Crypto Seed Phrase */}
              {isSeed ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-emerald-500" />
                      {seedWords.length}-Word Recovery Phrase
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(data.seedPhraseRaw || "", "allSeed")}
                      className="h-7 text-xs border-slate-200 dark:border-slate-700 gap-1 rounded-lg"
                    >
                      {copiedField === "allSeed" ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      Copy All Words
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    {seedWords.map((word: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-mono text-xs"
                      >
                        <span className="text-emerald-500 font-bold select-none text-[11px]">
                          {idx + 1}.
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {isRevealed("seedPhrase") ? word : "••••"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => toggleReveal("seedPhrase")}
                      className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-semibold"
                    >
                      {isRevealed("seedPhrase") ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {isRevealed("seedPhrase") ? "Mask Words" : "Reveal All Words"}
                    </button>

                    {data.seedPassphrase && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        Has optional 25th word passphrase
                      </span>
                    )}
                  </div>
                </div>
              ) : isApiKey ? (
                /* Subtype B: API Key */
                <div className="space-y-2.5">
                  {data.apiKeyService && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Service / Provider
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {data.apiKeyService}
                      </span>
                    </div>
                  )}

                  {data.apiSecretKey && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Secret API Key
                        </span>
                        <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white truncate block">
                          {isRevealed("apiKey") ? data.apiSecretKey : "sk-••••••••••••••••"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReveal("apiKey")}
                          className="h-7 px-2 text-slate-400"
                        >
                          {isRevealed("apiKey") ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(data.apiSecretKey, "apiKey")}
                          className="h-7 px-2 text-slate-400 hover:text-emerald-500"
                        >
                          {copiedField === "apiKey" ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Subtype C: Freeform Secret Note */
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Secret Note Content
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(data.noteBody || data.notes || "", "noteBody")
                      }
                      className="h-7 px-2 text-xs text-slate-500 hover:text-emerald-500 gap-1"
                    >
                      {copiedField === "noteBody" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      Copy Note
                    </Button>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                    {data.noteBody || data.notes || "No content recorded."}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================= */}
          {/* 4. DIGITAL IDENTITY / DOCUMENTS VIEW                          */}
          {/* ============================================================= */}
          {item.category === "identity" && (
            <div className="space-y-3">
              {/* Identity Document Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {data.identityType ? data.identityType.replace(/_/g, " ") : "Identity Document"}
                  </span>
                  {data.issuingCountry && (
                    <span className="text-xs text-slate-500 font-medium">
                      {data.issuingCountry}
                    </span>
                  )}
                </div>

                {data.fullName && (
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Full Legal Name
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {data.fullName}
                    </span>
                  </div>
                )}

                {data.idNumber && (
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Document / Registration Number
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {isRevealed("idNumber") ? data.idNumber : "••••••••••••"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReveal("idNumber")}
                        className="h-7 px-2 text-slate-400"
                      >
                        {isRevealed("idNumber") ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(data.idNumber, "idNumber")}
                        className="h-7 px-2 text-slate-400 hover:text-emerald-500"
                      >
                        {copiedField === "idNumber" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Date of Birth
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {data.dateOfBirth || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Expiration Date
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {data.expiryDate || "No expiration"}
                    </span>
                  </div>
                </div>

                {data.address && (
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Registered Address
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {data.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Common Confidential Notes (if not freeform note body) */}
          {data.notes && item.category !== "note" && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Confidential Notes
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap font-mono">
                {data.notes}
              </p>
            </div>
          )}

          <div className="text-[11px] text-slate-400 pt-1">
            Last modified on {new Date(item.updatedAt).toLocaleString()}
          </div>
        </div>

        {/* Delete Confirmation Warning */}
        {showDeleteConfirm && (
          <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 space-y-2">
            <p className="font-bold">
              Are you sure you want to permanently delete "{item.title}"?
            </p>
            <p className="text-[11px] text-red-600 dark:text-red-400">
              This will remove the encrypted blob from your local browser IndexedDB immediately.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="h-7 text-xs border-red-300 dark:border-red-800"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isDeleting}
                onClick={handleDelete}
                className="h-7 text-xs bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Permanently"}
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="pt-2 gap-2 flex-col sm:flex-row justify-between">
          <div>
            {!showDeleteConfirm && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs border-slate-200 dark:border-slate-700"
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onEdit(item);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1 rounded-xl shadow-md shadow-emerald-600/20"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Item
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
