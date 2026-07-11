'use client';

import React, { useState, useEffect } from 'react';
import { formatPrice } from '@majistyle/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:3002/api/v1/analytics/dashboard-stats');
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
      // Fallback mock analytics stats
      setStats({
        totalRevenue: 34950.00,
        totalDiscount: 1200.00,
        totalOrders: 65,
        averageOrderValue: 537.69,
        colorStats: [
          { color: 'BLACK', qty: 25 },
          { color: 'WHITE', qty: 20 },
          { color: 'NAVY', qty: 12 },
          { color: 'RED', qty: 5 },
          { color: 'GRAY', qty: 3 },
        ],
        sizeStats: [
          { size: 'L', qty: 28 },
          { size: 'M', qty: 22 },
          { size: 'XL', qty: 10 },
          { size: 'S', qty: 5 },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-gray-400">Loading dashboard stats...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      <h2 className="text-3xl font-extrabold mb-8">Admin Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="glass p-6 rounded-2xl border border-white/5">
          <span className="text-xs text-gray-400 font-semibold block mb-2 uppercase">Total Revenue</span>
          <span className="text-3xl font-extrabold text-gradient">{formatPrice(stats.totalRevenue)}</span>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5">
          <span className="text-xs text-gray-400 font-semibold block mb-2 uppercase">Total Orders</span>
          <span className="text-3xl font-extrabold text-white">{stats.totalOrders}</span>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5">
          <span className="text-xs text-gray-400 font-semibold block mb-2 uppercase">Average Order Value</span>
          <span className="text-3xl font-extrabold text-brand-cyan">{formatPrice(stats.averageOrderValue)}</span>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5">
          <span className="text-xs text-gray-400 font-semibold block mb-2 uppercase">Total Discounts Given</span>
          <span className="text-3xl font-extrabold text-emerald-400">{formatPrice(stats.totalDiscount)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Color Popularity */}
        <div className="glass p-6 rounded-3xl border border-white/5">
          <h3 className="text-lg font-bold mb-6 text-brand-orange">Popular T-Shirt Colors (by Volume)</h3>
          <div className="flex flex-col gap-4">
            {stats.colorStats?.map((c: any) => {
              const maxQty = Math.max(...stats.colorStats.map((item: any) => item.qty));
              const pct = maxQty > 0 ? (c.qty / maxQty) * 100 : 0;
              return (
                <div key={c.color} className="flex items-center justify-between gap-4">
                  <span className="w-16 text-xs font-bold text-gray-300">{c.color}</span>
                  <div className="flex-grow bg-slate-900 h-3 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-brand-gradient h-full rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-semibold text-white">{c.qty}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Size Popularity */}
        <div className="glass p-6 rounded-3xl border border-white/5">
          <h3 className="text-lg font-bold mb-6 text-brand-rose">Popular T-Shirt Sizes (by Volume)</h3>
          <div className="flex flex-col gap-4">
            {stats.sizeStats?.map((s: any) => {
              const maxQty = Math.max(...stats.sizeStats.map((item: any) => item.qty));
              const pct = maxQty > 0 ? (s.qty / maxQty) * 100 : 0;
              return (
                <div key={s.size} className="flex items-center justify-between gap-4">
                  <span className="w-16 text-xs font-bold text-gray-300">Size {s.size}</span>
                  <div className="flex-grow bg-slate-900 h-3 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-brand-gradient h-full rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-semibold text-white">{s.qty}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
