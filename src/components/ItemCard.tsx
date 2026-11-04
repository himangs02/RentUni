'use client';

import React from 'react';
import Link from 'next/link';
import { Item } from '@/types';
import { formatPrice, parseImages } from '@/lib/utils';
import { MapPin, ArrowRight } from 'lucide-react';

export default function ItemCard({ item }: { item: Item }) {
  const images = parseImages(item.images);
  const primaryImage =
    images[0] ||
    'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80';

  // Format pricing tag for image overlay (e.g. "$15/week", "$50/month", "$75")
  let priceOverlay = '';
  if (item.listingType === 'RENT') {
    if (item.rentalPeriod === 'weekly') {
      priceOverlay = `${formatPrice(item.rentalRate)}/week`;
    } else if (item.rentalPeriod === 'monthly') {
      priceOverlay = `${formatPrice(item.rentalRate)}/month`;
    } else {
      priceOverlay = `${formatPrice(item.rentalRate)}/day`;
    }
  } else {
    priceOverlay = formatPrice(item.price);
  }

  // Condition pill badge styling from mockup
  const conditionLabel =
    item.condition === 'Good'
      ? 'Good Condition'
      : item.condition === 'Like New'
      ? 'Like New Condition'
      : 'Fair Condition';

  const isRent = item.listingType === 'RENT';

  return (
    <div className="group flex flex-col rounded-2xl bg-[#1e293b]/90 border border-slate-700/80 hover:border-sky-500/50 shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden">
      {/* 1. Image Container with Overlays */}
      <Link href={`/items/${item.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900 block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primaryImage}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top-Left: Vibrant Green "For Rent" / Purple "For Sale" badge */}
        <div className="absolute top-2.5 left-2.5">
          {isRent ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-slate-950 shadow-md">
              For Rent
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500 text-white shadow-md">
              For Sale
            </span>
          )}
        </div>

        {/* Bottom-Left: Dark translucent price badge directly on image */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="px-2.5 py-1 rounded-md text-xs font-black tracking-tight bg-slate-950/80 backdrop-blur-md text-white border border-white/10 shadow-lg">
            {priceOverlay}
          </span>
        </div>
      </Link>

      {/* 2. Content Details below image */}
      <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
        <div>
          {/* Title */}
          <Link href={`/items/${item.id}`} className="block">
            <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
              {item.title}
            </h3>
          </Link>

          {/* Condition Pill: Soft green pill */}
          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              {conditionLabel}
            </span>
            {item.securityDeposit > 0 && isRent && (
              <span className="text-[10px] text-slate-400">
                +${item.securityDeposit} dep
              </span>
            )}
          </div>

          {/* Owner info */}
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">
              Owner: <strong className="text-slate-300">{item.seller?.name || 'Alex K.'}</strong>
            </span>
            {item.location && (
              <span className="text-[10px] text-slate-500 truncate max-w-[90px]">
                {item.location.split(' ')[0]}
              </span>
            )}
          </div>
        </div>

        {/* 3. Deep Navy CTA Button */}
        <Link
          href={`/items/${item.id}`}
          className={`w-full py-2 px-3 rounded-xl text-xs font-bold text-center transition-all shadow-sm flex items-center justify-center gap-1 ${
            isRent
              ? 'bg-[#0f172a] hover:bg-slate-900 text-white border border-slate-700 hover:border-sky-500/50'
              : 'bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/60'
          }`}
        >
          <span>{isRent ? 'Rent Now' : 'Buy Now'}</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
