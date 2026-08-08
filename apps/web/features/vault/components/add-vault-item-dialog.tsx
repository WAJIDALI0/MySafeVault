"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addVaultItem, updateVaultItem } from "../actions/vault.actions";
import { Loader2, Eye, EyeOff, UploadCloud, X, RefreshCw, ShieldAlert, ShieldCheck as ShieldCheckIcon } from "lucide-react";
import { VaultItemType } from "@prisma/client";
import { generateSecurePassword, getPasswordStrength } from "@/lib/password-utils";

interface AddVaultItemDialogProps {
  children: React.ReactNode;
  defaultType?: VaultItemType;
  editMode?: boolean;
  initialData?: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddVaultItemDialog({ children, defaultType = "PASSWORD", editMode = false, initialData, open: controlledOpen, onOpenChange: controlledOnOpenChange }: AddVaultItemDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  
  const setOpen = (newOpen: boolean) => {
    if (controlledOnOpenChange) {
      controlledOnOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Base State
  const [title, setTitle] = useState(initialData?.title || "");
  const [type, setType] = useState<VaultItemType>(initialData?.type || defaultType);
  const [description, setDescription] = useState(initialData?.description || "");

  // Dynamic Fields State
  const [username, setUsername] = useState(initialData?.username || "");
  const [password, setPassword] = useState(initialData?.password || "");
  const [url, setUrl] = useState(initialData?.url || "");
  const [tags, setTags] = useState(initialData?.tags || "");
  const [category, setCategory] = useState(initialData?.category || "");
  
  const [fullName, setFullName] = useState(initialData?.fullName || "");
  const [idNumber, setIdNumber] = useState(initialData?.idNumber || "");
  const [amount, setAmount] = useState(initialData?.amount || "");
  const [purchaseDate, setPurchaseDate] = useState(initialData?.purchaseDate || "");
  const [expiryDate, setExpiryDate] = useState(initialData?.expiryDate || "");
  
  // File Upload State
  const [fileBase64, setFileBase64] = useState<string | null>(initialData?.fileBase64 || null);
  const [fileName, setFileName] = useState<string | null>(initialData?.fileName || null);
  const [fileSize, setFileSize] = useState<number | null>(initialData?.fileSize || null);
  
  // Password Gen State
  const [showGen, setShowGen] = useState(false);
  const [genLength, setGenLength] = useState(20);
  const [genUpper, setGenUpper] = useState(true);
  const [genLower, setGenLower] = useState(true);
  const [genNum, setGenNum] = useState(true);
  const [genSym, setGenSym] = useState(true);
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUsername("");
    setPassword("");
    setUrl("");
    setTags("");
    setCategory("");
    setFullName("");
    setIdNumber("");
    setAmount("");
    setPurchaseDate("");
    setExpiryDate("");
    setFileBase64(null);
    setFileName(null);
    setFileSize(null);
    setShowGen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    } else {
      // Sync state with initialData when opened in edit mode
      if (editMode && initialData) {
        setTitle(initialData.title || "");
        setType(initialData.type || defaultType);
        setDescription(initialData.description || "");
        setUsername(initialData.username || "");
        setPassword(initialData.password || "");
        setUrl(initialData.url || "");
        setTags(initialData.tags || "");
        setCategory(initialData.category || "");
        setFullName(initialData.fullName || "");
        setIdNumber(initialData.idNumber || "");
        setAmount(initialData.amount || "");
        setPurchaseDate(initialData.purchaseDate || "");
        setExpiryDate(initialData.expiryDate || "");
        setFileBase64(initialData.fileBase64 || null);
        setFileName(initialData.fileName || null);
        setFileSize(initialData.fileSize || null);
      } else {
        setType(defaultType);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    startTransition(async () => {
      let dataPayload: Record<string, any> = {};

      switch (type) {
        case "PASSWORD":
          dataPayload = { username, password, url, tags };
          break;
        case "DOCUMENT":
          dataPayload = { fileName: fileName || title, fileBase64, fileSize, expiryDate };
          break;
        case "IDENTITY":
          dataPayload = { fullName, idNumber, expiryDate };
          break;
        case "RECEIPT":
        case "WARRANTY":
          dataPayload = { amount, purchaseDate, expiryDate };
          break;
        case "SECURE_NOTE":
          dataPayload = { category };
          break;
      }

      const payloadParams = {
        type,
        title,
        description,
        data: dataPayload
      };

      try {
        const result = editMode 
          ? await updateVaultItem(initialData.id, payloadParams)
          : await addVaultItem(payloadParams);

        if (result?.error) {
          setError(result.error);
        } else {
          setOpen(false);
          if (!editMode) resetForm();
        }
      } catch (err: any) {
        console.error("Submission failed:", err);
        setError("Failed to save. If you uploaded a file, it might be too large (limit: 10MB).");
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#0b1120] border-slate-800 text-white max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit Vault Item" : "Add Vault Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && <div className="text-red-500 text-sm p-2 bg-red-500/10 rounded-md">{error}</div>}
          
          <div className="space-y-2">
            <Label htmlFor="type">Item Type</Label>
            <select 
              id="type"
              value={type} 
              onChange={(e) => setType(e.target.value as VaultItemType)}
              disabled={editMode}
              className="w-full bg-[#111827] border border-slate-800 rounded-md p-2 text-sm text-white disabled:opacity-50"
            >
              <option value="PASSWORD">Password</option>
              <option value="DOCUMENT">Document</option>
              <option value="SECURE_NOTE">Secure Note</option>
              <option value="IDENTITY">Identity / Card</option>
              <option value="RECEIPT">Receipt</option>
              <option value="WARRANTY">Warranty</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Netflix, Passport..."
              required
              className="bg-[#111827] border-slate-800"
            />
          </div>

          {/* DYNAMIC FIELDS */}
          
          {type === "PASSWORD" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Username / Email</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="name@example.com"
                  className="bg-[#111827] border-slate-800"
                />
              </div>
              <div className="space-y-2 relative">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <button 
                    type="button"
                    onClick={() => setShowGen(!showGen)}
                    className="text-xs text-emerald-500 hover:text-emerald-400 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Generator
                  </button>
                </div>
                
                {showGen && (
                  <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 mb-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs text-slate-400">Length: {genLength}</Label>
                      <input 
                        type="range" min="8" max="64" 
                        value={genLength} onChange={(e) => setGenLength(parseInt(e.target.value))}
                        className="w-2/3 accent-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={genUpper} onChange={(e) => setGenUpper(e.target.checked)} className="accent-emerald-500 rounded" /> Uppercase
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={genLower} onChange={(e) => setGenLower(e.target.checked)} className="accent-emerald-500 rounded" /> Lowercase
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={genNum} onChange={(e) => setGenNum(e.target.checked)} className="accent-emerald-500 rounded" /> Numbers
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={genSym} onChange={(e) => setGenSym(e.target.checked)} className="accent-emerald-500 rounded" /> Symbols
                      </label>
                    </div>
                    <Button 
                      type="button" 
                      onClick={() => setPassword(generateSecurePassword({ length: genLength, uppercase: genUpper, lowercase: genLower, numbers: genNum, symbols: genSym }))}
                      className="w-full h-8 text-xs bg-slate-800 hover:bg-slate-700 text-white"
                    >
                      Generate & Fill
                    </Button>
                  </div>
                )}
                
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    required
                    className="bg-[#111827] border-slate-800 pr-10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {password && (
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-slate-500">Strength:</span>
                    {getPasswordStrength(password) === "Strong" && <span className="text-emerald-500 font-medium">Strong</span>}
                    {getPasswordStrength(password) === "Medium" && <span className="text-yellow-500 font-medium">Medium</span>}
                    {getPasswordStrength(password) === "Weak" && <span className="text-red-500 font-medium">Weak</span>}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <Input 
                  id="url" 
                  type="url"
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder="https://example.com"
                  className="bg-[#111827] border-slate-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input 
                  id="tags" 
                  value={tags} 
                  onChange={(e) => setTags(e.target.value)} 
                  placeholder="e.g. streaming, work, finance"
                  className="bg-[#111827] border-slate-800"
                />
              </div>
            </>
          )}

          {type === "DOCUMENT" && (
            <>
              <div className="space-y-2">
                <Label>File Upload</Label>
                {fileBase64 ? (
                  <div className="border border-slate-700 bg-[#111827] rounded-md p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-[#0b1120] rounded-lg">
                        <UploadCloud className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-200 truncate">{fileName}</span>
                        {fileSize && <span className="text-xs text-slate-500">{(fileSize / 1024 / 1024).toFixed(2)} MB</span>}
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => { setFileBase64(null); setFileName(null); setFileSize(null); }}
                      className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative border border-dashed border-slate-700 hover:border-emerald-500/50 bg-[#111827] rounded-md p-8 flex flex-col items-center justify-center text-sm text-slate-400 transition-colors cursor-pointer group">
                    <UploadCloud className="w-8 h-8 mb-3 text-slate-500 group-hover:text-emerald-500 transition-colors" />
                    <span className="font-medium text-slate-300">Click to upload a file</span>
                    <span className="text-xs mt-1">Images, PDFs, or Documents</span>
                    <input 
                      type="file" 
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiration Date (Optional)</Label>
                <Input 
                  id="expiryDate" 
                  type="date"
                  value={expiryDate} 
                  onChange={(e) => setExpiryDate(e.target.value)} 
                  className="bg-[#111827] border-slate-800"
                />
              </div>
            </>
          )}

          {type === "IDENTITY" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name on ID</Label>
                <Input 
                  id="fullName" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  placeholder="John Doe"
                  className="bg-[#111827] border-slate-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number</Label>
                <Input 
                  id="idNumber" 
                  value={idNumber} 
                  onChange={(e) => setIdNumber(e.target.value)} 
                  placeholder="A12345678"
                  className="bg-[#111827] border-slate-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input 
                  id="expiryDate" 
                  type="date"
                  value={expiryDate} 
                  onChange={(e) => setExpiryDate(e.target.value)} 
                  className="bg-[#111827] border-slate-800"
                />
              </div>
            </>
          )}

          {(type === "RECEIPT" || type === "WARRANTY") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input 
                  id="amount" 
                  type="number"
                  step="0.01"
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="99.99"
                  className="bg-[#111827] border-slate-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input 
                  id="purchaseDate" 
                  type="date"
                  value={purchaseDate} 
                  onChange={(e) => setPurchaseDate(e.target.value)} 
                  className="bg-[#111827] border-slate-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Warranty Expiry Date</Label>
                <Input 
                  id="expiryDate" 
                  type="date"
                  value={expiryDate} 
                  onChange={(e) => setExpiryDate(e.target.value)} 
                  className="bg-[#111827] border-slate-800"
                />
              </div>
            </>
          )}

          {type === "SECURE_NOTE" && (
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                placeholder="e.g. WiFi, Server Config, Network"
                className="bg-[#111827] border-slate-800"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Notes (Optional)</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Add any additional details here..."
              className="bg-[#111827] border-slate-800"
            />
          </div>
          
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-slate-800 hover:text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-[#10b981] hover:bg-[#059669] text-white">
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editMode ? "Save Changes" : "Save Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
