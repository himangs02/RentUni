'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import HeroBanner from '@/components/HeroBanner';
import FilterBar from '@/components/FilterBar';
import ItemCard from '@/components/ItemCard';
import { Item } from '@/types';
import { Sparkles, PackageOpen, RotateCcw } from 'lucide-react';

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

  // Update university filter if URL changes
  useEffect(() => {
    const uni = searchParams.get('university');
    if (uni !== null) {
      setUniversity(uni);
    }
  }, [searchParams]);

  // Fetch items based on active filters
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
      {/* Hero Banner with Integrated Search */}
      <HeroBanner
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        listingType={listingType}
        setListingType={setListingType}
      />

      {/* Main Marketplace Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter Controls Bar */}
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

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-zinc-900/60 border border-white/5 overflow-hidden animate-pulse flex flex-col aspect-[3/4]"
              >
                <div className="h-48 bg-zinc-800" />
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-zinc-800 rounded w-3/4" />
                    <div className="h-3 bg-zinc-850 rounded w-full" />
                  </div>
                  <div className="h-6 bg-zinc-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl bg-zinc-900/40 border border-white/5 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto mb-4">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No items found</h3>
            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
              We couldn&apos;t find any items matching your active search or filters. Try adjusting your
              keywords or switching category.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-emerald-400 border border-white/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
        <div className="min-h-screen flex items-center justify-center text-zinc-400">
          Loading CampusCloset...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
