"use client";

import React, { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from "wagmi";
import { botchainTestnet } from "@/lib/wagmi";
import { HARVESTNOTE_CONTRACT_ADDRESS, HARVESTNOTE_ABI } from "@/lib/contract";
import { PlusCircle, Loader2, CheckCircle2, AlertCircle, Sparkles, ExternalLink } from "lucide-react";

interface AddHarvestProps {
  onHarvestAdded: () => void;
  onConnectWallet: () => void;
}

const COMMON_CROPS = [
  "Wheat",
  "Maize (Corn)",
  "Rice",
  "Soybeans",
  "Tomatoes",
  "Potatoes",
  "Coffee",
  "Apples",
  "Cassava",
  "Barley",
];

const COMMON_UNITS = ["kg", "bags", "baskets", "crates", "tonnes", "bushels", "bundles"];

export function AddHarvest({ onHarvestAdded, onConnectWallet }: AddHarvestProps) {
  const { address, isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState<string>("");
  const [unit, setUnit] = useState("kg");
  const [harvestDate, setHarvestDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: txHash,
    writeContract,
    isPending: isWriting,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;
  const isBusy = isWriting || isConfirming;

  // React to transaction confirmation
  React.useEffect(() => {
    if (isConfirmed) {
      onHarvestAdded();
      // Clear form inputs
      setCropName("");
      setQuantity("");
      setValidationError(null);
    }
  }, [isConfirmed, onHarvestAdded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!isConnected) {
      onConnectWallet();
      return;
    }

    if (isWrongNetwork) {
      switchChain({ chainId: botchainTestnet.id });
      return;
    }

    const trimmedCrop = cropName.trim();
    const numQuantity = Number(quantity);
    const trimmedUnit = unit.trim();
    const trimmedDate = harvestDate.trim();

    if (!trimmedCrop) {
      setValidationError("Please enter a valid crop name.");
      return;
    }

    if (!quantity || isNaN(numQuantity) || numQuantity <= 0) {
      setValidationError("Harvest quantity must be a positive number greater than 0.");
      return;
    }

    if (!trimmedUnit) {
      setValidationError("Please specify a unit of measurement (e.g. kg, bags).");
      return;
    }

    if (!trimmedDate) {
      setValidationError("Please select the harvest date.");
      return;
    }

    try {
      writeContract({
        address: HARVESTNOTE_CONTRACT_ADDRESS,
        abi: HARVESTNOTE_ABI,
        functionName: "addHarvest",
        args: [trimmedCrop, BigInt(Math.floor(numQuantity)), trimmedUnit, trimmedDate],
      });
    } catch (err: any) {
      setValidationError(err?.message || "Failed to initiate transaction.");
    }
  };

  return (
    <section id="add-harvest" className="py-10 border-b border-borderSoft/60 scroll-mt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="journal-card bg-cardBg border border-borderSoft p-6 sm:p-8 shadow-journal relative overflow-hidden">
          {/* Header decorative accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-accent to-secondary"></div>

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-borderSoft">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <h2 className="font-serif text-2xl font-bold text-primary">
                  Record New Harvest
                </h2>
              </div>
              <p className="text-xs text-secondary-dark font-sans mt-0.5">
                Permanently commit your harvest production record to Botchain Testnet.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F3] rounded-full border border-borderSoft text-xs text-primary font-medium">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Smart Contract Entry</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Crop Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-mainText/80 mb-1.5">
                Crop Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g. Heirloom Tomatoes, Golden Maize, Arabica Coffee..."
                disabled={isBusy}
                className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-borderSoft rounded-xl text-mainText placeholder-secondary-dark/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
              {/* Quick suggestion pills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[11px] text-secondary-dark self-center mr-1">Quick pick:</span>
                {COMMON_CROPS.slice(0, 5).map((crop) => (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => setCropName(crop)}
                    className="text-[11px] bg-[#EAE5D7]/50 hover:bg-[#EAE5D7] text-primary px-2 py-0.5 rounded-md transition-colors"
                  >
                    {crop}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Unit Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mainText/80 mb-1.5">
                  Harvest Quantity <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 50"
                  disabled={isBusy}
                  className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-borderSoft rounded-xl text-mainText placeholder-secondary-dark/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mainText/80 mb-1.5">
                  Quantity Unit <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="kg, bags, baskets..."
                    disabled={isBusy}
                    className="flex-1 px-4 py-2.5 bg-[#FAF8F3] border border-borderSoft rounded-xl text-mainText placeholder-secondary-dark/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                  <select
                    onChange={(e) => setUnit(e.target.value)}
                    value={COMMON_UNITS.includes(unit) ? unit : ""}
                    disabled={isBusy}
                    className="px-2.5 py-2.5 bg-[#FAF8F3] border border-borderSoft rounded-xl text-xs text-secondary-dark focus:outline-none focus:border-primary"
                  >
                    <option value="" disabled>Presets</option>
                    {COMMON_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Harvest Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-mainText/80 mb-1.5">
                Harvest Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                disabled={isBusy}
                className="w-full sm:w-1/2 px-4 py-2.5 bg-[#FAF8F3] border border-borderSoft rounded-xl text-mainText focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
            </div>

            {/* Validation / Error Messages */}
            {(validationError || writeError || confirmError) && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                <div className="flex-1 break-words">
                  {validationError ||
                    (writeError as any)?.shortMessage ||
                    writeError?.message ||
                    (confirmError as any)?.message ||
                    "Transaction error occurred."}
                </div>
              </div>
            )}

            {/* Pending state details */}
            {isBusy && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>
                    {isWriting
                      ? "Waiting for wallet confirmation in MetaMask..."
                      : "Confirming transaction on Botchain Testnet..."}
                  </span>
                </div>
                {txHash && (
                  <a
                    href={`https://scan.bohr.life/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-800 underline hover:text-amber-950"
                  >
                    <span>View Tx</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {/* Success notification */}
            {isConfirmed && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Harvest record saved on Botchain!</p>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Your crop entry has been permanently recorded to the smart contract.
                    </p>
                  </div>
                </div>
                {txHash && (
                  <a
                    href={`https://scan.bohr.life/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-md transition-colors"
                  >
                    <span>Explorer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              {!mounted || !isConnected ? (
                <button
                  type="button"
                  onClick={onConnectWallet}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[#F3F0E6] px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-sm"
                >
                  <PlusCircle className="w-4 h-4 text-accent" />
                  <span>Connect Wallet to Save Harvest</span>
                </button>
              ) : isWrongNetwork ? (
                <button
                  type="button"
                  onClick={() => switchChain({ chainId: botchainTestnet.id })}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Switch to Botchain Testnet</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isBusy}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-[#F3F0E6] px-8 py-3.5 rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow cursor-pointer disabled:cursor-not-allowed"
                >
                  {isBusy ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-accent" />
                      <span>Saving Harvest...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 text-accent" />
                      <span>Save Harvest</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

