'use client';

import React from 'react';
import Link from 'next/link';
import { Item } from '@/types';
import { formatPrice, parseImages } from '@/lib/utils';
import { ListingTypeBadge, ConditionBadge, VerifiedBadge } from './UniversityBadge';
import { MapPin, Eye, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ItemCard({ item }: { item: Item }) {
  const images = parseImages(item.images);
  const primaryImage = images[0] || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80';

  return (
    <Link
      href={`/items/${item.id}`}
      className="group relative flex flex-col rounded-2xl bg-[#1e1e1e]/90 border border-white/10 hover:border-emerald-500/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.7),0_0_20px_-5px_rgba(16,185,129,0.2)]"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primaryImage}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <ListingTypeBadge type={item.listingType} />
          <ConditionBadge condition={item.condition} />
        </div>

        {/* Category Pill at bottom left */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider bg-black/60 backdrop-blur-md text-zinc-300 border border-white/10">
            {item.category}
          </span>
        </div>

        {item.viewsCount !== undefined && item.viewsCount > 0 && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] bg-black/60 backdrop-blur-md text-zinc-400 border border-white/10">
            <Eye className="w-3 h-3" />
            <span>{item.viewsCount}</span>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="flex-1 p-4 flex flex-col justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
            {item.title}
          </h3>

          <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {item.location && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
          )}
        </div>

        {/* Pricing & Deposit */}
        <div className="pt-3 border-t border-white/5 flex items-end justify-between">
          <div>
            {item.listingType === 'RENT' ? (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-emerald-400">
                    {formatPrice(item.rentalRate)}
                  </span>
                  <span className="text-xs text-zinc-400">
                    / {item.rentalPeriod || 'day'}
                  </span>
                </div>
                {item.securityDeposit > 0 && (
                  <p className="text-[10px] text-zinc-500">
                    +{formatPrice(item.securityDeposit)} dep (refundable)
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-violet-400">
                    {formatPrice(item.price)}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">Buy now</span>
                </div>
                <p className="text-[10px] text-zinc-500">One-time purchase</p>
              </div>
            )}
          </div>

          {/* Action indicator button */}
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 group-hover:translate-x-0.5 transition-transform">
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Owner Row */}
        {item.seller && (
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.seller.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.seller.name}`}
                alt={item.seller.name}
                className="w-5 h-5 rounded-full object-cover border border-emerald-500/30"
              />
              <span className="truncate font-medium text-zinc-300 max-w-[110px]">
                {item.seller.name}
              </span>
            </div>
            <span className="text-zinc-500 truncate max-w-[120px]">
              {item.seller.university}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
