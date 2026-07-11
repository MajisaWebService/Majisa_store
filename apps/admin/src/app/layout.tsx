import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MajiStyle | Admin Dashboard',
  description: 'MajiStyle Admin Control Panel',
};

export default function AdminLayout({
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
              <span className="text-xl font-bold tracking-tight">
                <span className="text-gradient">Maji</span>
                <span className="text-white">Style</span>
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-brand-orange/20 text-brand-orange uppercase border border-brand-orange/20">Admin</span>
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="/" className="hover:text-brand-orange transition-colors">Dashboard</Link>
              <Link href="/products" className="hover:text-brand-orange transition-colors">Products</Link>
              <Link href="/orders" className="hover:text-brand-orange transition-colors">Orders</Link>
              <Link href="/coupons" className="hover:text-brand-orange transition-colors">Coupons</Link>
            </nav>

            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400">admin@majistyle.com</span>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
