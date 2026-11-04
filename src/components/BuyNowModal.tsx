'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Item } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { X, ShoppingBag, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';

interface BuyNowModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
}

export default function BuyNowModal({ item, isOpen, onClose }: BuyNowModalProps) {
  const { user, openAuthModal } = useAuth();
  const router = useRouter();

  const [pickupLocation, setPickupLocation] = useState(item.location || 'Campus Center / Quad');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          type: 'BUY',
          pickupLocation,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to complete purchase order');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        router.push('/dashboard');
      }, 1800);
    } catch {
      setError('Network error while processing purchase');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Purchase Item</h3>
              <p className="text-xs text-zinc-400 line-clamp-1">{item.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center mx-auto border border-violet-500/30">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h4 className="text-lg font-bold text-white">Purchase Confirmed!</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              You have claimed this item from <strong className="text-zinc-200">{item.seller?.name}</strong>.
              Redirecting to your student dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-xs text-red-300">
                {error}
              </div>
            )}

            {/* Price Banner */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/10 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-zinc-400">Total Purchase Price</span>
                <p className="text-[11px] text-zinc-500">Direct peer handover (no shipping fees)</p>
              </div>
              <span className="text-2xl font-black text-violet-400">
                {formatPrice(item.price)}
              </span>
            </div>

            {/* Meetup Handover Location */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-violet-400" />
                Campus Handover Location
              </label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="e.g. White Plaza, Wilbur Dining Hall, or Dorm Lobby"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
              />
            </div>

            {/* Note to Seller */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Note for {item.seller?.name}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Let them know what days/times you are available to meet on campus..."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
              />
            </div>

            {/* Safe campus exchange tips */}
            <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/20 flex items-start gap-2.5 text-[11px] text-violet-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-violet-400 mt-0.5" />
              <span>
                <strong>Campus Safety Tip:</strong> Always inspect the item in a well-lit campus location
                (dorm lobby, dining hall, library) before releasing final payment.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Confirm Purchase for ${formatPrice(item.price)}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
