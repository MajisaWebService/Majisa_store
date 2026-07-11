'use client';

import React, { useState, useEffect } from 'react';
import { formatPrice } from '@majistyle/utils';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENT' | 'FIXED'>('PERCENT');
  const [discountValue, setDiscountValue] = useState('10');
  const [minOrderValue, setMinOrderValue] = useState('200');
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [maxUses, setMaxUses] = useState('500');

  const fetchCoupons = async () => {
    try {
      const res = await fetch('http://localhost:3002/api/v1/coupons');
      const data = await res.json();
      setCoupons(data);
    } catch (e) {
      console.error(e);
      // Fallback mocks
      setCoupons([
        {
          id: 'coupon-1',
          code: 'WELCOME10',
          discountType: 'PERCENT',
          discountValue: 10,
          minOrderValue: 200,
          expiryDate: '2027-12-31T23:59:59Z',
          usedCount: 15,
          maxUses: 500,
          isActive: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code,
      discountType,
      discountValue: parseFloat(discountValue),
      minOrderValue: parseFloat(minOrderValue),
      expiryDate: new Date(expiryDate).toISOString(),
      maxUses: parseInt(maxUses, 10),
    };

    try {
      const res = await fetch('http://localhost:3002/api/v1/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert('Coupon created successfully!');
        fetchCoupons();
        setCode('');
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to create coupon');
      }
    } catch (err) {
      alert('Mock coupon created successfully!');
      setCoupons(prev => [...prev, { id: `mock-${Date.now()}`, code: code.toUpperCase(), discountType, discountValue: parseFloat(discountValue), minOrderValue: parseFloat(minOrderValue), expiryDate, usedCount: 0, maxUses: parseInt(maxUses, 10), isActive: true }]);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3002/api/v1/coupons/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Coupon deleted successfully!');
        fetchCoupons();
      }
    } catch (e) {
      setCoupons(prev => prev.filter(c => c.id !== id));
      alert('Coupon deleted locally.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-gray-400">Loading coupons...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex flex-col lg:flex-row gap-8">
      {/* Coupon List */}
      <div className="lg:w-2/3">
        <h2 className="text-2xl font-bold mb-6">Active Coupons</h2>
        <div className="glass rounded-3xl overflow-hidden border border-white/5">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-gray-400 font-semibold">
                <th className="p-4">Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Usage</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono font-bold text-white">{c.code}</td>
                  <td className="p-4 font-semibold text-brand-cyan">
                    {c.discountType === 'PERCENT' ? `${c.discountValue}%` : formatPrice(c.discountValue)}
                  </td>
                  <td className="p-4 text-gray-300">{formatPrice(c.minOrderValue)}</td>
                  <td className="p-4 text-xs text-gray-400">
                    {c.usedCount} / {c.maxUses} uses
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="text-xs text-red-400 hover:text-red-300 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon form */}
      <div className="lg:w-1/3">
        <h2 className="text-2xl font-bold mb-6">Create Coupon</h2>
        <form onSubmit={handleCreateCoupon} className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Coupon Code</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan uppercase"
              placeholder="e.g. DISCOUNT20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none"
              >
                <option value="PERCENT">Percent (%)</option>
                <option value="FIXED">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Value</label>
              <input
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Min Order (INR)</label>
              <input
                type="number"
                required
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Max Uses</label>
              <input
                type="number"
                required
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Expiry Date</label>
            <input
              type="date"
              required
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-gradient hover:opacity-95 text-white font-bold rounded-xl transition-all mt-4"
          >
            Create Coupon
          </button>
        </form>
      </div>
    </div>
  );
}
