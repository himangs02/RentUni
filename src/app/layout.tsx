import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

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
      <body className="bg-[#121212] text-zinc-100 min-h-screen flex flex-col font-sans campus-grid-bg antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
