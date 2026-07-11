import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MajiStyle | Premium Customized T-Shirts',
  description: 'Design your own premium custom T-shirt online. Upload custom logos, text, choose colors and sizes with instant previews.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-brand-dark text-white min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 15C52.5 15 54 17.5 52 20C50 22.5 44 26 48 30H52" stroke="url(#logo-grad)" strokeWidth="4" strokeLinecap="round"/>
                <path d="M30 30L15 40L25 50L35 45V80H65V45L75 50L85 40L70 30H30Z" stroke="url(#logo-grad)" strokeWidth="4" strokeLinejoin="round" fill="rgba(30,41,59,0.5)"/>
                <path d="M48 60L55 45L62 52L55 67L48 60Z" fill="url(#logo-grad)"/>
                <path d="M48 60L44 64L48 60Z" stroke="white" strokeWidth="2"/>
                <path d="M35 85C45 80 55 90 65 85" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#EA580C" />
                    <stop offset="100%" stopColor="#E11D48" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-gradient">Maji</span>
                  <span className="text-white">Style</span>
                </span>
                <span className="text-[8px] tracking-widest text-gray-400 uppercase -mt-1 font-semibold">Customized For You</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
              <Link href="/customize" className="hover:text-brand-orange transition-colors bg-brand-gradient px-4 py-1.5 rounded-full text-white font-semibold">Customize Now</Link>
              <Link href="/cart" className="hover:text-brand-orange transition-colors">Cart</Link>
              <Link href="/orders" className="hover:text-brand-orange transition-colors">Track Order</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium hover:text-brand-orange transition-colors">Log In</Link>
              <Link href="/register" className="hidden sm:inline-block text-sm font-medium border border-white/20 hover:border-brand-orange hover:text-brand-orange transition-all px-4 py-1.5 rounded-full">Sign Up</Link>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-brand-dark/80 border-t border-white/5 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-lg">MajiStyle</span>
              <span>— A Brand By Majisa</span>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
            </div>
            <div>
              &copy; {new Date().getFullYear()} MajiStyle. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
