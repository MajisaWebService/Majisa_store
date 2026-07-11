'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatPrice } from '@majistyle/utils';

const STATUS_STEPS = [
  { status: 'PENDING', label: 'Order Placed', desc: 'We have received your order details.' },
  { status: 'PRINTING', label: 'Printing & Crafting', desc: 'Your custom designs are being printed onto T-shirts.' },
  { status: 'SHIPPED', label: 'Shipped', desc: 'Your package is on its way. Tracking number generated.' },
  { status: 'DELIVERED', label: 'Delivered', desc: 'Package delivered at your doorstep.' },
];

function OrderTrackingPageContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('id') || '';

  const [searchId, setSearchId] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrder = async (id: string) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:3002/api/v1/orders/${id}`);
      const data = await res.json();
      if (res.ok) {
        setOrder(data);
      } else {
        setError(data.message || 'Order not found');
      }
    } catch (e) {
      setError('Order details fetched from mockup local store.');
      // Local mockup fallback
      setOrder({
        id,
        status: 'PRINTING',
        fullName: 'John Customer',
        shippingAddress: '123 Main St, Apartment 4B',
        city: 'Jodhpur',
        state: 'Rajasthan',
        zipCode: '342001',
        totalAmount: 499.00,
        discountAmount: 0.00,
        finalAmount: 499.00,
        trackingNumber: 'TRK-MAJI-2049281',
        items: [
          {
            id: 'item-1',
            quantity: 1,
            price: 499.00,
            productVariant: {
              color: 'WHITE',
              size: 'M',
              product: {
                name: 'Classic Crewneck T-Shirt',
                imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
              }
            }
          }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderIdParam) {
      fetchOrder(orderIdParam);
    }
  }, [orderIdParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId) {
      fetchOrder(searchId);
    }
  };

  const getStepIndex = (status: string) => {
    if (status === 'CANCELLED') return -1;
    return STATUS_STEPS.findIndex(step => step.status === status);
  };

  const currentStepIndex = order ? getStepIndex(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      <h2 className="text-3xl font-extrabold mb-8 text-center">Track Your Order</h2>

      {/* Lookup search bar */}
      <form onSubmit={handleSearch} className="glass p-6 rounded-2xl border border-white/5 flex gap-3 mb-10 max-w-lg mx-auto">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter Order ID (e.g. UUID)"
          className="flex-grow bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-brand-gradient hover:opacity-95 text-xs font-bold rounded-lg text-white"
        >
          Track
        </button>
      </form>

      {isLoading && <p className="text-center text-gray-400">Fetching order details...</p>}
      
      {error && <p className="text-center text-red-400 font-semibold mb-6">⚠️ {error}</p>}

      {order && (
        <div className="flex flex-col gap-8">
          {/* Tracking timeline */}
          <div className="glass p-8 rounded-3xl border border-white/5">
            <h3 className="text-lg font-bold mb-6 text-brand-cyan">Order Tracking Status</h3>

            {order.status === 'CANCELLED' ? (
              <div className="p-4 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl text-sm font-semibold">
                This order has been CANCELLED.
              </div>
            ) : (
              <div className="relative flex flex-col md:flex-row justify-between gap-6">
                {STATUS_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isActive = idx === currentStepIndex;
                  return (
                    <div key={step.status} className="flex-1 flex flex-col items-center md:items-start text-center md:text-left relative z-10">
                      <div className="flex items-center justify-center mb-4">
                        <div 
                          className={`w-8 h-8 rounded-full border-2 font-bold flex items-center justify-center text-xs transition-all ${
                            isCompleted ? 'bg-brand-gradient border-transparent text-white scale-110 shadow-md' : 'bg-slate-900 border-white/20 text-gray-500'
                          }`}
                        >
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                      </div>
                      <h4 className={`text-sm font-bold ${isActive ? 'text-brand-orange' : isCompleted ? 'text-white' : 'text-gray-500'}`}>
                        {step.label}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1 max-w-xs">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {order.trackingNumber && (
              <div className="border-t border-white/10 pt-6 mt-6 flex justify-between text-xs text-gray-400">
                <span>Shipping Carrier: <strong>MajiStyle Express</strong></span>
                <span>Tracking Number: <strong className="text-white">{order.trackingNumber}</strong></span>
              </div>
            )}
          </div>

          {/* Details & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Items */}
            <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
              <h3 className="text-base font-bold text-white mb-2">Order Items</h3>
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex gap-4 items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex gap-3 items-center">
                    <span className="text-lg">👕</span>
                    <div>
                      <span className="text-sm font-bold block">{item.productVariant?.product?.name}</span>
                      <span className="text-[10px] text-gray-400">
                        {item.productVariant?.color} / Size {item.productVariant?.size} (x{item.quantity})
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-brand-cyan">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}

              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Subtotal</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-xs text-brand-cyan">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-white text-base border-t border-white/10 pt-3">
                <span>Final Price</span>
                <span className="text-gradient">{formatPrice(order.finalAmount)}</span>
              </div>
            </div>

            {/* Address */}
            <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
              <h3 className="text-base font-bold text-white mb-2">Shipping Information</h3>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase font-semibold">Recipient</span>
                <span className="text-sm font-semibold">{order.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase font-semibold">Delivery Address</span>
                <span className="text-sm text-gray-300 leading-relaxed block">
                  {order.shippingAddress}, <br />
                  {order.city}, {order.state} - {order.zipCode}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Phone</span>
                  <span className="text-sm">{order.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Email</span>
                  <span className="text-sm break-all">{order.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <React.Suspense fallback={<div className="text-center py-10 text-gray-400">Loading tracking...</div>}>
      <OrderTrackingPageContent />
    </React.Suspense>
  );
}
