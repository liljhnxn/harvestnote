"use client";

import React from "react";
import { Sprout, ExternalLink } from "lucide-react";
import { HARVESTNOTE_CONTRACT_ADDRESS } from "@/lib/contract";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-borderSoft bg-[#EAE5D7]/50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-borderSoft/60">
          {/* Brand & Description */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-accent">
                <Sprout className="w-5 h-5 text-[#E9C378]" />
              </div>
              <span className="font-serif text-xl font-bold text-primary">
                HarvestNote
              </span>
            </div>
            <p className="text-xs text-secondary-dark font-sans max-w-sm leading-relaxed">
              A minimalist decentralized agricultural journal. Every harvest has a story,
              recorded permanently and transparently on Botchain Testnet.
            </p>
          </div>

          {/* Network & Explorer Links */}
          <div className="md:col-span-6 flex flex-col md:items-end space-y-2">
            <div className="flex items-center gap-2 text-xs text-primary font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Network: Botchain Testnet (Chain ID 968)</span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <a
                href={`https://scan.bohr.life/address/${HARVESTNOTE_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="text-secondary-dark hover:text-primary transition-colors flex items-center gap-1 underline decoration-borderSoft"
              >
                <span>Contract on BohrScan</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://scan.bohr.life"
                target="_blank"
                rel="noreferrer"
                className="text-secondary-dark hover:text-primary transition-colors flex items-center gap-1 underline decoration-borderSoft"
              >
                <span>BohrScan Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-[11px] font-mono text-secondary-dark">
              RPC: https://rpc.bohr.life
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-secondary-dark">
          <p>© {new Date().getFullYear()} HarvestNote. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-serif italic text-primary/80">
            Every Harvest Has a Story.
          </p>
        </div>
      </div>
    </footer>
  );
}

