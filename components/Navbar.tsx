"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { botchainTestnet } from "@/lib/wagmi";
import { Sprout, Wallet, LogOut, AlertTriangle, CheckCircle2, ChevronDown, Copy, Check } from "lucide-react";

interface NavbarProps {
  onFilterMyHarvests: () => void;
  onScrollToAdd: () => void;
  onScrollToHistory: () => void;
}

export function Navbar({ onFilterMyHarvests, onScrollToAdd, onScrollToHistory }: NavbarProps) {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isWrongNetwork = mounted && isConnected && chainId !== botchainTestnet.id;

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = () => {
    const metamaskConnector =
      connectors.find((c) => c.name.toLowerCase().includes("metamask")) ||
      connectors[0];
    if (metamaskConnector) {
      connect({ connector: metamaskConnector });
    } else {
      window.open("https://metamask.io/download/", "_blank");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#DDD5C0]/90 backdrop-blur-md border-b border-borderSoft">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo & Tagline */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onScrollToHistory}>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-accent shadow-sm border border-secondary/40">
            <Sprout className="w-6 h-6 text-[#E9C378]" />
          </div>
          <div>
            <div className="font-serif text-2xl font-bold tracking-tight text-primary flex items-center gap-1.5">
              HarvestNote
            </div>
            <p className="text-[11px] text-secondary-dark tracking-wide uppercase font-medium">
              Every Harvest Has a Story
            </p>
          </div>
        </div>

        {/* Center / Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-mainText">
          <button
            onClick={onScrollToHistory}
            className="hover:text-primary transition-colors py-1 border-b-2 border-transparent hover:border-accent"
          >
            All Harvests
          </button>
          <button
            onClick={() => {
              onFilterMyHarvests();
              onScrollToHistory();
            }}
            className="hover:text-primary transition-colors py-1 border-b-2 border-transparent hover:border-accent flex items-center gap-1.5"
          >
            My Harvests
          </button>
          <button
            onClick={onScrollToAdd}
            className="hover:text-primary transition-colors py-1 border-b-2 border-transparent hover:border-accent"
          >
            Add Harvest
          </button>
        </nav>

        {/* Right side: Network & Wallet Controls */}
        <div className="flex items-center space-x-3">
          {/* Wrong Network Warning Pill */}
          {isWrongNetwork && (
            <button
              onClick={() => switchChain({ chainId: botchainTestnet.id })}
              disabled={isSwitching}
              className="flex items-center gap-1.5 text-xs bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-full hover:bg-amber-200 transition-colors font-medium shadow-sm"
              title="Click to switch to Botchain Testnet (Chain ID 968)"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>{isSwitching ? "Switching..." : "Switch to Botchain"}</span>
            </button>
          )}

          {/* Network Indicator (Botchain Testnet) */}
          {mounted && isConnected && !isWrongNetwork && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs bg-secondary-light/20 text-primary-dark border border-secondary/40 px-2.5 py-1.5 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Botchain Testnet</span>
            </div>
          )}

          {/* Wallet Button */}
          {!mounted || !isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-[#F3F0E6] px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow"
            >
              <Wallet className="w-4 h-4 text-accent" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="inline-flex items-center gap-2 bg-cardBg border border-borderSoft hover:border-secondary px-3.5 py-1.5 rounded-lg text-sm font-mono text-primary font-medium transition-all shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-secondary-dark" />
              </button>

              {/* Wallet Dropdown Menu */}
              {showWalletMenu && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-cardBg rounded-xl border border-borderSoft shadow-lg p-3 text-sm z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseLeave={() => setShowWalletMenu(false)}
                >
                  <div className="pb-2.5 mb-2 border-b border-borderSoft">
                    <p className="text-xs text-secondary-dark font-sans font-medium">Connected Address</p>
                    <p className="font-mono text-xs text-mainText break-all mt-1">{address}</p>
                    <button
                      onClick={handleCopy}
                      className="mt-2 text-xs inline-flex items-center gap-1 text-primary hover:text-accent font-sans font-medium transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-1 font-sans">
                    <button
                      onClick={() => {
                        onFilterMyHarvests();
                        setShowWalletMenu(false);
                        onScrollToHistory();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-[#DDD5C0]/40 text-mainText text-xs font-medium transition-colors"
                    >
                      View My Harvest Records
                    </button>
                    <button
                      onClick={() => {
                        disconnect();
                        setShowWalletMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-rose-50 text-rose-600 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

