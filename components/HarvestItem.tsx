"use client";

import React, { useState } from "react";
import { HarvestRecord, HARVESTNOTE_CONTRACT_ADDRESS, HARVESTNOTE_ABI } from "@/lib/contract";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from "wagmi";
import { botchainTestnet } from "@/lib/wagmi";
import {
  Calendar,
  User,
  Edit3,
  Trash2,
  Check,
  X,
  Loader2,
  ExternalLink,
  Wheat,
  Apple,
  Carrot,
  Leaf,
  Sprout,
  AlertCircle,
} from "lucide-react";

interface HarvestItemProps {
  harvest: HarvestRecord;
  onRefresh: () => void;
}

// Helper to pick a charming contextual crop icon
function getCropIcon(cropName: string) {
  const lower = cropName.toLowerCase();
  if (lower.includes("wheat") || lower.includes("corn") || lower.includes("rice") || lower.includes("grain") || lower.includes("barley")) {
    return <Wheat className="w-5 h-5 text-accent" />;
  }
  if (lower.includes("apple") || lower.includes("berry") || lower.includes("fruit") || lower.includes("orange") || lower.includes("grape")) {
    return <Apple className="w-5 h-5 text-rose-500" />;
  }
  if (lower.includes("carrot") || lower.includes("potato") || lower.includes("onion") || lower.includes("cassava") || lower.includes("root")) {
    return <Carrot className="w-5 h-5 text-amber-600" />;
  }
  if (lower.includes("tomato") || lower.includes("pepper") || lower.includes("salad") || lower.includes("vegetable")) {
    return <Leaf className="w-5 h-5 text-emerald-600" />;
  }
  return <Sprout className="w-5 h-5 text-primary" />;
}

