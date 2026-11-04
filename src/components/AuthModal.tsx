'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  Mail,
  Lock,
  User,
  Building,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, login, register, quickLoginAs } = useAuth();
  const [tab, setTab] = useState<'demo' | 'login' | 'register'>(authModalTab || 'demo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('Stanford University');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Student');
  const [dormLocation, setDormLocation] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await register({
      name,
      email,
      password,
      university,
      phone,
      role,
      dormLocation,
    });
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Registration failed');
    }
  };

  const handleDemoSelect = async (demoEmail: string) => {
    setError(null);
    setLoading(true);
    await quickLoginAs(demoEmail);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Top Header */}
        <div className="p-6 pb-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">CampusCloset Student Access</h3>
              <p className="text-xs text-zinc-400">P2P rentals & purchases for college campuses</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-zinc-950/40 text-xs font-semibold">
          <button
            onClick={() => {
              setTab('demo');
              setError(null);
            }}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 ${
              tab === 'demo'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-400/5'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Demo</span>
          </button>
          <button
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`flex-1 py-3 text-center transition-colors ${
              tab === 'login'
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`flex-1 py-3 text-center transition-colors ${
              tab === 'register'
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Join Campus
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Tab 1: 1-Click Demo Profiles */}
        {tab === 'demo' && (
          <div className="p-6 space-y-3">
            <p className="text-xs text-zinc-400">
              Select a pre-configured student profile to test the platform instantly:
            </p>

            <button
              onClick={() => handleDemoSelect('alex@stanford.edu')}
              disabled={loading}
              className="w-full text-left p-3.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 border border-white/5 hover:border-emerald-500/40 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="Alex"
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500/30"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-300">
                      Alex Rivera
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                      Senior Seller
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">Moving Out • Stanford (Wilbur Hall)</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                Login →
              </span>
            </button>

            <button
              onClick={() => handleDemoSelect('emma@stanford.edu')}
              disabled={loading}
              className="w-full text-left p-3.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 border border-white/5 hover:border-emerald-500/40 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
                  alt="Emma"
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500/30"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-300">
                      Emma Watson
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 font-medium">
                      Junior Renter
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">Premed Sophomore • Stanford (Roble)</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                Login →
              </span>
            </button>

            <button
              onClick={() => handleDemoSelect('sarah@stanford.edu')}
              disabled={loading}
              className="w-full text-left p-3.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 border border-white/5 hover:border-emerald-500/40 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
                  alt="Sarah"
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500/30"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-300">
                      Sarah Chen
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30 font-medium">
                      Senior Lender
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">Econ Senior • Stanford (FloMo)</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                Login →
              </span>
            </button>
          </div>
        )}

        {/* Tab 2: Standard Login */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                University Email (.edu)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@stanford.edu"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">
                Demo accounts password is: <code className="text-emerald-400">password123</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to CampusCloset'}
            </button>
          </form>
        )}

        {/* Tab 3: Register */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Maya Lin"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                University Email (.edu preferred)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mlin@berkeley.edu"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">University</label>
                <select
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="Stanford University">Stanford University</option>
                  <option value="UC Berkeley">UC Berkeley</option>
                  <option value="MIT">MIT</option>
                  <option value="Harvard University">Harvard University</option>
                  <option value="UT Austin">UT Austin</option>
                  <option value="Columbia University">Columbia University</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Student Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="Student">Undergraduate</option>
                  <option value="Alum/Senior">Senior / Alum Moving Out</option>
                  <option value="Student">Graduate Student</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Dorm / Campus Location (Optional)
              </label>
              <input
                type="text"
                value={dormLocation}
                onChange={(e) => setDormLocation(e.target.value)}
                placeholder="e.g. Stern Hall, Room 210"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>
                By signing up, you verify that you are currently affiliated with your selected
                institution.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Join CampusCloset'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
