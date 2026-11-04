import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'CampusCloset - P2P Student Rental & Marketplace',
  description:
    'The premier peer-to-peer campus marketplace for university students. Rent dorm fridges, chairs, and textbooks or sell your gear to juniors before moving out.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b1120] text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-sky-500/30 selection:text-sky-300 pb-16 sm:pb-0">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <BottomNav />
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
