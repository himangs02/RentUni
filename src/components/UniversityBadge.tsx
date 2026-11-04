import React from 'react';
import { CheckCircle2, ShieldCheck, Sparkles, Tag, Clock } from 'lucide-react';
import { ItemCondition, ListingType } from '@/types';

export function VerifiedBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 ${className}`}
      title="Verified University Student via .edu email"
    >
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
      <span>Verified Student</span>
    </span>
  );
}

export function ListingTypeBadge({ type }: { type: ListingType }) {
  if (type === 'RENT') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
        <Clock className="w-3 h-3" />
        For Rent
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-violet-500/15 text-violet-300 border border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.2)]">
      <Tag className="w-3 h-3" />
      For Sale
    </span>
  );
}

export function ConditionBadge({ condition }: { condition: ItemCondition }) {
  let color = 'bg-zinc-800 text-zinc-300 border-zinc-700';

  if (condition === 'Like New') {
    color = 'bg-teal-950/70 text-teal-300 border-teal-500/30';
  } else if (condition === 'Good') {
    color = 'bg-sky-950/70 text-sky-300 border-sky-500/30';
  } else if (condition === 'Fair') {
    color = 'bg-amber-950/70 text-amber-300 border-amber-500/30';
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${color}`}>
      <Sparkles className="w-3 h-3 opacity-75" />
      {condition}
    </span>
  );
}
