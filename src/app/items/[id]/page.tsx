'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Item } from '@/types';
import { formatPrice, parseImages, calculateRentalDays } from '@/lib/utils';
import { ListingTypeBadge, ConditionBadge, VerifiedBadge } from '@/components/UniversityBadge';
import RentalBookingModal from '@/components/RentalBookingModal';
import BuyNowModal from '@/components/BuyNowModal';
import ContactOwnerModal from '@/components/ContactOwnerModal';
import ItemCard from '@/components/ItemCard';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Phone,
  MessageCircle,
  MessageSquare,
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertCircle,
  Tag,
  Info,
  ChevronRight,
} from 'lucide-react';

export default function ItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const [item, setItem] = useState<Item | null>(null);
  const [relatedItems, setRelatedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Modals state
  const [rentalModalOpen, setRentalModalOpen] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Quick interactive date calculator preview on the page
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultStart = tomorrow.toISOString().split('T')[0];

  const inTwoWeeks = new Date();
  inTwoWeeks.setDate(inTwoWeeks.getDate() + 15);
  const defaultEnd = inTwoWeeks.toISOString().split('T')[0];

  const [previewStart, setPreviewStart] = useState(defaultStart);
  const [previewEnd, setPreviewEnd] = useState(defaultEnd);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/items/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.item) {
          setItem(data.item);
          setRelatedItems(data.relatedItems || []);
        }
      })
      .catch((err) => console.error('Failed to load item:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-xs text-zinc-400">Loading item details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Item Not Found</h2>
        <p className="text-xs text-zinc-400">
          This listing may have been rented, sold, or removed by the student owner.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-emerald-400 hover:bg-zinc-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const images = parseImages(item.images);
  const activeImage = images[selectedImageIndex] || images[0];

  // Duration & Cost breakdown preview
  const days = calculateRentalDays(previewStart, previewEnd);
  const rate = item.rentalRate || 0;
  const estimatedRentalFee = days * rate;
  const deposit = item.securityDeposit || 0;
  const estimatedTotal = estimatedRentalFee + deposit;

  const handleActionClick = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (item.listingType === 'RENT') {
      setRentalModalOpen(true);
    } else {
      setBuyModalOpen(true);
    }
  };

  const isOwner = user && user.id === item.sellerId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Listings</span>
        </Link>
        <div className="flex items-center gap-2 text-zinc-500">
          <span>{item.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-300 truncate max-w-[200px]">{item.title}</span>
        </div>
      </div>

      {/* Main Grid: Gallery + Specs & Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Photo Display */}
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <ListingTypeBadge type={item.listingType} />
              <ConditionBadge condition={item.condition} />
            </div>
            {!item.isAvailable && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center">
                <span className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-sm tracking-wider uppercase">
                  Currently Reserved / Sold
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails row (if multiple images) */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-emerald-500 scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Specs & Description Section */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-4 backdrop-blur-md">
            <h3 className="text-base font-bold text-white">Item Overview & Specs</h3>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>

            <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-zinc-500 block">Category</span>
                <span className="font-semibold text-zinc-200 mt-0.5 block">{item.category}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Item Condition</span>
                <span className="font-semibold text-zinc-200 mt-0.5 block">{item.condition}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Campus Location</span>
                <span className="font-semibold text-zinc-200 mt-0.5 block truncate">
                  {item.location || 'Campus Center'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Booking Action Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Pricing & Action Card */}
          <div className="p-6 rounded-3xl bg-[#1e1e1e] border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Header / Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase bg-zinc-800 text-zinc-300 border border-white/5">
                  {item.category}
                </span>
                {item.location && (
                  <span className="flex items-center gap-1 text-xs text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {item.location}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight leading-snug">
                {item.title}
              </h1>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10">
              {item.listingType === 'RENT' ? (
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-400">
                      {formatPrice(item.rentalRate)}
                    </span>
                    <span className="text-sm text-zinc-400 font-medium">
                      / {item.rentalPeriod || 'day'}
                    </span>
                  </div>
                  {item.securityDeposit > 0 && (
                    <div className="mt-2 flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-white/5">
                      <span>Refundable Security Deposit</span>
                      <span className="font-semibold text-zinc-200">
                        {formatPrice(item.securityDeposit)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-violet-400">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-semibold uppercase">
                      One-Time Buy
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">Permanent purchase • No rental return needed</p>
                </div>
              )}
            </div>

            {/* If Rent: Quick Duration Preview */}
            {item.listingType === 'RENT' && (
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-xs">
                <div className="flex items-center justify-between font-semibold text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    Estimate Rental Duration
                  </span>
                  <span className="text-emerald-400">{days} days</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-1">Pickup</label>
                    <input
                      type="date"
                      value={previewStart}
                      onChange={(e) => setPreviewStart(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-zinc-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-1">Return</label>
                    <input
                      type="date"
                      value={previewEnd}
                      min={previewStart}
                      onChange={(e) => setPreviewEnd(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-zinc-200 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex justify-between items-baseline text-xs text-zinc-400">
                  <span>Est. Total (Fee + Deposit):</span>
                  <span className="font-bold text-white text-sm">{formatPrice(estimatedTotal)}</span>
                </div>
              </div>
            )}

            {/* Action CTA Buttons */}
            <div className="space-y-2.5">
              {isOwner ? (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 text-center font-medium">
                  This is your own listing! You can manage it from your Dashboard.
                </div>
              ) : (
                <button
                  onClick={handleActionClick}
                  disabled={!item.isAvailable}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-xl ${
                    item.listingType === 'RENT'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                      : 'bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_25px_rgba(139,92,246,0.3)]'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {item.listingType === 'RENT' ? (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>Book Rental Duration</span>
                    </>
                  ) : (
                    <>
                      <Tag className="w-4 h-4" />
                      <span>Buy Now ({formatPrice(item.price)})</span>
                    </>
                  )}
                </button>
              )}

              {/* Direct WhatsApp / Chat Contact Button */}
              <button
                onClick={() => setContactModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-emerald-500/40 text-xs font-semibold text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Contact Owner via WhatsApp / In-App Chat</span>
              </button>
            </div>
          </div>

          {/* Seller Profile Card */}
          {item.seller && (
            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-white/10 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Listed By Senior / Student
                </h4>
                <VerifiedBadge />
              </div>

              <div className="flex items-center gap-3.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.seller.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.seller.name}`}
                  alt={item.seller.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-emerald-500/30"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{item.seller.name}</h3>
                  <p className="text-xs text-emerald-400">{item.seller.university}</p>
                  <p className="text-[11px] text-zinc-400">{item.seller.role}</p>
                </div>
              </div>

              {item.seller.bio && (
                <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950/60 p-3 rounded-xl border border-white/5 italic">
                  &ldquo;{item.seller.bio}&rdquo;
                </p>
              )}

              <div className="text-[11px] text-zinc-500 flex items-center justify-between pt-2 border-t border-white/5">
                <span>Dorm: {item.seller.dormLocation || 'Main Campus'}</span>
                <span>Response rate: &lt; 15 mins</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Items Section */}
      {relatedItems.length > 0 && (
        <div className="pt-10 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              More {item.category} from Campus Peers
            </h3>
            <Link
              href={`/?category=${item.category}`}
              className="text-xs font-medium text-emerald-400 hover:underline"
            >
              View all {item.category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedItems.map((rel) => (
              <ItemCard key={rel.id} item={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <RentalBookingModal
        item={item}
        isOpen={rentalModalOpen}
        onClose={() => setRentalModalOpen(false)}
      />

      <BuyNowModal
        item={item}
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
      />

      <ContactOwnerModal
        item={item}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </div>
  );
}
