'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Item } from '@/types';
import { formatPrice, calculateRentalDays } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  Calendar,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface RentalBookingModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
}

export default function RentalBookingModal({ item, isOpen, onClose }: RentalBookingModalProps) {
  const { user, openAuthModal } = useAuth();
  const router = useRouter();

  // Default dates: start tomorrow, end 14 days later
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultStart = tomorrow.toISOString().split('T')[0];

  const inTwoWeeks = new Date();
  inTwoWeeks.setDate(inTwoWeeks.getDate() + 15);
  const defaultEnd = inTwoWeeks.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [pickupLocation, setPickupLocation] = useState(item.location || 'Campus Center / Quad');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Calculate pricing
  const days = calculateRentalDays(startDate, endDate);
  const rate = item.rentalRate || 0;
  const rentalFee = days * rate;
  const securityDeposit = item.securityDeposit || 0;
  const totalAmount = rentalFee + securityDeposit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError('Return date must be strictly after pickup date');
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
          type: 'RENT',
          startDate,
          endDate,
          pickupLocation,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit rental reservation');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        router.push('/dashboard');
      }, 1800);
    } catch {
      setError('Network error while processing booking');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Book Rental Reservation</h3>
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
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h4 className="text-lg font-bold text-white">Rental Reserved Successfully!</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Your rental reservation with <strong className="text-zinc-200">{item.seller?.name}</strong> has
              been recorded. Redirecting to your student dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-xs text-red-300">
                {error}
              </div>
            )}

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Pickup Date
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Return Due Date
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {/* Pickup Location Preference */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Pickup / Handover Location
              </label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="e.g. Wilbur Hall Lobby or Green Library Café"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* Notes to Owner */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Message to {item.seller?.name} (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Let the owner know your dorm room or preferred time to meet..."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* Cost Breakdown Box */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/10 space-y-2 text-xs">
              <div className="font-semibold text-zinc-200 pb-1.5 border-b border-white/5 flex items-center justify-between">
                <span>Rental Pricing Summary</span>
                <span className="text-emerald-400 font-bold">{days} day{days === 1 ? '' : 's'} duration</span>
              </div>

              <div className="flex justify-between text-zinc-400 pt-1">
                <span>
                  Base Rate ({formatPrice(rate)} × {days} days)
                </span>
                <span className="text-zinc-200">{formatPrice(rentalFee)}</span>
              </div>

              <div className="flex justify-between text-zinc-400">
                <span className="flex items-center gap-1">
                  Refundable Security Deposit
                  <span title="Returned automatically upon end of rental" className="text-zinc-500 cursor-help">
                    <Info className="w-3 h-3" />
                  </span>
                </span>
                <span className="text-zinc-200">{formatPrice(securityDeposit)}</span>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline text-sm font-bold text-white">
                <span>Total Amount Due</span>
                <span className="text-lg text-emerald-400 font-extrabold">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            {/* Trust Guarantee Alert */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-start gap-2.5 text-[11px] text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>
                <strong>CampusCloset Deposit Guarantee:</strong> Your deposit is held securely and
                refunded in full upon safe return of the item.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? 'Confirming Reservation...' : `Confirm & Book for ${formatPrice(totalAmount)}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
