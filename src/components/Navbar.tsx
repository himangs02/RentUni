'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  Sparkles,
  MapPin,
  ChevronDown,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, openAuthModal, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState('Stanford University');
  const [hasNotification, setHasNotification] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const campusOptions = [
    'All Campuses',
    'Stanford University',
    'UC Berkeley',
    'MIT',
    'Harvard University',
    'UT Austin',
    'Columbia University',
  ];

  const handlePostClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      openAuthModal('login');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-700/60 bg-[#0f172a]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: University Crest [U] + CampusCloset Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* The distinctive [U] crest badge from the reference mockup */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-blue-700 to-indigo-900 border-2 border-blue-400/50 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-serif font-black text-xl tracking-tighter drop-shadow-md">
                U
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center">
                Campus<span className="text-sky-400">Closet</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold -mt-1 tracking-wider uppercase hidden sm:block">
                P2P Student Marketplace
              </span>
            </div>
          </Link>

          {/* Campus Selector Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 hover:border-sky-500/40 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <select
              value={selectedCampus}
              onChange={(e) => {
                setSelectedCampus(e.target.value);
                const query = e.target.value === 'All Campuses' ? '' : e.target.value;
                router.push(`/?university=${encodeURIComponent(query)}`);
              }}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1 text-xs"
            >
              {campusOptions.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-slate-200">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          {/* Post Item Button (Desktop) */}
          <Link
            href="/items/new"
            onClick={handlePostClick}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Listing</span>
          </Link>

          {/* Notification Bell with Red Badge Dot from screenshot */}
          <button
            onClick={() => {
              setHasNotification(false);
              if (user) {
                router.push('/dashboard');
              } else {
                openAuthModal('demo');
              }
            }}
            className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-200" />
            {hasNotification && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#0f172a]" />
            )}
          </button>

          {/* User Profile or 1-Click Demo Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all text-left"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-700 border border-sky-400/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="text-xs font-bold text-slate-200 leading-tight">{user.name}</span>
                  <span className="text-[10px] text-sky-400">{user.role}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  onMouseLeave={() => setUserDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl py-2 z-50 animate-in fade-in duration-150"
                >
                  <div className="px-4 py-2 border-b border-slate-700">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-sky-400 mt-0.5">{user.university}</p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-sky-400" />
                    <span>My Dashboard & Rentals</span>
                  </Link>

                  <Link
                    href="/items/new"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-400" />
                    <span>List a Dorm Item</span>
                  </Link>

                  <div className="border-t border-slate-700 my-1" />

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('demo')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/40 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Demo User</span>
              </button>

              <button
                onClick={() => openAuthModal('login')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
