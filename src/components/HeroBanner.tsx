'use client';

import React from 'react';
import { Search, Sparkles, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  listingType: string;
  setListingType: (t: string) => void;
}

export default function HeroBanner({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
}: HeroBannerProps) {
  const quickKeywords = ['Mini-Fridge', 'Study Desk', 'Textbooks', 'Mattress', 'Microwave', 'Monitor'];

  return (
    <div className="relative pt-6 pb-8 border-b border-slate-700/60 bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & Pill Search Bar from screenshot */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-xs text-blue-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold">Student-to-Student Campus Marketplace</span>
              <span className="text-blue-500">•</span>
              <span>100% .edu Verified</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Buy & Rent Dorm Gear from{' '}
              <span className="text-sky-400">Campus Peers</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Moving out or subletting? Rent appliances and study tables to juniors, or sell dorm essentials
              directly with zero moving hassle.
            </p>

            {/* Pill Search Bar matching the phone mockup: "Find student gear..." */}
            <form onSubmit={onSearchSubmit} className="max-w-lg mx-auto lg:mx-0">
              <div className="relative flex items-center p-1 rounded-full bg-slate-800/90 border border-slate-700 shadow-xl focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
                <div className="pl-4 pr-1 text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find student gear..."
                  className="w-full bg-transparent px-2 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Keywords */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 text-xs text-slate-400">
              <span className="text-slate-500 font-semibold">Popular:</span>
              {quickKeywords.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setSearchQuery(kw)}
                  className="px-2.5 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-sky-300 border border-slate-700/80 transition-colors text-[11px]"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column (Desktop): Campus Handover Visual */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/campus-handover.jpg"
                alt="Student dorm handover"
                className="w-full h-72 object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Dorm-to-Dorm Direct Handover</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Meet safely in residence hall lobbies. Inspect items on-site before renting or buying.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
