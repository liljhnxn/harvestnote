"use client";

import React, { useState, useCallback } from "react";
import { useAccount, useReadContract, useConnect } from "wagmi";
import { HARVESTNOTE_CONTRACT_ADDRESS, HARVESTNOTE_ABI, HarvestRecord } from "@/lib/contract";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HarvestStats } from "@/components/HarvestStats";
import { AddHarvest } from "@/components/AddHarvest";
import { HarvestHistory } from "@/components/HarvestHistory";
import { Footer } from "@/components/Footer";

export default function HarvestNotePage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [filterMode, setFilterMode] = useState<"all" | "my">("all");

  // Read all harvests directly from the smart contract on Botchain Testnet
  const {
    data: rawHarvests,
    isLoading,
    refetch,
  } = useReadContract({
    address: HARVESTNOTE_CONTRACT_ADDRESS,
    abi: HARVESTNOTE_ABI,
    functionName: "getAllHarvests",
  });

  // Map the raw contract tuple array to strongly typed HarvestRecord array
  const harvests: HarvestRecord[] = React.useMemo(() => {
    if (!rawHarvests || !Array.isArray(rawHarvests)) return [];

    return (rawHarvests as any[]).map((item) => ({
      id: BigInt(item.id || item[0]),
      cropName: String(item.cropName || item[1]),
      quantity: BigInt(item.quantity || item[2]),
      unit: String(item.unit || item[3]),
      harvestDate: String(item.harvestDate || item[4]),
      farmer: String(item.farmer || item[5]) as `0x${string}`,
      createdAt: BigInt(item.createdAt || item[6]),
      exists: Boolean(item.exists !== undefined ? item.exists : item[7]),
    }));
  }, [rawHarvests]);

  const handleConnectWallet = useCallback(() => {
    const metamaskConnector =
      connectors.find((c) => c.name.toLowerCase().includes("metamask")) ||
      connectors[0];
    if (metamaskConnector) {
      connect({ connector: metamaskConnector });
    }
  }, [connect, connectors]);

  const scrollToAdd = () => {
    const el = document.getElementById("add-harvest");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToHistory = () => {
    const el = document.getElementById("harvest-history");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFilterMyHarvests = () => {
    setFilterMode("my");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-mainText selection:bg-accent/30">
      {/* 1. Header Navigation */}
      <Navbar
        onFilterMyHarvests={handleFilterMyHarvests}
        onScrollToAdd={scrollToAdd}
        onScrollToHistory={scrollToHistory}
      />

      <main className="flex-1">
        {/* 2. Editorial Hero */}
        <Hero onScrollToAdd={scrollToAdd} onScrollToHistory={scrollToHistory} />

        {/* 3. Real On-Chain Harvest Overview Stats */}
        <HarvestStats
          harvests={harvests}
          userAddress={address}
          isConnected={isConnected}
          onConnectClick={handleConnectWallet}
        />

        {/* 4. Add Harvest Entry Section */}
        <AddHarvest
          onHarvestAdded={refetch}
          onConnectWallet={handleConnectWallet}
        />

        {/* 5. Chronological Harvest Journal History */}
        <HarvestHistory
          harvests={harvests}
          isLoading={isLoading}
          onRefresh={refetch}
          onScrollToAdd={scrollToAdd}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          userAddress={address}
        />
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}

