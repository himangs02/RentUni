'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Sparkles, ShieldCheck, ArrowRight, TrendingUp, Clock, Tag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
  listingType,
  setListingType,
}: HeroBannerProps) {
  const { user, openAuthModal } = useAuth();

  const popularKeywords = ['Mini Fridge', 'Desk Chair', 'Calculus', 'Microwave', 'Mattress Topper', 'Monitor'];

  return (
    <div className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-white/10">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Top verified badge pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-emerald-500/30 text-xs text-zinc-300 mb-6 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-emerald-300">The #1 Campus P2P Exchange</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">Exclusively for verified students</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Rent or Buy Dorm Essentials from{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Graduating Seniors
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Seniors moving out list fridges, chairs, and books for rent or sale. Juniors moving in save
            hundreds without bulky moving vans or retail markups.
          </p>

          {/* Search Bar Form */}
          <form onSubmit={onSearchSubmit} className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center p-1.5 rounded-2xl bg-[#1e1e1e]/90 border border-white/15 backdrop-blur-xl shadow-2xl focus-within:border-emerald-500/60 focus-within:shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-all">
              <div className="pl-4 text-zinc-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dorm fridges, ergonomic chairs, calculus books, monitors..."
                className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Popular Tag shortcuts */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
            <span className="text-zinc-500 font-medium">Popular:</span>
            {popularKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => setSearchQuery(kw)}
                className="px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-300 border border-white/5 transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>

          {/* Key Metrics / Trust Bar */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-white/10 text-left">
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-white/5">
              <div className="text-xl font-bold text-emerald-400">100%</div>
              <div className="text-[11px] text-zinc-400 font-medium">.edu Verified Peers</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-white/5">
              <div className="text-xl font-bold text-teal-400">$14,200+</div>
              <div className="text-[11px] text-zinc-400 font-medium">Saved by Students</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-white/5">
              <div className="text-xl font-bold text-violet-400">Dual Mode</div>
              <div className="text-[11px] text-zinc-400 font-medium">Rent or Buy Direct</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-white/5">
              <div className="text-xl font-bold text-amber-400">0% Waste</div>
              <div className="text-[11px] text-zinc-400 font-medium">Dorm-to-Dorm Handover</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
