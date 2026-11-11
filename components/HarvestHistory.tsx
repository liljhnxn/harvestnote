"use client";

import React, { useState, useMemo } from "react";
import { HarvestRecord } from "@/lib/contract";
import { HarvestItem } from "./HarvestItem";
import {
  RotateCcw,
  Filter,
  Search,
  BookOpen,
  PlusCircle,
  Sparkles,
  Inbox,
} from "lucide-react";

interface HarvestHistoryProps {
  harvests: HarvestRecord[];
  isLoading: boolean;
  onRefresh: () => void;
  onScrollToAdd: () => void;
  filterMode: "all" | "my";
  setFilterMode: (mode: "all" | "my") => void;
  userAddress?: `0x${string}`;
}

export function HarvestHistory({
  harvests,
  isLoading,
  onRefresh,
  onScrollToAdd,
  filterMode,
  setFilterMode,
  userAddress,
}: HarvestHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter records based on selected tab and search term
  const filteredHarvests = useMemo(() => {
    let result = [...harvests].filter((h) => h.exists);

    // Filter by ownership if "My Harvests" is selected
    if (filterMode === "my" && userAddress) {
      result = result.filter(
        (h) => h.farmer.toLowerCase() === userAddress.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (h) =>
          h.cropName.toLowerCase().includes(q) ||
          h.unit.toLowerCase().includes(q) ||
          h.farmer.toLowerCase().includes(q)
      );
    }

    // Sort newest first by harvest ID or creation timestamp
    return result.sort((a, b) => Number(b.id - a.id));
  }, [harvests, filterMode, userAddress, searchQuery]);

  return (
    <section id="harvest-history" className="py-12 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-2xl font-bold text-primary">
                Harvest Journal
              </h2>
            </div>
            <p className="text-xs text-secondary-dark font-sans mt-0.5">
              Chronological log of verified harvests on Botchain Testnet.
            </p>
          </div>

          {/* Controls: Filter tabs & Refresh */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Filter Tabs */}
            <div className="inline-flex p-1 bg-[#EAE5D7] rounded-xl border border-borderSoft text-xs font-medium">
              <button
                onClick={() => setFilterMode("all")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  filterMode === "all"
                    ? "bg-cardBg text-primary font-semibold shadow-sm"
                    : "text-secondary-dark hover:text-primary"
                }`}
              >
                All Harvests ({harvests.filter((h) => h.exists).length})
              </button>
              <button
                onClick={() => setFilterMode("my")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  filterMode === "my"
                    ? "bg-cardBg text-primary font-semibold shadow-sm"
                    : "text-secondary-dark hover:text-primary"
                }`}
              >
                My Harvests (
                {userAddress
                  ? harvests.filter(
                      (h) =>
                        h.exists &&
                        h.farmer.toLowerCase() === userAddress.toLowerCase()
                    ).length
                  : 0}
                )
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 bg-cardBg hover:bg-[#FAF8F3] text-primary border border-borderSoft hover:border-secondary px-3 py-1.5 rounded-xl text-xs font-medium transition-all shadow-sm active:scale-95 disabled:opacity-50"
              title="Refresh on-chain harvests"
            >
              <RotateCcw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-accent" : "text-secondary-dark"}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="mb-6">
          <div className="relative">
            <Search className="w-4 h-4 text-secondary-dark absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by crop name (e.g. Tomatoes, Wheat) or farmer address..."
              className="w-full pl-10 pr-4 py-2 bg-cardBg border border-borderSoft rounded-xl text-xs sm:text-sm text-mainText placeholder-secondary-dark/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && harvests.length === 0 ? (
          <div className="journal-card p-12 text-center bg-cardBg border border-borderSoft">
            <RotateCcw className="w-8 h-8 text-accent animate-spin mx-auto mb-3" />
            <p className="font-serif font-semibold text-primary">
              Fetching records from Botchain Testnet...
            </p>
            <p className="text-xs text-secondary-dark mt-1">
              Querying smart contract on chain ID 968
            </p>
          </div>
        ) : filteredHarvests.length === 0 ? (
          /* Empty State Requirement 6.F */
          <div className="journal-card p-12 text-center bg-cardBg border border-borderSoft shadow-journal">
            <div className="w-14 h-14 rounded-full bg-[#FAF8F3] border border-borderSoft flex items-center justify-center text-accent mx-auto mb-4">
              <Inbox className="w-7 h-7 text-[#D69B52]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-primary mb-2">
              Your harvest journal is empty.
            </h3>
            <p className="text-sm text-secondary-dark max-w-md mx-auto mb-6">
              Record your first harvest and start building your farming history.
            </p>
            <button
              onClick={onScrollToAdd}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-[#F3F0E6] px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-accent" />
              <span>Add Harvest</span>
            </button>
          </div>
        ) : (
          /* Vertical Harvest Timeline */
          <div className="space-y-4">
            {filteredHarvests.map((harvest) => (
              <HarvestItem
                key={harvest.id.toString()}
                harvest={harvest}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

