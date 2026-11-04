'use client';

import React from 'react';
import { Layers, Refrigerator, Armchair, BookOpen, Laptop, BedDouble } from 'lucide-react';

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
  // Category pills matching the screenshot:
  // "Appliances", "Furniture", "Books", "Rent | Sell", "Electronics"
  const pills = [
    { label: 'Appliances', value: 'Appliances' },
    { label: 'Furniture', value: 'Furniture' },
    { label: 'Books', value: 'Books' },
    { label: 'Electronics', value: 'Electronics' },
    { label: 'All Items', value: 'all' },
  ];

  const handleToggleRentSell = () => {
    if (selectedType === 'all') setSelectedType('RENT');
    else if (selectedType === 'RENT') setSelectedType('SELL');
    else setSelectedType('all');
  };

  return (
    <div className="space-y-3 mb-6">
      {/* Horizontal Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {pills.map((pill) => {
          const isActive = selectedCategory === pill.value;
          return (
            <button
              key={pill.value}
              onClick={() => setSelectedCategory(pill.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                isActive
                  ? 'bg-sky-500 text-slate-950 font-extrabold shadow-md'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700'
              }`}
            >
              {pill.label}
            </button>
          );
        })}

        {/* "Rent | Sell" pill button from screenshot */}
        <button
          onClick={handleToggleRentSell}
          className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
            selectedType !== 'all'
              ? selectedType === 'RENT'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold'
                : 'bg-violet-600 text-white border-violet-400 font-extrabold'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'
          }`}
          title="Toggle between All, For Rent, and For Sale"
        >
          {selectedType === 'all'
            ? 'Rent | Sell'
            : selectedType === 'RENT'
            ? '⚡ For Rent'
            : '🏷️ For Sale'}
        </button>
      </div>

      {/* Sub-bar with Item count and Sort */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span>
          Showing <strong className="text-white">{itemCount}</strong> items on campus
        </span>

        <div className="flex items-center gap-2">
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="newest">Newest Listed</option>
            <option value="popular">Most Viewed</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
