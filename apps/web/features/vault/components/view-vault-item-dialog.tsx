"use client";

import { useState, useTransition, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Copy, Check, Eye, EyeOff, ShieldCheck, Shield, ExternalLink, Download, LockOpen, Lock, Star } from "lucide-react";
import { getVaultItemData, deleteVaultItem } from "../actions/vault.actions";
import { getPasswordStrength } from "@/lib/password-utils";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { AddVaultItemDialog } from "./add-vault-item-dialog";

interface ViewVaultItemDialogProps {
  itemId: string;
  itemTitle: string;
  itemType: string;
  itemIsFavorite?: boolean;
  itemDescription?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewVaultItemDialog({ itemId, itemTitle, itemType, itemIsFavorite = false, itemDescription, open, onOpenChange }: ViewVaultItemDialogProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [noteUnlocked, setNoteUnlocked] = useState(false);
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
      setNoteUnlocked(false);
      
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
              <Shield className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                {itemTitle}
                {itemIsFavorite && (
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                )}
              </DialogTitle>
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
                  {data.password && (
                    <div className="flex items-center justify-between text-xs mb-4">
                      <span className="text-slate-500">Strength:</span>
                      {getPasswordStrength(data.password) === "Strong" && <span className="text-emerald-500 font-medium">Strong</span>}
                      {getPasswordStrength(data.password) === "Medium" && <span className="text-yellow-500 font-medium">Medium</span>}
                      {getPasswordStrength(data.password) === "Weak" && <span className="text-red-500 font-medium">Weak</span>}
                    </div>
                  )}
                  {renderDataField("Website", data.url, false, true)}
                  {renderDataField("Tags", data.tags)}
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
              
              {itemType === "DOCUMENT" && (
                <>
                  {renderDataField("File Name", data.fileName)}
                  {data.fileSize && renderDataField("File Size", `${(data.fileSize / 1024 / 1024).toFixed(2)} MB`)}
                  {renderDataField("Expiration Date", data.expiryDate)}
                  
                  {data.fileBase64 && (
                    <div className="mt-6 border border-slate-800 bg-[#111827] rounded-xl overflow-hidden">
                      {data.fileBase64.startsWith('data:image/') ? (
                        <div className="flex flex-col">
                          <div className="bg-[#0b1120] p-2 border-b border-slate-800 flex justify-between items-center">
                            <span className="text-xs font-medium text-slate-400 px-2">Image Preview</span>
                            <a 
                              href={data.fileBase64} 
                              download={data.fileName || "secure_image"}
                              className="text-xs flex items-center gap-1.5 text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-md transition-colors"
                            >
                              <Download className="w-3 h-3" /> Download
                            </a>
                          </div>
                          <div className="p-4 flex justify-center">
                            <img src={data.fileBase64} alt={data.fileName} className="max-w-full max-h-[300px] rounded-md object-contain" />
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 flex flex-col items-center justify-center space-y-4 text-center">
                          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-white mb-1">Secure Document Ready</h4>
                            <p className="text-xs text-slate-400 max-w-[250px]">
                              This document has been successfully decrypted and is ready to download.
                            </p>
                          </div>
                          <a 
                            href={data.fileBase64} 
                            download={data.fileName || "secure_document"}
                            className="text-sm flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" /> Download File
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
              
              {itemType === "SECURE_NOTE" && (
                <div className="space-y-4">
                  {renderDataField("Category", data.category)}
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Private Note</label>
                    {!noteUnlocked ? (
                      <div className="bg-[#111827] border border-slate-800 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => setNoteUnlocked(true)}>
                        <Lock className="w-8 h-8 text-slate-500 mb-3" />
                        <h4 className="text-sm font-medium text-slate-300">Note is locked</h4>
                        <p className="text-xs text-slate-500 mt-1">Click to unlock and reveal contents</p>
                      </div>
                    ) : (
                      <div className="bg-[#111827] border border-slate-800 rounded-lg p-4 relative group">
                        <p className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                          {itemDescription || data.description || data.notes || "No content."}
                        </p>
                        <button 
                          onClick={() => setNoteUnlocked(false)}
                          className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                          title="Lock note"
                        >
                          <LockOpen className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
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
                  <Button variant="ghost" onClick={() => setDeleteConfirm(false)} className="h-8 px-3 text-slate-300 hover:text-white">Cancel</Button>
                  <Button variant="default" onClick={handleDelete} disabled={isDeleting} className="h-8 px-3 bg-red-600 hover:bg-red-700 text-white">
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
                  initialData={{ id: itemId, title: itemTitle, type: itemType as any, description: itemDescription, ...data }}
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
