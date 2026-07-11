'use client';

import React, { useState, useEffect } from 'react';
import { formatPrice } from '@majistyle/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:3002/api/v1/orders/admin/all');
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
      // Mock fallback orders
      setOrders([
        {
          id: 'order-101',
          fullName: 'John Customer',
          email: 'customer@example.com',
          phone: '+91 98765 43210',
          shippingAddress: '123 Main St, Apartment 4B',
          city: 'Jodhpur',
          state: 'Rajasthan',
          zipCode: '342001',
          totalAmount: 499.00,
          discountAmount: 0.00,
          finalAmount: 499.00,
          status: 'PRINTING',
          trackingNumber: '',
          createdAt: new Date().toISOString(),
          items: [
            {
              id: 'item-1',
              quantity: 1,
              price: 499.00,
              productVariant: {
                color: 'WHITE',
                size: 'M',
                product: { name: 'Classic Crewneck T-Shirt' }
              },
              customDesign: {
                selectedColor: 'WHITE',
                selectedSize: 'M',
                config: {
                  front: [{ type: 'text', text: 'MajiStyle', color: '#EA580C', fontSize: 24, fontFamily: 'Inter' }],
                  back: []
                }
              }
            }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:3002/api/v1/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber }),
      });
      if (res.ok) {
        alert('Order status updated!');
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (e) {
      // Mock local update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, trackingNumber } : o));
      alert('Order status updated locally (mock mode).');
      setSelectedOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-gray-400">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex flex-col lg:flex-row gap-8">
      {/* Orders List */}
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-6">Order Processing</h2>
        <div className="glass rounded-3xl overflow-hidden border border-white/5">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-gray-400 font-semibold">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-xs">{o.id}</td>
                  <td className="p-4">
                    <span className="font-bold block">{o.fullName}</span>
                    <span className="text-[10px] text-gray-400">{o.email}</span>
                  </td>
                  <td className="p-4 font-semibold text-brand-cyan">{formatPrice(o.finalAmount)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      o.status === 'PENDING' ? 'bg-amber-950/40 text-amber-400 border border-amber-500/20' :
                      o.status === 'PRINTING' ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-500/20' :
                      o.status === 'SHIPPED' ? 'bg-blue-950/40 text-blue-400 border border-blue-500/20' :
                      'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedOrder(o);
                        setTrackingNumber(o.trackingNumber || '');
                      }}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold"
                    >
                      Process / Specs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Order Sidebar */}
      {selectedOrder && (
        <div className="lg:w-96 glass p-6 rounded-3xl border border-white/10 flex flex-col gap-6 h-fit shrink-0">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Process Order</h3>
            <button onClick={() => setSelectedOrder(null)} className="text-xs text-gray-400 hover:text-white">✕ Close</button>
          </div>

          <div className="border-t border-white/10 pt-4 flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-orange">1. Production Specifications</h4>
            
            {selectedOrder.items?.map((item: any) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-900 border border-white/10 text-xs">
                <span className="font-bold block mb-1 text-white">{item.productVariant?.product?.name}</span>
                <div className="grid grid-cols-2 gap-2 text-gray-400 mb-2">
                  <span>Color: <strong className="text-white">{item.productVariant?.color}</strong></span>
                  <span>Size: <strong className="text-white">{item.productVariant?.size}</strong></span>
                  <span>Quantity: <strong className="text-white">{item.quantity}</strong></span>
                </div>
                
                {item.customDesign && (
                  <div className="border-t border-white/5 pt-2 mt-2">
                    <span className="font-semibold block text-brand-cyan mb-1">Canvas Printing Specs:</span>
                    <pre className="bg-slate-950 p-2 rounded text-[10px] font-mono overflow-auto max-h-24 text-gray-300">
                      {JSON.stringify(item.customDesign.config, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-orange">2. Shipping Address</h4>
            <div className="text-xs text-gray-300 leading-relaxed">
              <strong>{selectedOrder.fullName}</strong> <br />
              {selectedOrder.shippingAddress}, <br />
              {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.zipCode} <br />
              Phone: {selectedOrder.phone}
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-orange">3. Update Status</h4>
            
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. TRK-MAJI-1002"
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-cyan"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, 'PRINTING')}
                className="py-2 bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-bold"
              >
                Start Print
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, 'SHIPPED')}
                className="py-2 bg-blue-950/40 border border-blue-500/20 text-blue-400 rounded-lg text-[10px] font-bold"
              >
                Ship
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, 'DELIVERED')}
                className="py-2 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold"
              >
                Deliver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
