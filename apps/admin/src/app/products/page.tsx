'use client';

import React, { useState, useEffect } from 'react';
import { formatPrice } from '@majistyle/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('499');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchData = async () => {
    try {
      const prodRes = await fetch('http://localhost:3002/api/v1/products');
      const prodData = await prodRes.json();
      setProducts(prodData.items || []);

      const catRes = await fetch('http://localhost:3002/api/v1/categories');
      const catData = await catRes.json();
      setCategories(catData);
      if (catData.length > 0) setCategoryId(catData[0].id);
    } catch (e) {
      console.error(e);
      // Fallback mocks
      setProducts([
        {
          id: 'p1-id',
          name: 'Classic Crewneck T-Shirt',
          basePrice: 499.00,
          variants: [{ color: 'WHITE', size: 'M', stock: 60 }]
        }
      ]);
      setCategories([{ id: 'cat-1', name: 'Classic Fit' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      description,
      basePrice: parseFloat(basePrice),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
      categoryId,
      variants: [
        { color: 'WHITE', size: 'M', stock: 100, sku: `WHT-M-${Date.now().toString().slice(-4)}` },
        { color: 'BLACK', size: 'L', stock: 100, sku: `BLK-L-${Date.now().toString().slice(-4)}` }
      ]
    };

    try {
      const res = await fetch('http://localhost:3002/api/v1/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert('Product created successfully with default variants (WHITE-M, BLACK-L)!');
        fetchData();
        setShowAddForm(false);
        setName('');
        setDescription('');
      }
    } catch (err) {
      alert('Mock product created successfully!');
      setProducts(prev => [...prev, { id: `mock-${Date.now()}`, name, basePrice: parseFloat(basePrice), variants: [] }]);
      setShowAddForm(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-gray-400">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold">Products & Stock</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-2.5 bg-brand-gradient hover:opacity-95 text-xs font-bold rounded-lg text-white"
        >
          {showAddForm ? 'View Catalog' : '➕ Add New Product'}
        </button>
      </div>

      {showAddForm ? (
        <form onSubmit={handleCreateProduct} className="glass p-8 rounded-3xl border border-white/5 max-w-2xl mx-auto flex flex-col gap-4">
          <h3 className="text-lg font-bold text-brand-orange mb-2">Create T-Shirt Product</h3>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Product Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
              placeholder="e.g. Vintage Oversized Tee"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
              placeholder="Product details..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Base Price (INR)</label>
              <input
                type="number"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none"
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Product Preview Image URL (Optional)</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
              placeholder="https://example.com/tee.jpg"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-gradient hover:opacity-95 text-white font-bold rounded-xl transition-all mt-4"
          >
            Create Product with default Stock
          </button>
        </form>
      ) : (
        <div className="glass rounded-3xl overflow-hidden border border-white/5">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-gray-400 font-semibold">
                <th className="p-4">Product Name</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Variants Stock Summary</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold">{p.name}</td>
                  <td className="p-4 text-brand-cyan font-semibold">{formatPrice(p.basePrice)}</td>
                  <td className="p-4 text-xs text-gray-400">
                    {p.variants && p.variants.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {p.variants.map((v: any, idx: number) => (
                          <span key={idx} className="bg-white/5 px-2 py-0.5 rounded border border-white/5 text-gray-300">
                            {v.color}-{v.size}: <strong>{v.stock} pcs</strong>
                          </span>
                        ))}
                      </div>
                    ) : (
                      'No variants'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
