"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Key,
  FileText,
  CreditCard,
  UserCheck,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Hash,
  Globe,
  Lock,
} from "lucide-react";
import { DecryptedPrivateItem } from "../hooks/use-private-vault";
import { generateSecurePassword, getPasswordStrength } from "@/lib/password-utils";

interface PrivateVaultItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: DecryptedPrivateItem["category"];
  editItem?: DecryptedPrivateItem | null;
  onSave: (
    title: string,
    category: DecryptedPrivateItem["category"],
    data: Record<string, any>,
    id?: string
  ) => Promise<void>;
}

export function PrivateVaultItemDialog({
  open,
  onOpenChange,
  defaultCategory = "password",
  editItem = null,
  onSave,
}: PrivateVaultItemDialogProps) {
  // Category state
  const [category, setCategory] = useState<DecryptedPrivateItem["category"]>(
    editItem?.category || defaultCategory
  );

  // Common fields
  const [title, setTitle] = useState(editItem?.title || "");
  const [notes, setNotes] = useState(editItem?.data?.notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // 1. Password Category Fields
  const [websiteUrl, setWebsiteUrl] = useState(editItem?.data?.url || "");
  const [username, setUsername] = useState(editItem?.data?.username || "");
  const [password, setPassword] = useState(editItem?.data?.password || "");
  const [totpSecret, setTotpSecret] = useState(editItem?.data?.totpSecret || "");
  const [showPassword, setShowPassword] = useState(false);

  // Password Generator State
  const [showGen, setShowGen] = useState(false);
  const [genLength, setGenLength] = useState(20);
  const [genUpper, setGenUpper] = useState(true);
  const [genLower, setGenLower] = useState(true);
  const [genNum, setGenNum] = useState(true);
  const [genSym, setGenSym] = useState(true);

  // 2. Note Category Fields
  const [noteSubtype, setNoteSubtype] = useState<"FREEFORM" | "CRYPTO_SEED" | "API_KEY">(
    editItem?.data?.noteSubtype || "FREEFORM"
  );
  const [noteBody, setNoteBody] = useState(editItem?.data?.noteBody || "");
  const [seedWordsCount, setSeedWordsCount] = useState<12 | 24>(
    editItem?.data?.seedWordsCount || 12
  );
  const [seedPhraseRaw, setSeedPhraseRaw] = useState(editItem?.data?.seedPhraseRaw || "");
  const [seedPassphrase, setSeedPassphrase] = useState(editItem?.data?.seedPassphrase || "");
  const [apiKeyService, setApiKeyService] = useState(editItem?.data?.apiKeyService || "");
  const [apiSecretKey, setApiSecretKey] = useState(editItem?.data?.apiSecretKey || "");
  const [apiPublicKey, setApiPublicKey] = useState(editItem?.data?.apiPublicKey || "");
  const [showApiSecret, setShowApiSecret] = useState(false);

  // 3. Payment Card Category Fields
  const [cardholderName, setCardholderName] = useState(editItem?.data?.cardholderName || "");
  const [cardNumber, setCardNumber] = useState(editItem?.data?.cardNumber || "");
  const [cardBrand, setCardBrand] = useState(editItem?.data?.cardBrand || "visa");
  const [cardExpMonth, setCardExpMonth] = useState(editItem?.data?.cardExpMonth || "");
  const [cardExpYear, setCardExpYear] = useState(editItem?.data?.cardExpYear || "");
  const [cardCvv, setCardCvv] = useState(editItem?.data?.cardCvv || "");
  const [cardPin, setCardPin] = useState(editItem?.data?.cardPin || "");
  const [billingZip, setBillingZip] = useState(editItem?.data?.billingZip || "");
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCardCvv, setShowCardCvv] = useState(false);
  const [showCardPin, setShowCardPin] = useState(false);

  // 4. Digital Identity Fields
  const [fullName, setFullName] = useState(editItem?.data?.fullName || "");
  const [identityType, setIdentityType] = useState(
    editItem?.data?.identityType || "passport"
  );
  const [idNumber, setIdNumber] = useState(editItem?.data?.idNumber || "");
  const [issuingCountry, setIssuingCountry] = useState(editItem?.data?.issuingCountry || "");
  const [dateOfBirth, setDateOfBirth] = useState(editItem?.data?.dateOfBirth || "");
  const [expiryDate, setExpiryDate] = useState(editItem?.data?.expiryDate || "");
  const [address, setAddress] = useState(editItem?.data?.address || "");
  const [showIdNumber, setShowIdNumber] = useState(false);

  // Synchronize state when dialog opens or editItem changes
  useEffect(() => {
    if (open) {
      if (editItem) {
        setTitle(editItem.title || "");
        setCategory(editItem.category);
        setNotes(editItem.data?.notes || "");

        // Password fields
        setWebsiteUrl(editItem.data?.url || "");
        setUsername(editItem.data?.username || "");
        setPassword(editItem.data?.password || "");
        setTotpSecret(editItem.data?.totpSecret || "");

        // Note fields
        setNoteSubtype(editItem.data?.noteSubtype || "FREEFORM");
        setNoteBody(editItem.data?.noteBody || editItem.data?.notes || "");
        setSeedWordsCount(editItem.data?.seedWordsCount || 12);
        setSeedPhraseRaw(editItem.data?.seedPhraseRaw || "");
        setSeedPassphrase(editItem.data?.seedPassphrase || "");
        setApiKeyService(editItem.data?.apiKeyService || "");
        setApiSecretKey(editItem.data?.apiSecretKey || "");
        setApiPublicKey(editItem.data?.apiPublicKey || "");

        // Card fields
        setCardholderName(editItem.data?.cardholderName || "");
        setCardNumber(editItem.data?.cardNumber || "");
        setCardBrand(editItem.data?.cardBrand || "visa");
        setCardExpMonth(editItem.data?.cardExpMonth || "");
        setCardExpYear(editItem.data?.cardExpYear || "");
        setCardCvv(editItem.data?.cardCvv || "");
        setCardPin(editItem.data?.cardPin || "");
        setBillingZip(editItem.data?.billingZip || "");

        // Identity fields
        setFullName(editItem.data?.fullName || "");
        setIdentityType(editItem.data?.identityType || "passport");
        setIdNumber(editItem.data?.idNumber || "");
        setIssuingCountry(editItem.data?.issuingCountry || "");
        setDateOfBirth(editItem.data?.dateOfBirth || "");
        setExpiryDate(editItem.data?.expiryDate || "");
        setAddress(editItem.data?.address || "");
      } else {
        // Reset to new item defaults
        setCategory(defaultCategory);
        setTitle("");
        setNotes("");
        setWebsiteUrl("");
        setUsername("");
        setPassword("");
        setTotpSecret("");
        setNoteSubtype("FREEFORM");
        setNoteBody("");
        setSeedPhraseRaw("");
        setSeedPassphrase("");
        setApiKeyService("");
        setApiSecretKey("");
        setApiPublicKey("");
        setCardholderName("");
        setCardNumber("");
        setCardBrand("visa");
        setCardExpMonth("");
        setCardExpYear("");
        setCardCvv("");
        setCardPin("");
        setBillingZip("");
        setFullName("");
        setIdentityType("passport");
        setIdNumber("");
        setIssuingCountry("");
        setDateOfBirth("");
        setExpiryDate("");
        setAddress("");
      }
      setShowGen(false);
      setShowPassword(false);
      setShowCardNumber(false);
      setShowCardCvv(false);
      setShowCardPin(false);
      setShowIdNumber(false);
      setShowApiSecret(false);
    }
  }, [open, editItem, defaultCategory]);

  // Auto-detect Card Brand & format card number with spaces
  const handleCardNumberChange = (raw: string) => {
    const clean = raw.replace(/\D/g, "").slice(0, 19);
    const spaced = clean.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(spaced);

    // Basic auto brand detection
    if (clean.startsWith("4")) setCardBrand("visa");
    else if (/^5[1-5]/.test(clean)) setCardBrand("mastercard");
    else if (/^3[47]/.test(clean)) setCardBrand("amex");
    else if (/^6(?:011|5)/.test(clean)) setCardBrand("discover");
  };

  const handleGeneratePassword = () => {
    const newPass = generateSecurePassword({
      length: genLength,
      uppercase: genUpper,
      lowercase: genLower,
      numbers: genNum,
      symbols: genSym,
    });
    setPassword(newPass);
    setShowPassword(true);
  };

  const copyToClipboard = (val: string, fieldName: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      let dataPayload: Record<string, any> = { notes };

      if (category === "password") {
        dataPayload = {
          ...dataPayload,
          url: websiteUrl,
          username,
          password,
          totpSecret,
        };
      } else if (category === "note") {
        dataPayload = {
          ...dataPayload,
          noteSubtype,
          noteBody,
          seedWordsCount,
          seedPhraseRaw,
          seedPassphrase,
          apiKeyService,
          apiSecretKey,
          apiPublicKey,
        };
      } else if (category === "card") {
        dataPayload = {
          ...dataPayload,
          cardholderName,
          cardNumber,
          cardBrand,
          cardExpMonth,
          cardExpYear,
          cardCvv,
          cardPin,
          billingZip,
        };
      } else if (category === "identity") {
        dataPayload = {
          ...dataPayload,
          fullName,
          identityType,
          idNumber,
          issuingCountry,
          dateOfBirth,
          expiryDate,
          address,
        };
      }

      await onSave(title.trim(), category, dataPayload, editItem?.id);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to save private vault item:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Seed phrase parser for previewing numbered words
  const parsedSeedWords = seedPhraseRaw
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const passwordStrength = getPasswordStrength(password);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                {editItem ? "Edit Private Item" : "New Private Item"}
              </DialogTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Encrypted locally with AES-256-GCM. Stored strictly in browser IndexedDB.
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Category Selector Tabs */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Select Category
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                {
                  id: "password",
                  label: "Password",
                  icon: Key,
                  desc: "Logins & Credentials",
                },
                {
                  id: "note",
                  label: "Secure Note",
                  icon: FileText,
                  desc: "Seeds & Secret Notes",
                },
                {
                  id: "card",
                  label: "Payment Card",
                  icon: CreditCard,
                  desc: "Credit / Debit Cards",
                },
                {
                  id: "identity",
                  label: "Identity",
                  icon: UserCheck,
                  desc: "Passports & IDs",
                },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = category === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as any)}
                    className={`flex flex-col items-start p-2.5 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? "text-emerald-500" : "text-slate-400"}`} />
                    <span className="text-xs font-bold">{item.label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight">
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Item Title */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Title <span className="text-emerald-500">*</span>
            </Label>
            <Input
              placeholder={
                category === "password"
                  ? "e.g. Personal Gmail, AWS Console, Binance"
                  : category === "note"
                  ? "e.g. Ledger 24-Word Recovery Phrase, Root Keys"
                  : category === "card"
                  ? "e.g. Chase Sapphire Reserve, Wise Corporate Card"
                  : "e.g. Official US Passport, State Driver's License"
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-10"
            />
          </div>

          {/* ================================================================= */}
          {/* CATEGORY 1: PASSWORD / LOGIN FIELDS                               */}
          {/* ================================================================= */}
          {category === "password" && (
            <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-200 dark:border-slate-800">
                <Key className="w-3.5 h-3.5 text-emerald-500" />
                Login & Authentication Details
              </div>

              {/* Website URL */}
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span>Website URL (Optional)</span>
                  {websiteUrl && (
                    <a
                      href={websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-500 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Visit
                    </a>
                  )}
                </Label>
                <Input
                  placeholder="https://example.com/login"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9"
                />
              </div>

              {/* Username / Email */}
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-600 dark:text-slate-400">
                  Username or Email
                </Label>
                <Input
                  placeholder="e.g. wajid@gmail.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Password / Secret Key
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowGen(!showGen)}
                    className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    {showGen ? "Hide Generator" : "Generate Strong Password"}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter confidential password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs pr-20 h-9 font-mono"
                  />
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    {password && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(password, "password")}
                        className="p-1 text-slate-400 hover:text-emerald-500"
                        title="Copy password"
                      >
                        {copiedField === "password" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {password && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          passwordStrength === "Strong"
                            ? "w-full bg-emerald-500"
                            : passwordStrength === "Medium"
                            ? "w-2/3 bg-amber-500"
                            : "w-1/3 bg-red-500"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-semibold ${
                        passwordStrength === "Strong"
                          ? "text-emerald-500"
                          : passwordStrength === "Medium"
                          ? "text-amber-500"
                          : "text-red-500"
                      }`}
                    >
                      {passwordStrength}
                    </span>
                  </div>
                )}
              </div>

              {/* Inline Password Generator */}
              {showGen && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Length: {genLength} characters
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleGeneratePassword}
                      className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Regenerate
                    </Button>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="48"
                    value={genLength}
                    onChange={(e) => setGenLength(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={genUpper}
                        onChange={(e) => setGenUpper(e.target.checked)}
                        className="rounded accent-emerald-500"
                      />
                      Uppercase (A-Z)
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={genLower}
                        onChange={(e) => setGenLower(e.target.checked)}
                        className="rounded accent-emerald-500"
                      />
                      Lowercase (a-z)
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={genNum}
                        onChange={(e) => setGenNum(e.target.checked)}
                        className="rounded accent-emerald-500"
                      />
                      Numbers (0-9)
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={genSym}
                        onChange={(e) => setGenSym(e.target.checked)}
                        className="rounded accent-emerald-500"
                      />
                      Symbols (!@#$)
                    </label>
                  </div>
                </div>
              )}

              {/* 2FA / TOTP Authenticator Key */}
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-600 dark:text-slate-400">
                  2FA / TOTP Authenticator Key (Optional)
                </Label>
                <Input
                  placeholder="e.g. JBSWY3DPEHPK3PXP"
                  value={totpSecret}
                  onChange={(e) => setTotpSecret(e.target.value)}
                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9 font-mono"
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* CATEGORY 2: SECURE NOTE / CRYPTO SEED / API KEY                   */}
          {/* ================================================================= */}
          {category === "note" && (
            <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  Confidential Secret Format
                </div>
                <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-lg text-[10px]">
                  <button
                    type="button"
                    onClick={() => setNoteSubtype("FREEFORM")}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                      noteSubtype === "FREEFORM"
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteSubtype("CRYPTO_SEED")}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                      noteSubtype === "CRYPTO_SEED"
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Crypto Seed
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteSubtype("API_KEY")}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                      noteSubtype === "API_KEY"
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    API Key
                  </button>
                </div>
              </div>

              {/* Subtype A: Freeform Secure Note */}
              {noteSubtype === "FREEFORM" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-600 dark:text-slate-400">
                      Confidential Secret Content
                    </Label>
                    <span className="text-[10px] text-slate-400">
                      {noteBody.length} characters
                    </span>
                  </div>
                  <Textarea
                    placeholder="Write your secret notes, confidential instructions, or recovery codes here..."
                    value={noteBody}
                    onChange={(e) => setNoteBody(e.target.value)}
                    rows={6}
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>
              )}

              {/* Subtype B: Crypto Seed Phrase (12 or 24 words) */}
              {noteSubtype === "CRYPTO_SEED" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <Label className="text-xs text-slate-600 dark:text-slate-400">
                      Seed Phrase Length
                    </Label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSeedWordsCount(12)}
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border transition-all ${
                          seedWordsCount === 12
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                            : "border-slate-300 dark:border-slate-700 text-slate-400"
                        }`}
                      >
                        12 Words
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeedWordsCount(24)}
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border transition-all ${
                          seedWordsCount === 24
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                            : "border-slate-300 dark:border-slate-700 text-slate-400"
                        }`}
                      >
                        24 Words
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-600 dark:text-slate-400">
                      Paste or Type Words (separated by spaces)
                    </Label>
                    <Textarea
                      placeholder="abandon ability able about above absent absorb abstract absurd abuse access accident..."
                      value={seedPhraseRaw}
                      onChange={(e) => setSeedPhraseRaw(e.target.value)}
                      rows={3}
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>

                  {parsedSeedWords.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Numbered Word Chips:</span>
                        <span className={parsedSeedWords.length === seedWordsCount ? "text-emerald-500 font-bold" : "text-amber-500"}>
                          {parsedSeedWords.length} / {seedWordsCount} words detected
                        </span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        {parsedSeedWords.map((word: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300"
                          >
                            <span className="text-[10px] text-emerald-500 font-bold select-none">
                              {idx + 1}.
                            </span>
                            <span className="truncate">{word}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-600 dark:text-slate-400">
                      Optional Passphrase (BIP-39 25th word / extension)
                    </Label>
                    <Input
                      type="password"
                      placeholder="Optional extra passphrase"
                      value={seedPassphrase}
                      onChange={(e) => setSeedPassphrase(e.target.value)}
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Subtype C: API Key */}
              {noteSubtype === "API_KEY" && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-600 dark:text-slate-400">
                      Service / Provider Name
                    </Label>
                    <Input
                      placeholder="e.g. OpenAI, AWS IAM, Stripe Secret"
                      value={apiKeyService}
                      onChange={(e) => setApiKeyService(e.target.value)}
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-slate-600 dark:text-slate-400">
                        Secret API Key / Token
                      </Label>
                      <button
                        type="button"
                        onClick={() => setShowApiSecret(!showApiSecret)}
                        className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                      >
                        {showApiSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {showApiSecret ? "Mask" : "Reveal"}
                      </button>
                    </div>
                    <Input
                      type={showApiSecret ? "text" : "password"}
                      placeholder="sk-live-..."
                      value={apiSecretKey}
                      onChange={(e) => setApiSecretKey(e.target.value)}
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-600 dark:text-slate-400">
                      Public / Client Key (Optional)
                    </Label>
                    <Input
                      placeholder="pk_live-..."
                      value={apiPublicKey}
                      onChange={(e) => setApiPublicKey(e.target.value)}
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* CATEGORY 3: PAYMENT / CREDIT / DEBIT CARD                         */}
          {/* ================================================================= */}
          {category === "card" && (
            <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                  Card & Banking Details
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {cardBrand}
                </span>
              </div>

              {/* Cardholder Name */}
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-600 dark:text-slate-400">
                  Cardholder Full Name
                </Label>
                <Input
                  placeholder="e.g. Wajid Ali"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9 uppercase"
                />
              </div>

              {/* Card Number */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Card Number
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowCardNumber(!showCardNumber)}
                    className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                  >
                    {showCardNumber ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showCardNumber ? "Mask" : "Reveal"}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showCardNumber ? "text" : "password"}
                    placeholder="4532 1234 5678 9010"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9 font-mono pr-12"
                  />
                  {cardNumber && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(cardNumber.replace(/\s/g, ""), "cardNumber")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-500"
                      title="Copy Card Number"
                    >
                      {copiedField === "cardNumber" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Expiration, CVV, Card PIN in 3-column row */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* Expiry Month / Year */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Expiry (MM / YY)
                  </Label>
                  <div className="flex items-center gap-1">
                    <Input
                      placeholder="MM"
                      maxLength={2}
                      value={cardExpMonth}
                      onChange={(e) => setCardExpMonth(e.target.value.replace(/\D/g, "").slice(0, 2))}
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9 text-center font-mono"
                    />
                    <span className="text-slate-400 font-mono">/</span>
                    <Input
                      placeholder="YY"
                      maxLength={2}
                      value={cardExpYear}
                      onChange={(e) => setCardExpYear(e.target.value.replace(/\D/g, "").slice(0, 2))}
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9 text-center font-mono"
                    />
                  </div>
                </div>

                {/* CVV */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-600 dark:text-slate-400">
                      CVV / CVC
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowCardCvv(!showCardCvv)}
                      className="text-[10px] text-slate-400"
                    >
                      {showCardCvv ? "Hide" : "Show"}
                    </button>
                  </div>
                  <Input
                    type={showCardCvv ? "text" : "password"}
                    placeholder="123"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9 text-center font-mono"
                  />
                </div>

                {/* Card PIN */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-600 dark:text-slate-400">
                      ATM PIN
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowCardPin(!showCardPin)}
                      className="text-[10px] text-slate-400"
                    >
                      {showCardPin ? "Hide" : "Show"}
                    </button>
                  </div>
                  <Input
                    type={showCardPin ? "text" : "password"}
                    placeholder="••••"
                    maxLength={6}
                    value={cardPin}
                    onChange={(e) => setCardPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9 text-center font-mono"
                  />
                </div>
              </div>

              {/* Card Brand & Billing Zip */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Card Network / Brand
                  </Label>
                  <select
                    value={cardBrand}
                    onChange={(e) => setCardBrand(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white h-9"
                  >
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                    <option value="discover">Discover</option>
                    <option value="unionpay">UnionPay</option>
                    <option value="other">Other / Custom</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Billing Zip / Postal Code
                  </Label>
                  <Input
                    placeholder="e.g. 10001"
                    value={billingZip}
                    onChange={(e) => setBillingZip(e.target.value)}
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* CATEGORY 4: DIGITAL IDENTITY / DOCUMENTS                          */}
          {/* ================================================================= */}
          {category === "identity" && (
            <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-200 dark:border-slate-800">
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                Legal Document & Identity Attributes
              </div>

              {/* Document Type & Full Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Document Type
                  </Label>
                  <select
                    value={identityType}
                    onChange={(e) => setIdentityType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white h-9"
                  >
                    <option value="passport">Passport</option>
                    <option value="driver_license">Driver's License</option>
                    <option value="national_id">National ID Card (CNIC / Citizen)</option>
                    <option value="ssn">Social Security Number (SSN)</option>
                    <option value="tax_id">Tax ID / EIN</option>
                    <option value="residence_permit">Residence Permit / Green Card</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Full Legal Name
                  </Label>
                  <Input
                    placeholder="As shown on official document"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9"
                  />
                </div>
              </div>

              {/* ID / Document Number */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Document / Registration Number
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowIdNumber(!showIdNumber)}
                    className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                  >
                    {showIdNumber ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showIdNumber ? "Mask" : "Reveal"}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showIdNumber ? "text" : "password"}
                    placeholder="e.g. A12345678 or 000-00-0000"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9 font-mono pr-12"
                  />
                  {idNumber && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(idNumber, "idNumber")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-500"
                      title="Copy ID Number"
                    >
                      {copiedField === "idNumber" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Issuing Authority & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Issuing Country / State
                  </Label>
                  <Input
                    placeholder="e.g. United States, PK, UK"
                    value={issuingCountry}
                    onChange={(e) => setIssuingCountry(e.target.value)}
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Date of Birth (Optional)
                  </Label>
                  <Input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Expiration Date (Optional)
                  </Label>
                  <Input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9"
                  />
                </div>
              </div>

              {/* Registered Address */}
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-600 dark:text-slate-400">
                  Registered Address (Optional)
                </Label>
                <Input
                  placeholder="Official address listed on document"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl text-xs h-9"
                />
              </div>
            </div>
          )}

          {/* Common Confidential Notes (Optional) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Confidential Notes <span className="text-slate-400 font-normal">(Optional)</span>
            </Label>
            <Textarea
              placeholder="Additional secret instructions, security questions, or backup notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-200 dark:border-slate-700 text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20"
            >
              {isSubmitting ? "Encrypting & Storing..." : editItem ? "Update Private Item" : "Save to Private Vault"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
