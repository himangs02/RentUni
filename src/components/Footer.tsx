import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck, HeartHandshake, Zap, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#0d0d0d] text-zinc-400 text-xs">
      {/* Value Proposition Banners */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-zinc-900/50 border border-white/5">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-200">100% University Verified</h4>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Connect exclusively with verified campus peers using official university credentials.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-zinc-900/50 border border-white/5">
            <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-200">Dual Transaction Modes</h4>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Rent dorm essentials for a quarter or buy permanent items outright at 70% off retail.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-zinc-900/50 border border-white/5">
            <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-200">Zero Dorm Waste</h4>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Seniors earn money moving out; juniors save hundreds on move-in day essentials.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-zinc-200">CampusCloset</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-500">P2P Campus Marketplace & Rental Platform</span>
        </div>

        <div className="flex items-center gap-6 text-zinc-400">
          <Link href="/?category=Appliances" className="hover:text-emerald-400 transition-colors">
            Appliances
          </Link>
          <Link href="/?category=Furniture" className="hover:text-emerald-400 transition-colors">
            Furniture
          </Link>
          <Link href="/?category=Books" className="hover:text-emerald-400 transition-colors">
            Textbooks
          </Link>
          <Link href="/?category=Electronics" className="hover:text-emerald-400 transition-colors">
            Electronics
          </Link>
        </div>
      </div>
    </footer>
  );
}
