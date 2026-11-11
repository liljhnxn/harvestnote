"use client";

import React from "react";
import { HarvestRecord } from "@/lib/contract";
import { Trees, Scale, Layers, Wallet } from "lucide-react";

interface HarvestStatsProps {
  harvests: HarvestRecord[];
  userAddress?: `0x${string}`;
  isConnected: boolean;
  onConnectClick: () => void;
}

export function HarvestStats({
  harvests,
  userAddress,
  isConnected,
  onConnectClick,
}: HarvestStatsProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const activeConnected = mounted && isConnected;

  // Filter on-chain records belonging strictly to the connected wallet
  const myHarvests = React.useMemo(() => {
    if (!activeConnected || !userAddress) return [];
    return harvests.filter(
      (h) => h.farmer.toLowerCase() === userAddress.toLowerCase() && h.exists
    );
  }, [harvests, userAddress, activeConnected]);

  // Total Harvests count
  const totalHarvests = myHarvests.length;

  // Total Quantity Harvested (calculated across all units recorded by this farmer)
  const totalQuantity = React.useMemo(() => {
    return myHarvests.reduce((sum, h) => sum + Number(h.quantity), 0);
  }, [myHarvests]);

  // Different Crops Recorded (distinct normalized crop names)
  const uniqueCropsCount = React.useMemo(() => {
    const crops = new Set(
      myHarvests.map((h) => h.cropName.trim().toLowerCase())
    );
    return crops.size;
  }, [myHarvests]);

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-accent"></div>
            <h2 className="font-serif text-lg font-semibold text-primary">
              Your Farm Overview
            </h2>
          </div>
          {activeConnected && (
            <span className="text-xs text-secondary-dark font-mono">
              On-chain data for {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
            </span>
          )}
        </div>

        {!activeConnected ? (
          <div className="journal-card p-6 bg-cardBg border border-borderSoft flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F3] border border-borderSoft flex items-center justify-center text-secondary-dark">
                <Wallet className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-serif font-semibold text-primary">
                  Connect your wallet to view your farm statistics
                </p>
                <p className="text-xs text-secondary-dark">
                  HarvestNote computes your personal statistics directly from Botchain Testnet records.
                </p>
              </div>
            </div>
            <button
              onClick={onConnectClick}
              className="bg-primary hover:bg-primary-dark text-[#F3F0E6] px-4 py-2 rounded-lg text-xs font-medium transition-colors shadow-sm"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat 1: Total Harvests */}
            <div className="journal-card p-5 bg-cardBg border border-borderSoft hover:border-secondary transition-all hover:shadow-journal">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-secondary-dark">
                  Total Harvests
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#FAF8F3] flex items-center justify-center text-primary border border-borderSoft">
                  <Trees className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-primary">
                  {totalHarvests}
                </span>
                <span className="text-xs text-secondary-dark font-sans">
                  {totalHarvests === 1 ? "entry" : "entries"} logged
                </span>
              </div>
              <p className="text-[11px] text-secondary-dark mt-2">
                Verified on Botchain Testnet
              </p>
            </div>

            {/* Stat 2: Total Quantity Harvested */}
            <div className="journal-card p-5 bg-cardBg border border-borderSoft hover:border-secondary transition-all hover:shadow-journal">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-secondary-dark">
                  Total Quantity Harvested
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#FAF8F3] flex items-center justify-center text-primary border border-borderSoft">
                  <Scale className="w-4 h-4 text-accent" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-primary">
                  {totalQuantity.toLocaleString()}
                </span>
                <span className="text-xs text-secondary-dark font-sans">
                  total units
                </span>
              </div>
              <p className="text-[11px] text-secondary-dark mt-2">
                Cumulative across your recorded crops
              </p>
            </div>

            {/* Stat 3: Different Crops Recorded */}
            <div className="journal-card p-5 bg-cardBg border border-borderSoft hover:border-secondary transition-all hover:shadow-journal">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-secondary-dark">
                  Different Crops Recorded
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#FAF8F3] flex items-center justify-center text-primary border border-borderSoft">
                  <Layers className="w-4 h-4 text-secondary" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-primary">
                  {uniqueCropsCount}
                </span>
                <span className="text-xs text-secondary-dark font-sans">
                  crop varieties
                </span>
              </div>
              <p className="text-[11px] text-secondary-dark mt-2">
                Diversity in your seasonal journal
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

