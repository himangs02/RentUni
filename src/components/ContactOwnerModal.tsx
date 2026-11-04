'use client';

import React, { useState, useEffect } from 'react';
import { Item, Inquiry } from '@/types';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  MessageSquare,
  Send,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  User,
  Phone,
} from 'lucide-react';

interface ContactOwnerModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactOwnerModal({ item, isOpen, onClose }: ContactOwnerModalProps) {
  const { user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'inapp'>('whatsapp');
  const [messages, setMessages] = useState<Inquiry[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // WhatsApp prefilled message
  const sellerPhone = item.seller?.phone?.replace(/[^0-9]/g, '') || '16505550142';
  const whatsappPreFilled = encodeURIComponent(
    `Hi ${item.seller?.name || 'there'}! I saw your "${item.title}" on CampusCloset. Is it still available to ${
      item.listingType === 'RENT' ? 'rent' : 'buy'
    }?`
  );
  const whatsappUrl = `https://wa.me/${sellerPhone}?text=${whatsappPreFilled}`;

  // Fetch in-app messages when opening in-app tab
  useEffect(() => {
    if (isOpen && activeTab === 'inapp' && user) {
      setLoadingMessages(true);
      fetch(`/api/inquiries?itemId=${item.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setMessages(data.inquiries || []);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingMessages(false));
    }
  }, [isOpen, activeTab, item.id, user]);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!inputMessage.trim()) return;

    setSending(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          receiverId: item.sellerId,
          message: inputMessage,
        }),
      });
      const data = await res.json();
      if (data.success && data.inquiry) {
        setMessages((prev) => [...prev, data.inquiry]);
        setInputMessage('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 pb-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.seller?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.seller?.name}`}
              alt={item.seller?.name}
              className="w-10 h-10 rounded-full border border-emerald-500/30 object-cover"
            />
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Contact {item.seller?.name}</span>
                <span className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              </h3>
              <p className="text-xs text-zinc-400">{item.seller?.university} • {item.seller?.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: WhatsApp vs In-App Chat */}
        <div className="flex border-b border-white/10 bg-zinc-950/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'whatsapp'
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Direct WhatsApp</span>
          </button>
          <button
            onClick={() => setActiveTab('inapp')}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'inapp'
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>In-App Campus Chat</span>
          </button>
        </div>

        {/* Tab 1: WhatsApp Connect */}
        {activeTab === 'whatsapp' && (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Verified Phone: <strong>{item.seller?.phone || '+1 (650) 555-0142'}</strong></span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Connect directly on WhatsApp to coordinate convenient dorm pickup times, view extra photos, or negotiate lease durations.
              </p>
              <div className="p-3 rounded-lg bg-zinc-900 border border-white/5 text-xs text-zinc-300 italic">
                &ldquo;Hi {item.seller?.name}! I saw your &quot;{item.title}&quot; on CampusCloset. Is it still available to {item.listingType === 'RENT' ? 'rent' : 'buy'}?&rdquo;
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Open WhatsApp Conversation</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <p className="text-center text-[11px] text-zinc-500">
              Only verified university peers can message this number.
            </p>
          </div>
        )}

        {/* Tab 2: In-App Chat Simulator */}
        {activeTab === 'inapp' && (
          <div className="flex-1 flex flex-col p-4 overflow-hidden min-h-[300px]">
            {!user ? (
              <div className="my-auto text-center p-6 space-y-3">
                <p className="text-xs text-zinc-400">Please sign in to send in-app messages to {item.seller?.name}</p>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 text-xs font-bold"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-2">
                  {loadingMessages ? (
                    <div className="text-center text-xs text-zinc-500 py-8">Loading message history...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-xs text-zinc-500 py-8">
                      No previous messages yet. Say hi and ask about pickup!
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.senderId === user.id;
                      return (
                        <div
                          key={m.id}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs ${
                              isMe
                                ? 'bg-emerald-500 text-zinc-950 font-medium rounded-tr-none'
                                : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-white/5'
                            }`}
                          >
                            <p>{m.message}</p>
                            <span
                              className={`text-[9px] block text-right mt-1 ${
                                isMe ? 'text-zinc-800' : 'text-zinc-500'
                              }`}
                            >
                              {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="pt-3 border-t border-white/10 flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`Message ${item.seller?.name}...`}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputMessage.trim()}
                    className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 disabled:opacity-40 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
