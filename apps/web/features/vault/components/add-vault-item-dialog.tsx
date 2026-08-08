"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addVaultItem, updateVaultItem } from "../actions/vault.actions";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { VaultItemType } from "@prisma/client";

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
  const [fullName, setFullName] = useState(initialData?.fullName || "");
  const [idNumber, setIdNumber] = useState(initialData?.idNumber || "");
  const [amount, setAmount] = useState(initialData?.amount || "");
  const [purchaseDate, setPurchaseDate] = useState(initialData?.purchaseDate || "");
  const [expiryDate, setExpiryDate] = useState(initialData?.expiryDate || "");
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUsername("");
    setPassword("");
    setUrl("");
    setFullName("");
    setIdNumber("");
    setAmount("");
    setPurchaseDate("");
    setExpiryDate("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    } else {
      setType(defaultType);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    startTransition(async () => {
      let dataPayload: Record<string, any> = {};

      switch (type) {
        case "PASSWORD":
          dataPayload = { username, password, url };
          break;
        case "DOCUMENT":
          dataPayload = { fileName: title }; // Mock upload for now
          break;
        case "IDENTITY":
          dataPayload = { fullName, idNumber, expiryDate };
          break;
        case "RECEIPT":
        case "WARRANTY":
          dataPayload = { amount, purchaseDate, expiryDate };
          break;
        case "SECURE_NOTE":
          dataPayload = {};
          break;
      }

      const payloadParams = {
        type,
        title,
        description,
        data: dataPayload
      };

      const result = editMode 
        ? await updateVaultItem(initialData.id, payloadParams)
        : await addVaultItem(payloadParams);

      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        if (!editMode) resetForm();
      }
    });
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
                <Label htmlFor="password">Password</Label>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Website URL (Optional)</Label>
                <Input 
                  id="url" 
                  type="url"
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder="https://example.com"
                  className="bg-[#111827] border-slate-800"
                />
              </div>
            </>
          )}

          {type === "DOCUMENT" && (
            <div className="space-y-2">
              <Label>File Upload</Label>
              <div className="border border-dashed border-slate-700 bg-[#111827] rounded-md p-6 flex items-center justify-center text-sm text-slate-400">
                Mock File Upload (UI Only)
              </div>
            </div>
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
