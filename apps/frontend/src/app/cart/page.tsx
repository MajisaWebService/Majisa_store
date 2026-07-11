'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@majistyle/utils';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [couponCode, setCouponCode] = useState('');
  const [discountInfo, setDiscountInfo] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from API
  const fetchCart = async () => {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3002/api/v1/cart?cartId=${cartId}`);
      const data = await res.json();
      setCart(data);
    } catch (e) {
      console.error('Failed to fetch cart:', e);
      // Fallback mockup local cart data
      setCart({
        id: cartId,
        items: [
          {
            id: 'mock-item-1',
            productVariantId: 'var-default-id',
            quantity: 1,
            productVariant: {
              color: 'WHITE',
              size: 'L',
              price: 499.00,
              product: {
                name: 'Classic Crewneck T-Shirt',
                imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
              }
            },
            customDesign: {
              id: 'mock-design-id',
              previewUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
            }
          }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: string, newQty: number) => {
    try {
      await fetch(`http://localhost:3002/api/v1/cart/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }),
      });
      fetchCart();
    } catch (e) {
      // Local mockup sync
      setCart((prev: any) => {
        if (!prev) return null;
        const updatedItems = prev.items.map((item: any) => {
          if (item.id === itemId) {
            return { ...item, quantity: newQty };
          }
          return item;
        }).filter((item: any) => item.quantity > 0);
        return { ...prev, items: updatedItems };
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await fetch(`http://localhost:3002/api/v1/cart/items/${itemId}`, {
        method: 'DELETE',
      });
      fetchCart();
    } catch (e) {
      // Local mockup sync
      setCart((prev: any) => {
        if (!prev) return null;
        return { ...prev, items: prev.items.filter((i: any) => i.id !== itemId) };
      });
    }
  };

  // Calculate pricing
  const subtotal = cart?.items?.reduce((sum: number, item: any) => {
    return sum + (item.productVariant?.price || 499.00) * item.quantity;
  }, 0) || 0;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponError('');

    try {
      const res = await fetch(`http://localhost:3002/api/v1/coupons/validate?code=${couponCode}&orderValue=${subtotal}`);
      const data = await res.json();

      if (res.ok) {
        setDiscountInfo(data);
      } else {
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch (e) {
      // Mock validation
      if (couponCode.toUpperCase() === 'WELCOME10') {
        setDiscountInfo({
          code: 'WELCOME10',
          discountType: 'PERCENT',
          discountValue: 10,
        });
      } else if (couponCode.toUpperCase() === 'MAJISTYLE150' && subtotal >= 999) {
        setDiscountInfo({
          code: 'MAJISTYLE150',
          discountType: 'FIXED',
          discountValue: 150,
        });
      } else {
        setCouponError('Invalid coupon code or order value too low.');
      }
    }
  };

  let discountAmount = 0;
  if (discountInfo) {
    if (discountInfo.discountType === 'PERCENT') {
      discountAmount = Math.round((subtotal * discountInfo.discountValue) / 100);
    } else {
      discountAmount = Math.min(discountInfo.discountValue, subtotal);
    }
  }

  const finalTotal = subtotal - discountAmount;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-gray-400">Loading your shopping cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
        <h2 className="text-3xl font-extrabold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-400 mb-8">Ready to design something amazing?</p>
        <Link href="/customize" className="px-6 py-3 rounded-lg text-sm font-bold bg-brand-gradient hover:opacity-95 shadow-md">
          Start Customizing
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex flex-col lg:flex-row gap-8">
      {/* Items list */}
      <div className="lg:w-2/3 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        
        {cart.items.map((item: any) => (
          <div key={item.id} className="glass p-6 rounded-2xl border border-white/5 flex gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 bg-slate-900 border border-white/10 rounded-xl overflow-hidden relative flex items-center justify-center">
                <img 
                  src={item.customDesign?.previewUrl || item.productVariant?.product?.imageUrl} 
                  alt="tshirt preview" 
                  className="object-contain max-h-16" 
                />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">{item.productVariant?.product?.name}</h4>
                <p className="text-xs text-gray-400">
                  {item.productVariant?.color} / Size {item.productVariant?.size} 
                  {item.customDesignId && <span className="text-brand-orange ml-2 font-semibold">• Customized</span>}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 rounded bg-white/5 border border-white/10 text-xs hover:bg-white/10 flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold">{item.quantity}</span>
                  <button 
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded bg-white/5 border border-white/10 text-xs hover:bg-white/10 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="text-right flex flex-col gap-2">
              <span className="font-bold text-brand-cyan text-base">
                {formatPrice((item.productVariant?.price || 499.00) * item.quantity)}
              </span>
              <button 
                onClick={() => handleRemoveItem(item.id)}
                className="text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary card */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
          <h3 className="text-lg font-bold">Order Summary</h3>

          {/* Coupon inputs */}
          <div className="border-b border-white/10 pb-4">
            <label className="text-xs text-gray-400 block mb-2 font-semibold">Apply Discount Coupon</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="WELCOME10"
                className="flex-grow bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan uppercase"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-brand-gradient hover:opacity-95 text-xs font-bold rounded-lg text-white"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-[10px] text-red-400 mt-2 font-semibold">❌ {couponError}</p>}
            {discountInfo && (
              <p className="text-[10px] text-brand-cyan mt-2 font-semibold">
                ✓ Coupon {discountInfo.code} applied: -{discountInfo.discountType === 'PERCENT' ? `${discountInfo.discountValue}%` : formatPrice(discountInfo.discountValue)}
              </p>
            )}
          </div>

          <div className="flex justify-between text-sm text-gray-400">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-brand-cyan">
              <span>Coupon Discount</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm text-gray-400">
            <span>Shipping</span>
            <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-wide bg-emerald-950/40 px-2 py-0.5 rounded">Free</span>
          </div>

          <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-white text-lg">
            <span>Order Total</span>
            <span className="text-gradient">{formatPrice(finalTotal)}</span>
          </div>

          <button
            onClick={() => {
              // Redirect to checkout with applied coupon info
              const url = `/checkout?coupon=${discountInfo?.code || ''}`;
              router.push(url);
            }}
            className="w-full py-3.5 bg-brand-gradient hover:opacity-95 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
