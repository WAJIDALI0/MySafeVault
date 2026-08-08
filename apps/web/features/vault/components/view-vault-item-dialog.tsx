"use client";

import { useState, useTransition, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Copy, Check, Eye, EyeOff, ShieldCheck, ExternalLink } from "lucide-react";
import { getVaultItemData, deleteVaultItem } from "../actions/vault.actions";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { AddVaultItemDialog } from "./add-vault-item-dialog";

interface ViewVaultItemDialogProps {
  itemId: string;
  itemTitle: string;
  itemType: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewVaultItemDialog({ itemId, itemTitle, itemType, open, onOpenChange }: ViewVaultItemDialogProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (open && itemId) {
      setLoading(true);
      setError(null);
      setData(null);
      setShowPassword(false);
      
      getVaultItemData(itemId).then((result) => {
        if (result.error) {
          setError(result.error);
        } else {
          setData(result.data);
        }
        setLoading(false);
      });
    } else {
      setDeleteConfirm(false); // Reset delete state when closed
    }
  }, [open, itemId]);

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteVaultItem(itemId);
    setIsDeleting(false);
    if (!res.error) {
      onOpenChange(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const renderDataField = (label: string, value: string, isSecret = false, isLink = false) => {
    if (!value) return null;
    
    return (
      <div className="space-y-1.5 mb-4">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</label>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-[#111827] border border-slate-800 rounded-lg p-3 text-sm text-slate-200 font-mono flex items-center justify-between group">
            {isSecret && !showPassword ? "••••••••••••" : value}
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isSecret && (
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors"
                  title="Toggle visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
              {isLink && (
                <a 
                  href={value.startsWith('http') ? value : `https://${value}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors"
                  title="Open link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button 
                onClick={() => copyToClipboard(value, label)}
                className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copiedField === label ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-[#0b1120] border-slate-800 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#111827] rounded-xl border border-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <DialogTitle className="text-xl">{itemTitle}</DialogTitle>
              <p className="text-xs text-slate-500 capitalize mt-0.5">{itemType.toLowerCase()}</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <Loader2 className="w-8 h-8 text-[#10b981] animate-spin" />
              <p className="text-sm text-slate-400">Decrypting securely...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          ) : data ? (
            <div className="mt-2">
              {itemType === "PASSWORD" && (
                <>
                  {renderDataField("Username", data.username)}
                  {renderDataField("Password", data.password, true)}
                  {renderDataField("Website", data.url, false, true)}
                </>
              )}
              {itemType === "IDENTITY" && (
                <>
                  {renderDataField("Full Name", data.fullName)}
                  {renderDataField("ID Number", data.idNumber, true)}
                  {renderDataField("Expiry Date", data.expiryDate)}
                </>
              )}
              {(itemType === "RECEIPT" || itemType === "WARRANTY") && (
                <>
                  {renderDataField("Amount", data.amount ? `$${data.amount}` : "")}
                  {renderDataField("Purchase Date", data.purchaseDate)}
                  {renderDataField("Expiry Date", data.expiryDate)}
                </>
              )}
              
              {!Object.keys(data).length && (
                <p className="text-sm text-slate-400 italic text-center py-4">No structured data found.</p>
              )}
            </div>
          ) : null}
        </div>

        {data && (
          <div className="pt-4 mt-2 border-t border-slate-800 flex justify-between items-center">
            {deleteConfirm ? (
              <div className="flex items-center gap-2 w-full justify-between bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                <span className="text-xs text-red-400 font-medium px-2">Are you sure?</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(false)} className="h-8 text-slate-300 hover:text-white">Cancel</Button>
                  <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting} className="h-8 bg-red-600 hover:bg-red-700">
                    {isDeleting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : "Delete"}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setDeleteConfirm(true)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
                
                <AddVaultItemDialog 
                  editMode={true} 
                  initialData={{ id: itemId, title: itemTitle, type: itemType as any, ...data }}
                  open={isEditOpen}
                  onOpenChange={(isOpen) => {
                    setIsEditOpen(isOpen);
                    if (!isOpen) onOpenChange(false); // close viewer when edit closes
                  }}
                >
                  <Button size="sm" className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700" onClick={() => setIsEditOpen(true)}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit Item
                  </Button>
                </AddVaultItemDialog>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
