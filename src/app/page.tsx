'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import HeroBanner from '@/components/HeroBanner';
import FilterBar from '@/components/FilterBar';
import ItemCard from '@/components/ItemCard';
import { Item } from '@/types';
import { PackageOpen, RotateCcw } from 'lucide-react';

function ExploreContent() {
  const searchParams = useSearchParams();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [listingType, setListingType] = useState(searchParams.get('type') || 'all');
  const [condition, setCondition] = useState('all');
  const [sort, setSort] = useState('newest');
  const [university, setUniversity] = useState(searchParams.get('university') || '');

  useEffect(() => {
    const uni = searchParams.get('university');
    if (uni !== null) {
      setUniversity(uni);
    }
  }, [searchParams]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (category && category !== 'all') params.append('category', category);
      if (listingType && listingType !== 'all') params.append('listingType', listingType);
      if (condition && condition !== 'all') params.append('condition', condition);
      if (university.trim()) params.append('university', university.trim());
      if (sort) params.append('sort', sort);

      const res = await fetch(`/api/items?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, category, listingType, condition, university, sort]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setListingType('all');
    setCondition('all');
    setSort('newest');
    setUniversity('');
  };

  return (
    <div className="w-full">
      {/* Hero Banner with Pill Search Bar matching reference */}
      <HeroBanner
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        listingType={listingType}
        setListingType={setListingType}
      />

      {/* Main Marketplace Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Category & Filter Pills matching the screenshot */}
        <FilterBar
          selectedCategory={category}
          setSelectedCategory={setCategory}
          selectedType={listingType}
          setSelectedType={setListingType}
          selectedCondition={condition}
          setSelectedCondition={setCondition}
          selectedSort={sort}
          setSelectedSort={setSort}
          itemCount={items.length}
        />

        {/* Listings Grid: 2 columns on mobile (as in the phone mockup!), 3 on tablet, 4 on desktop */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden animate-pulse flex flex-col aspect-[3/4]"
              >
                <div className="h-40 bg-slate-700/50" />
                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="h-3.5 bg-slate-700 rounded w-3/4" />
                    <div className="h-3 bg-slate-750 rounded w-1/2" />
                  </div>
                  <div className="h-5 bg-slate-700 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-800/40 border border-slate-700/60 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <PackageOpen className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">No items found</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              We couldn&apos;t find any items matching your active category or search query.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-sky-400 border border-slate-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-400">
          Loading CampusCloset...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
