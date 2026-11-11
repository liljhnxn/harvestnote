"use client";

import React from "react";
import { PlusCircle, BookOpen, Sparkles } from "lucide-react";

interface HeroProps {
  onScrollToAdd: () => void;
  onScrollToHistory: () => void;
}

export function Hero({ onScrollToAdd, onScrollToHistory }: HeroProps) {
  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 border-b border-borderSoft/60 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Editorial Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D7] border border-borderSoft text-xs font-semibold text-primary tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Decentralized Farming Journal on Botchain</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary leading-[1.12]">
              EVERY HARVEST <br />
              <span className="italic font-normal text-accent">TELLS A STORY.</span>
            </h1>

            <p className="text-base sm:text-lg text-mainText/80 max-w-xl leading-relaxed font-sans font-normal">
              Keep a simple record of what you grow, what you harvest and how much you
              produce. Your farming history, securely stored on-chain, all in one place.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onScrollToAdd}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-[#F3F0E6] px-6 py-3.5 rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <PlusCircle className="w-4 h-4 text-accent" />
                <span>Add New Harvest</span>
              </button>

              <button
                onClick={onScrollToHistory}
                className="inline-flex items-center gap-2 bg-cardBg hover:bg-[#FAF8F3] text-primary border border-borderSoft hover:border-secondary px-6 py-3.5 rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow"
              >
                <BookOpen className="w-4 h-4 text-secondary-dark" />
                <span>View Harvest History</span>
              </button>
            </div>
          </div>

          {/* Agricultural Graphic / Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md p-6 bg-cardBg rounded-2xl border border-borderSoft shadow-journal">
              {/* Subtle vintage frame corners */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-accent"></div>
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-accent"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-accent"></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-accent"></div>

              <div className="p-4 bg-[#FAF8F3] rounded-xl border border-dashed border-borderSoft flex flex-col items-center text-center">
                {/* Custom SVG Agricultural Illustration */}
                <svg
                  viewBox="0 0 240 180"
                  className="w-full h-44 drop-shadow-sm"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Sun */}
                  <circle cx="120" cy="50" r="30" fill="#FDF3DE" />
                  <circle cx="120" cy="50" r="22" fill="#D69B52" opacity="0.3" />
                  <circle cx="120" cy="50" r="14" fill="#D69B52" />

                  {/* Gentle Rolling Hills */}
                  <path
                    d="M-20 160 C 40 130, 90 145, 140 135 C 190 125, 230 140, 260 150 L 260 180 L -20 180 Z"
                    fill="#829477"
                    opacity="0.35"
                  />
                  <path
                    d="M-20 170 C 50 145, 110 160, 160 145 C 200 135, 240 155, 260 160 L 260 180 L -20 180 Z"
                    fill="#354B32"
                    opacity="0.85"
                  />

                  {/* Furrow lines */}
                  <path d="M 40 165 C 80 155, 130 160, 180 155" stroke="#E4E0D4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  <path d="M 60 173 C 100 168, 150 170, 200 167" stroke="#E4E0D4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

                  {/* Wheat Stalk Center */}
                  <path d="M 120 145 L 120 70" stroke="#D69B52" strokeWidth="3" strokeLinecap="round" />
                  {/* Left Grains */}
                  <ellipse cx="112" cy="76" rx="6" ry="11" transform="rotate(-35 112 76)" fill="#D69B52" />
                  <ellipse cx="112" cy="94" rx="6" ry="11" transform="rotate(-35 112 94)" fill="#D69B52" />
                  <ellipse cx="112" cy="112" rx="6" ry="11" transform="rotate(-35 112 112)" fill="#D69B52" />
                  {/* Right Grains */}
                  <ellipse cx="128" cy="76" rx="6" ry="11" transform="rotate(35 128 76)" fill="#E9C378" />
                  <ellipse cx="128" cy="94" rx="6" ry="11" transform="rotate(35 128 94)" fill="#E9C378" />
                  <ellipse cx="128" cy="112" rx="6" ry="11" transform="rotate(35 128 112)" fill="#E9C378" />
                  {/* Top Grain */}
                  <ellipse cx="120" cy="62" rx="5" ry="10" fill="#D69B52" />

                  {/* Left Stalk */}
                  <path d="M 85 150 Q 82 110, 75 90" stroke="#829477" strokeWidth="2.5" strokeLinecap="round" />
                  <ellipse cx="70" cy="95" rx="4" ry="8" transform="rotate(-25 70 95)" fill="#829477" />
                  <ellipse cx="80" cy="108" rx="4" ry="8" transform="rotate(25 80 108)" fill="#829477" />

                  {/* Right Stalk */}
                  <path d="M 155 150 Q 158 110, 165 90" stroke="#829477" strokeWidth="2.5" strokeLinecap="round" />
                  <ellipse cx="170" cy="95" rx="4" ry="8" transform="rotate(25 170 95)" fill="#829477" />
                  <ellipse cx="160" cy="108" rx="4" ry="8" transform="rotate(-25 160 108)" fill="#829477" />
                </svg>

                <div className="mt-3">
                  <span className="font-serif text-sm font-semibold text-primary block">
                    Permanent On-Chain Records
                  </span>
                  <span className="text-xs text-secondary-dark font-sans">
                    Tamper-proof harvest ledger on Botchain Testnet
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

