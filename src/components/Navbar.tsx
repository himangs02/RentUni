'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Search,
  Sparkles,
  MapPin,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, openAuthModal, logout, quickLoginAs } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState('Stanford University');
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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#141414]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                Campus<span className="text-emerald-400">Closet</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-medium -mt-1 tracking-wider uppercase">
                P2P Student Marketplace
              </span>
            </div>
          </Link>

          {/* Campus Selector Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-xs text-zinc-300 hover:border-emerald-500/40 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedCampus}
              onChange={(e) => {
                setSelectedCampus(e.target.value);
                const query = e.target.value === 'All Campuses' ? '' : e.target.value;
                router.push(`/?university=${encodeURIComponent(query)}`);
              }}
              className="bg-transparent text-zinc-200 focus:outline-none cursor-pointer pr-1 text-xs"
            >
              {campusOptions.map((c) => (
                <option key={c} value={c} className="bg-zinc-900 text-zinc-200">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right CTA / Navigation */}
        <div className="hidden md:flex items-center gap-3">
          {/* Post Item Button */}
          <Link
            href="/items/new"
            onClick={handlePostClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List an Item</span>
          </Link>

          {/* User Profile / Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 border border-emerald-500/40 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden xl:flex flex-col">
                  <span className="text-xs font-semibold text-zinc-200 leading-tight">{user.name}</span>
                  <span className="text-[10px] text-emerald-400">{user.role}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {userDropdownOpen && (
                <div
                  onMouseLeave={() => setUserDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-xs text-zinc-400">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate">{user.email}</p>
                    <p className="text-[11px] text-emerald-400 mt-0.5">{user.university}</p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                    <span>My Dashboard & Rentals</span>
                  </Link>

                  <Link
                    href="/items/new"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 text-teal-400" />
                    <span>Create New Listing</span>
                  </Link>

                  <div className="border-t border-white/10 my-1"></div>

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
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 bg-zinc-900 border border-white/10 hover:border-emerald-500/40 hover:text-white transition-colors"
                title="1-Click Login as Demo Senior or Junior"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick Demo Login</span>
              </button>

              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/5 transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/items/new"
            onClick={handlePostClick}
            className="p-2 rounded-lg bg-emerald-500 text-zinc-950"
            title="List an Item"
          >
            <PlusCircle className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-zinc-950/95 backdrop-blur-xl px-4 py-4 space-y-3">
          {user ? (
            <div className="pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border border-emerald-500/40"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-emerald-400">{user.university}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-center rounded-lg bg-zinc-900 border border-white/10 text-xs text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 text-center rounded-lg bg-red-950/40 border border-red-500/20 text-xs text-red-400"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('demo');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-medium text-amber-300"
              >
                <Sparkles className="w-4 h-4" />
                <span>1-Click Demo Login</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-xs font-semibold text-zinc-950"
              >
                Sign In with .edu Email
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
