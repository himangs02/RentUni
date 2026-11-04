'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusSquare, MessageSquare, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { user, openAuthModal } = useAuth();

  const handleAuthRequired = (e: React.MouseEvent, targetPath: string) => {
    if (!user) {
      e.preventDefault();
      openAuthModal('login');
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a]/95 backdrop-blur-xl border-t border-slate-700/60 px-6 py-2.5 sm:hidden shadow-[0_-8px_25px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === '/' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </Link>

        {/* 2. Add Listing */}
        <Link
          href="/items/new"
          onClick={(e) => handleAuthRequired(e, '/items/new')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === '/items/new'
              ? 'text-sky-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PlusSquare className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Add Listing</span>
        </Link>

        {/* 3. Messages */}
        <button
          onClick={() => {
            if (!user) {
              openAuthModal('login');
            } else {
              window.location.href = '/dashboard';
            }
          }}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors relative"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          </div>
          <span className="text-[10px] tracking-tight">Messages</span>
        </button>

        {/* 4. Profile / Dashboard */}
        <Link
          href="/dashboard"
          onClick={(e) => handleAuthRequired(e, '/dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === '/dashboard'
              ? 'text-sky-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">{user ? 'Profile' : 'Sign In'}</span>
        </Link>
      </div>
    </nav>
  );
}
