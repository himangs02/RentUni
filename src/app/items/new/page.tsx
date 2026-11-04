'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ItemCategory, ItemCondition, ListingType } from '@/types';
import { SAMPLE_IMAGE_PRESETS } from '@/lib/sampleImages';
import {
  PlusCircle,
  Clock,
  Tag,
  ArrowLeft,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  MapPin,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

export default function NewListingPage() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const [listingType, setListingType] = useState<ListingType>('RENT');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Appliances');
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(user?.dormLocation || '');

  // Pricing
  const [rentalRate, setRentalRate] = useState('');
  const [rentalPeriod, setRentalPeriod] = useState('daily');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [salePrice, setSalePrice] = useState('');

  // Image URLs
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePresetSelect = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      openAuthModal('login');
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError('Please provide a title and detailed description for your campus listing');
      return;
    }

    if (listingType === 'RENT') {
      if (!rentalRate || parseFloat(rentalRate) <= 0) {
        setError('Please set a valid rental rate per day or month');
        return;
      }
    } else {
      if (!salePrice || parseFloat(salePrice) <= 0) {
        setError('Please set a valid purchase price for permanent sale');
        return;
      }
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          listingType,
          price: listingType === 'SELL' ? parseFloat(salePrice) : null,
          rentalRate: listingType === 'RENT' ? parseFloat(rentalRate) : null,
          rentalPeriod,
          securityDeposit: listingType === 'RENT' && securityDeposit ? parseFloat(securityDeposit) : 0,
          condition,
          images: [imageUrl],
          location: location || user.dormLocation || user.university,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to publish listing');
        setLoading(false);
        return;
      }

      router.push(`/items/${data.item.id}`);
    } catch {
      setError('Network error publishing listing');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          List an Item for Campus Peers
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Moving out or subletting dorm gear? List your item for rent or one-time sale in minutes.
        </p>
      </div>

      {!user && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-200">
              You need to be signed in with your university account to post an item.
            </p>
          </div>
          <button
            onClick={() => openAuthModal('demo')}
            className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs"
          >
            Quick Sign In
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[#1e1e1e] border border-white/10 shadow-2xl space-y-8">
        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/30 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* 1. Transaction Mode Selector (Rent vs Sell) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Transaction Mode
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setListingType('RENT')}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                listingType === 'RENT'
                  ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                  : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  For Rent
                </span>
                {listingType === 'RENT' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <p className="text-xs text-zinc-400">
                Lend to juniors for days or months. Earn passive income while keeping your item.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setListingType('SELL')}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                listingType === 'SELL'
                  ? 'bg-violet-950/30 border-violet-500 text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                  : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-violet-400" />
                  For Sale
                </span>
                {listingType === 'SELL' && (
                  <CheckCircle2 className="w-4 h-4 text-violet-400" />
                )}
              </div>
              <p className="text-xs text-zinc-400">
                Permanent one-time purchase. Perfect for graduating seniors moving away.
              </p>
            </button>
          </div>
        </div>

        {/* 2. Basic Info (Title, Category, Condition) */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Item Title <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Compact 3.2 Cu. Ft. Mini Fridge & Freezer (Sanitized)"
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3.5 py-3 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="Appliances">Appliances (Fridges, Microwaves, Kettles)</option>
                <option value="Furniture">Furniture (Chairs, Desks, Mattresses)</option>
                <option value="Books">Books & Textbooks</option>
                <option value="Electronics">Electronics (Monitors, Calculators, Audio)</option>
                <option value="Others">Others (Scooters, Lamps, Storage)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full px-3.5 py-3 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="Like New">Like New (Mint condition, no wear)</option>
                <option value="Good">Good (Minor cosmetic signs, fully functional)</option>
                <option value="Fair">Fair (Noticeable wear, works properly)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Pricing Section based on Mode */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Pricing & Deposit Details</span>
          </h4>

          {listingType === 'RENT' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Rental Rate ($) <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="number"
                  step="0.10"
                  min="0.10"
                  required
                  value={rentalRate}
                  onChange={(e) => setRentalRate(e.target.value)}
                  placeholder="e.g. 1.50"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Per Period</label>
                <select
                  value={rentalPeriod}
                  onChange={(e) => setRentalPeriod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="daily">Per Day ($/day)</option>
                  <option value="monthly">Per Month ($/month)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Refundable Deposit ($)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                  placeholder="e.g. 35"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Sale Price ($) <span className="text-violet-400">*</span>
              </label>
              <input
                type="number"
                step="1"
                min="1"
                required
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="e.g. 45"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500/50 max-w-xs"
              />
            </div>
          )}
        </div>

        {/* 4. Description & Dorm Location */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Description & Specifications <span className="text-emerald-400">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Include details such as dimensions, year of purchase, accessories included (power cord, ice tray), and pickup logistics..."
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Campus / Dorm Pickup Location</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Wilbur Hall East Campus or White Plaza"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        {/* 5. Photos: Preset Picker + Custom URL */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              Item Photo URL
            </span>
            <span className="text-[11px] text-zinc-500">Pick a preset or paste any image URL</span>
          </label>

          <input
            type="url"
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50"
          />

          {/* Quick Preset Selector */}
          <div>
            <span className="text-[11px] text-zinc-400 block mb-2 font-medium">
              1-Click Photo Presets:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {SAMPLE_IMAGE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetSelect(preset.url)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                    imageUrl === preset.url
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image Preview */}
          {imageUrl && (
            <div className="mt-2 relative aspect-[16/9] max-h-48 rounded-xl overflow-hidden bg-zinc-950 border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-base shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
        >
          {loading ? 'Publishing to CampusCloset...' : 'Publish Listing to Campus'}
        </button>
      </form>
    </div>
  );
}