export function HarvestItem({ harvest, onRefresh }: HarvestItemProps) {
  const { address, isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Edit form state
  const [editCrop, setEditCrop] = useState(harvest.cropName);
  const [editQuantity, setEditQuantity] = useState(harvest.quantity.toString());
  const [editUnit, setEditUnit] = useState(harvest.unit);
  const [editDate, setEditDate] = useState(harvest.harvestDate);
  const [editError, setEditError] = useState<string | null>(null);

  const isOwner =
    isConnected &&
    address &&
    harvest.farmer.toLowerCase() === address.toLowerCase();

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  // Wagmi write hooks for update
  const {
    data: updateHash,
    writeContract: writeUpdate,
    isPending: isUpdating,
    error: updateWriteError,
    reset: resetUpdate,
  } = useWriteContract();

  const {
    isLoading: isConfirmingUpdate,
    isSuccess: isUpdateSuccess,
  } = useWaitForTransactionReceipt({ hash: updateHash });

  // Wagmi write hooks for delete
  const {
    data: deleteHash,
    writeContract: writeDelete,
    isPending: isDeleting,
    error: deleteWriteError,
    reset: resetDelete,
  } = useWriteContract();

  const {
    isLoading: isConfirmingDelete,
    isSuccess: isDeleteSuccess,
  } = useWaitForTransactionReceipt({ hash: deleteHash });

  // Handle successful update
  React.useEffect(() => {
    if (isUpdateSuccess) {
      setIsEditing(false);
      resetUpdate();
      onRefresh();
    }
  }, [isUpdateSuccess, onRefresh, resetUpdate]);

  // Handle successful delete
  React.useEffect(() => {
    if (isDeleteSuccess) {
      setShowDeleteConfirm(false);
      resetDelete();
      onRefresh();
    }
  }, [isDeleteSuccess, onRefresh, resetDelete]);

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    if (isWrongNetwork) {
      switchChain({ chainId: botchainTestnet.id });
      return;
    }

    const trimmedCrop = editCrop.trim();
    const num = Number(editQuantity);
    const trimmedUnit = editUnit.trim();
    const trimmedDate = editDate.trim();

    if (!trimmedCrop) {
      setEditError("Crop name cannot be empty.");
      return;
    }
    if (!editQuantity || isNaN(num) || num <= 0) {
      setEditError("Quantity must be greater than zero.");
      return;
    }
    if (!trimmedUnit) {
      setEditError("Unit cannot be empty.");
      return;
    }
    if (!trimmedDate) {
      setEditError("Harvest date cannot be empty.");
      return;
    }

    writeUpdate({
      address: HARVESTNOTE_CONTRACT_ADDRESS,
      abi: HARVESTNOTE_ABI,
      functionName: "updateHarvest",
      args: [harvest.id, trimmedCrop, BigInt(Math.floor(num)), trimmedUnit, trimmedDate],
    });
  };

  const handleDeleteSubmit = () => {
    if (isWrongNetwork) {
      switchChain({ chainId: botchainTestnet.id });
      return;
    }

    writeDelete({
      address: HARVESTNOTE_CONTRACT_ADDRESS,
      abi: HARVESTNOTE_ABI,
      functionName: "deleteHarvest",
      args: [harvest.id],
    });
  };

  const isBusy = isUpdating || isConfirmingUpdate || isDeleting || isConfirmingDelete;

  return (
    <div className="relative group">
      {/* Journal card entry */}
      <div className="journal-card journal-paper p-5 sm:p-6 bg-cardBg border border-borderSoft hover:border-secondary transition-all hover:shadow-journal">
        {/* Top bar: ID and metadata */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#FAF8F3] border border-borderSoft text-secondary-dark">
              #{harvest.id.toString()}
            </span>
            <span className="text-xs text-secondary-dark flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{harvest.harvestDate}</span>
            </span>
          </div>

          {/* Action buttons (only visible for record owner) */}
          {isOwner && !isEditing && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsEditing(true)}
                disabled={isBusy}
                className="p-1.5 text-secondary-dark hover:text-primary hover:bg-[#FAF8F3] rounded-lg transition-colors"
                title="Edit this harvest entry"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isBusy}
                className="p-1.5 text-secondary-dark hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete this harvest entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <form onSubmit={handleUpdateSubmit} className="space-y-3 pt-2">
            <div className="font-serif font-semibold text-sm text-primary">
              Editing Harvest Record #{harvest.id.toString()}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-secondary-dark block mb-1">
                  Crop Name
                </label>
                <input
                  type="text"
                  value={editCrop}
                  onChange={(e) => setEditCrop(e.target.value)}
                  disabled={isBusy}
                  className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderSoft rounded-lg text-sm text-mainText focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-secondary-dark block mb-1">
                  Harvest Date
                </label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  disabled={isBusy}
                  className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderSoft rounded-lg text-sm text-mainText focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-secondary-dark block mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  disabled={isBusy}
                  className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderSoft rounded-lg text-sm text-mainText focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-secondary-dark block mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={editUnit}
                  onChange={(e) => setEditUnit(e.target.value)}
                  disabled={isBusy}
                  className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-borderSoft rounded-lg text-sm text-mainText focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {(editError || updateWriteError) && (
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>
                  {editError || (updateWriteError as any)?.shortMessage || updateWriteError?.message}
                </span>
              </p>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={isBusy}
                className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-xs px-3.5 py-1.5 rounded-lg transition-colors font-medium disabled:opacity-50"
              >
                {isUpdating || isConfirmingUpdate ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditCrop(harvest.cropName);
                  setEditQuantity(harvest.quantity.toString());
                  setEditUnit(harvest.unit);
                  setEditDate(harvest.harvestDate);
                }}
                disabled={isBusy}
                className="inline-flex items-center gap-1 bg-[#FAF8F3] hover:bg-[#EAE5D7] text-mainText text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        ) : (
          /* Normal Display View */
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                {/* Crop Icon Badge */}
                <div className="w-11 h-11 rounded-xl bg-[#FAF8F3] border border-borderSoft flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  {getCropIcon(harvest.cropName)}
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-primary leading-tight">
                    {harvest.cropName}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-2xl font-bold text-accent">
                      {harvest.quantity.toString()}
                    </span>
                    <span className="text-sm font-medium text-mainText/80">
                      {harvest.unit}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom metadata: Farmer address and details */}
            <div className="mt-4 pt-3 border-t border-borderSoft/60 flex flex-wrap items-center justify-between text-xs text-secondary-dark gap-2">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-secondary" />
                <span className="font-sans">Farmer:</span>
                <a
                  href={`https://scan.bohr.life/address/${harvest.farmer}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-primary hover:text-accent flex items-center gap-1 underline decoration-borderSoft"
                  title="View farmer on BohrScan"
                >
                  <span>
                    {harvest.farmer.slice(0, 6)}...{harvest.farmer.slice(-4)}
                  </span>
                  <ExternalLink className="w-3 h-3 text-secondary-dark" />
                </a>
                {isOwner && (
                  <span className="ml-1 text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                    You
                  </span>
                )}
              </div>

              <div className="text-[11px] text-secondary-dark">
                Logged{" "}
                {new Date(Number(harvest.createdAt) * 1000).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal / Banner */}
        {showDeleteConfirm && (
          <div className="mt-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-2">
            <div className="font-semibold text-rose-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Are you sure you want to delete this harvest record?</span>
            </div>
            <p className="text-rose-800 text-[11px]">
              This action permanently removes the record from the smart contract on Botchain.
            </p>
            {deleteWriteError && (
              <p className="text-rose-700 text-[11px]">
                {(deleteWriteError as any)?.shortMessage || deleteWriteError.message}
              </p>
            )}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleDeleteSubmit}
                disabled={isBusy}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1 disabled:opacity-50"
              >
                {isDeleting || isConfirmingDelete ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting on-chain...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete Record</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isBusy}
                className="bg-[#FAF8F3] hover:bg-[#EAE5D7] text-mainText text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

