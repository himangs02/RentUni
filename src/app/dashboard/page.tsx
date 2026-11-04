'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Item, RentalTransaction } from '@/types';
import { formatPrice, parseImages, calculateDaysRemaining } from '@/lib/utils';
import { ListingTypeBadge, ConditionBadge, VerifiedBadge } from '@/components/UniversityBadge';
import {
  LayoutDashboard,
  Package,
  Clock,
  Tag,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Trash2,
  RefreshCw,
  Calendar,
  ExternalLink,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'borrowed' | 'lent' | 'purchases'>('listings');

  const [myListings, setMyListings] = useState<Item[]>([]);
  const [buyerTransactions, setBuyerTransactions] = useState<RentalTransaction[]>([]);
  const [sellerTransactions, setSellerTransactions] = useState<RentalTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      if (data.success) {
        setMyListings(data.myListings || []);
        setBuyerTransactions(data.buyerTransactions || []);
        setSellerTransactions(data.sellerTransactions || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Toggle availability of listing
  const handleToggleAvailability = async (item: Item) => {
    setActionLoadingId(item.id);
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !item.isAvailable }),
      });
      if (res.ok) {
        setMyListings((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, isAvailable: !it.isAvailable } : it))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete listing
  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this listing from CampusCloset?')) return;
    setActionLoadingId(itemId);
    try {
      const res = await fetch(`/api/items/${itemId}`, { method: 'DELETE' });
      if (res.ok) {
        setMyListings((prev) => prev.filter((it) => it.id !== itemId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Mark rental as completed / returned
  const handleCompleteTransaction = async (txId: string) => {
    setActionLoadingId(txId);
    try {
      const res = await fetch(`/api/transactions/${txId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED', paymentStatus: 'REFUNDED' }),
      });
      if (res.ok) {
        await fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 text-emerald-400 flex items-center justify-center mx-auto">
          <LayoutDashboard className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Student Dashboard</h2>
        <p className="text-xs text-zinc-400">
          Sign in to manage your listed dorm items, track active rentals, and check return dates.
        </p>
        <button
          onClick={() => openAuthModal('demo')}
          className="px-6 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs"
        >
          Sign In with Student ID
        </button>
      </div>
    );
  }

  // Filtered lists
  const borrowedRentals = buyerTransactions.filter((tx) => tx.type === 'RENT');
  const lentRentals = sellerTransactions.filter((tx) => tx.type === 'RENT');
  const purchaseOrders = [
    ...buyerTransactions.filter((tx) => tx.type === 'BUY'),
    ...sellerTransactions.filter((tx) => tx.type === 'BUY'),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Student Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1e1e1e] border border-white/10 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <VerifiedBadge />
            </div>
            <p className="text-xs text-emerald-400 font-medium">{user.university}</p>
            <p className="text-xs text-zinc-400">
              {user.role} • {user.dormLocation || 'Main Campus'} • {user.email}
            </p>
          </div>
        </div>

        <Link
          href="/items/new"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Post New Item</span>
        </Link>
      </div>

      {/* Stats Quick Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>My Listings</span>
            <Package className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{myListings.length}</div>
          <div className="text-[11px] text-zinc-500">Items posted on campus</div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Borrowed Rentals</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">{borrowedRentals.length}</div>
          <div className="text-[11px] text-zinc-500">Active items in my dorm</div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Items Out on Rent</span>
            <Calendar className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">{lentRentals.length}</div>
          <div className="text-[11px] text-zinc-500">Earning passive income</div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Purchases & Sales</span>
            <Tag className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-black text-white">{purchaseOrders.length}</div>
          <div className="text-[11px] text-zinc-500">Permanent exchanges</div>
        </div>
      </div>

      {/* Dashboard Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'listings'
              ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Listings ({myListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('borrowed')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'borrowed'
              ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Borrowed Rentals ({borrowedRentals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('lent')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'lent'
              ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Items Out on Rent ({lentRentals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('purchases')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'purchases'
              ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Permanent Purchases ({purchaseOrders.length})</span>
        </button>
      </div>

      {/* Tab 1: My Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {myListings.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-zinc-900/40 border border-white/5">
              <p className="text-sm font-semibold text-white">No items listed yet</p>
              <p className="text-xs text-zinc-400 mt-1 mb-4">
                Have a mini fridge, extra chair, or textbook you want to rent or sell?
              </p>
              <Link
                href="/items/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Your First Listing</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map((item) => {
                const images = parseImages(item.images);
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-zinc-900/80 border border-white/10 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/9] w-full bg-zinc-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <ListingTypeBadge type={item.listingType} />
                        </div>
                        <div className="absolute top-2.5 right-2.5">
                          <ConditionBadge condition={item.condition} />
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <Link
                          href={`/items/${item.id}`}
                          className="text-sm font-bold text-white hover:text-emerald-400 transition-colors line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs text-zinc-400 line-clamp-2">{item.description}</p>
                        <div className="pt-2 flex items-baseline justify-between text-xs">
                          <span className="text-zinc-500">Price / Rate:</span>
                          <span className="font-bold text-emerald-400 text-sm">
                            {item.listingType === 'RENT'
                              ? `${formatPrice(item.rentalRate)} / ${item.rentalPeriod || 'day'}`
                              : formatPrice(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      {/* Availability toggle */}
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        disabled={actionLoadingId === item.id}
                        className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                          item.isAvailable
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-white/5'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.isAvailable ? 'bg-emerald-400' : 'bg-zinc-500'
                          }`}
                        />
                        <span>{item.isAvailable ? 'Available' : 'Reserved'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/items/${item.id}`}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                          title="View Listing"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={actionLoadingId === item.id}
                          className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-500/20"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Borrowed Rentals */}
      {activeTab === 'borrowed' && (
        <div className="space-y-4">
          {borrowedRentals.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-zinc-900/40 border border-white/5">
              <Clock className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No active rentals as borrower</p>
              <p className="text-xs text-zinc-400 mt-1 mb-4">
                Browse student-listed appliances and furniture for your dorm.
              </p>
              <Link
                href="/?type=RENT"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs"
              >
                <span>Browse Rental Listings</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {borrowedRentals.map((tx) => {
                const daysInfo = tx.endDate ? calculateDaysRemaining(tx.endDate) : null;
                const images = tx.item ? parseImages(tx.item.images) : [];

                return (
                  <div
                    key={tx.id}
                    className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={images[0]}
                          alt={tx.item?.title || 'Item'}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/items/${tx.itemId}`}
                            className="text-sm font-bold text-white hover:text-emerald-400 transition-colors"
                          >
                            {tx.item?.title}
                          </Link>
                          {daysInfo && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                daysInfo.isOverdue
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {daysInfo.label}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Rented from <strong className="text-zinc-200">{tx.seller?.name}</strong> •{' '}
                          {tx.seller?.university}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-zinc-500 mt-1.5">
                          <span>
                            Start: {tx.startDate ? new Date(tx.startDate).toLocaleDateString() : 'N/A'}
                          </span>
                          <span>•</span>
                          <span>
                            Return Due:{' '}
                            {tx.endDate ? new Date(tx.endDate).toLocaleDateString() : 'N/A'}
                          </span>
                          <span>•</span>
                          <span>Pickup: {tx.pickupLocation || 'Campus Quad'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                      <div className="text-right">
                        <div className="text-xs text-zinc-400">Total Paid</div>
                        <div className="text-base font-bold text-emerald-400">
                          {formatPrice(tx.totalAmount)}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          Includes {formatPrice(tx.depositAmount)} deposit
                        </div>
                      </div>

                      {tx.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleCompleteTransaction(tx.id)}
                          disabled={actionLoadingId === tx.id}
                          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-emerald-400 border border-emerald-500/30 transition-colors"
                        >
                          Return Item
                        </button>
                      )}

                      {tx.status === 'COMPLETED' && (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
                          Returned (Deposit Refunded)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Items Lent Out (As Lender) */}
      {activeTab === 'lent' && (
        <div className="space-y-4">
          {lentRentals.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-zinc-900/40 border border-white/5">
              <Calendar className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No items currently out on rent</p>
              <p className="text-xs text-zinc-400 mt-1">
                When students rent your listed items, they will appear here with active return tracking.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {lentRentals.map((tx) => {
                const daysInfo = tx.endDate ? calculateDaysRemaining(tx.endDate) : null;
                const images = tx.item ? parseImages(tx.item.images) : [];

                return (
                  <div
                    key={tx.id}
                    className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={images[0]}
                          alt={tx.item?.title || 'Item'}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/items/${tx.itemId}`}
                            className="text-sm font-bold text-white hover:text-emerald-400 transition-colors"
                          >
                            {tx.item?.title}
                          </Link>
                          {daysInfo && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                daysInfo.isOverdue
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                              }`}
                            >
                              {daysInfo.label}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Borrower: <strong className="text-zinc-200">{tx.buyer?.name}</strong> (
                          {tx.buyer?.university}) • Phone: {tx.buyer?.phone || 'On campus'}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-zinc-500 mt-1.5">
                          <span>
                            Due:{' '}
                            {tx.endDate ? new Date(tx.endDate).toLocaleDateString() : 'N/A'}
                          </span>
                          <span>•</span>
                          <span>Pickup Spot: {tx.pickupLocation || 'Dorm Quad'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                      <div className="text-right">
                        <div className="text-xs text-zinc-400">Total Earned</div>
                        <div className="text-base font-bold text-emerald-400">
                          {formatPrice(tx.totalAmount - tx.depositAmount)}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          Holding {formatPrice(tx.depositAmount)} deposit
                        </div>
                      </div>

                      {tx.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleCompleteTransaction(tx.id)}
                          disabled={actionLoadingId === tx.id}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-zinc-950 transition-colors"
                        >
                          Mark Returned & Release Deposit
                        </button>
                      )}

                      {tx.status === 'COMPLETED' && (
                        <span className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-400 text-xs">
                          Completed & Returned
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Permanent Purchases & Sales */}
      {activeTab === 'purchases' && (
        <div className="space-y-4">
          {purchaseOrders.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-zinc-900/40 border border-white/5">
              <Tag className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No permanent buy or sell orders</p>
              <p className="text-xs text-zinc-400 mt-1">
                Items bought or sold permanently will be archived here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {purchaseOrders.map((tx) => {
                const images = tx.item ? parseImages(tx.item.images) : [];
                const isBuyer = tx.buyerId === user.id;

                return (
                  <div
                    key={tx.id}
                    className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={images[0]}
                          alt={tx.item?.title || 'Item'}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/items/${tx.itemId}`}
                            className="text-sm font-bold text-white hover:text-violet-400 transition-colors"
                          >
                            {tx.item?.title}
                          </Link>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/20 text-violet-300">
                            {isBuyer ? 'Purchased' : 'Sold'}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {isBuyer ? `Bought from ${tx.seller?.name}` : `Sold to ${tx.buyer?.name}`} •{' '}
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-violet-400">
                        {formatPrice(tx.totalAmount)}
                      </div>
                      <div className="text-[10px] text-zinc-500">Permanent Handover</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
