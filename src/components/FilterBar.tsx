'use client';

import React from 'react';
import { ItemCategory, ListingType } from '@/types';
import {
  Sparkles,
  SlidersHorizontal,
  Clock,
  Tag,
  Layers,
  Refrigerator,
  Armchair,
  BookOpen,
  Laptop,
  Package,
} from 'lucide-react';

interface FilterBarProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedCondition: string;
  setSelectedCondition: (cond: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  itemCount: number;
}

export default function FilterBar({
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  selectedCondition,
  setSelectedCondition,
  selectedSort,
  setSelectedSort,
  itemCount,
}: FilterBarProps) {
  const categories = [
    { label: 'All Items', value: 'all', icon: Layers },
    { label: 'Appliances', value: 'Appliances', icon: Refrigerator },
    { label: 'Furniture', value: 'Furniture', icon: Armchair },
    { label: 'Books', value: 'Books', icon: BookOpen },
    { label: 'Electronics', value: 'Electronics', icon: Laptop },
    { label: 'Others', value: 'Others', icon: Package },
  ];

  return (
    <div className="space-y-4 mb-8">
      {/* Top Filter Row: Listing Type Toggle & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        {/* Toggle Pill: All / For Rent / For Sale */}
        <div className="inline-flex p-1 rounded-xl bg-zinc-900/90 border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              selectedType === 'all'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Listings
          </button>
          <button
            onClick={() => setSelectedType('RENT')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              selectedType === 'RENT'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'text-zinc-400 hover:text-emerald-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>For Rent</span>
          </button>
          <button
            onClick={() => setSelectedType('SELL')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              selectedType === 'SELL'
                ? 'bg-violet-500 text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                : 'text-zinc-400 hover:text-violet-300'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>For Sale</span>
          </button>
        </div>

        {/* Secondary controls: Condition & Sort */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs text-zinc-500 font-medium hidden sm:inline">
            {itemCount} item{itemCount === 1 ? '' : 's'} available
          </span>

          {/* Condition Filter */}
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500/40 cursor-pointer"
          >
            <option value="all">Any Condition</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>

          {/* Sort By */}
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500/40 cursor-pointer"
          >
            <option value="newest">Sort: Newest Listed</option>
            <option value="popular">Sort: Most Viewed</option>
            <option value="price_asc">Sort: Price (Low to High)</option>
            <option value="price_desc">Sort: Price (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 border border-white/5'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
