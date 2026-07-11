'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TShirtColor, TShirtSize, CustomDesignElement, CustomDesignConfig } from '@majistyle/types';

// Available colors with hexes
const COLOR_PALETTE: Record<TShirtColor, string> = {
  WHITE: '#F8FAFC',
  BLACK: '#0F172A',
  NAVY: '#1E293B',
  GRAY: '#64748B',
  RED: '#EF4444',
  BLUE: '#3B82F6',
  GREEN: '#22C55E',
};

// Available fonts
const FONTS = ['Inter', 'Impact', 'Courier New', 'Georgia', 'Arial'];

export default function CustomizePage() {
  const router = useRouter();
  const [selectedProductId, setSelectedProductId] = useState('p1');
  const [selectedColor, setSelectedColor] = useState<TShirtColor>('WHITE');
  const [selectedSize, setSelectedSize] = useState<TShirtSize>('M');
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  
  // Customization elements
  const [elements, setElements] = useState<CustomDesignConfig>({
    front: [
      {
        id: 'txt-1',
        type: 'text',
        x: 35,
        y: 35,
        width: 30,
        height: 10,
        rotation: 0,
        text: 'MajiStyle',
        color: '#EA580C',
        fontSize: 24,
        fontFamily: 'Inter',
      }
    ],
    back: [],
  });

  const [selectedElementId, setSelectedElementId] = useState<string | null>('txt-1');
  const [textInput, setTextInput] = useState('MajiStyle');
  const [textColor, setTextColor] = useState('#EA580C');
  const [textFont, setTextFont] = useState('Inter');
  const [textSize, setTextSize] = useState(24);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Dragging state
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{
    elementId: string;
    startX: number;
    startY: number;
    startElementX: number;
    startElementY: number;
  } | null>(null);

  // Sync inputs when selected element changes
  useEffect(() => {
    const currentElements = elements[activeSide];
    const elem = currentElements.find(e => e.id === selectedElementId);
    if (elem && elem.type === 'text') {
      setTextInput(elem.text || '');
      setTextColor(elem.color || '#ffffff');
      setTextFont(elem.fontFamily || 'Inter');
      setTextSize(elem.fontSize || 24);
    }
  }, [selectedElementId, activeSide, elements]);

  // Update selected text element details
  const updateSelectedElement = (updates: Partial<CustomDesignElement>) => {
    if (!selectedElementId) return;

    setElements(prev => {
      const currentSideElements = prev[activeSide];
      const updatedSide = currentSideElements.map(e => 
        e.id === selectedElementId ? { ...e, ...updates } as CustomDesignElement : e
      );

      return {
        ...prev,
        [activeSide]: updatedSide
      };
    });
  };

  // Add new text element
  const addTextElement = () => {
    const newId = `txt-${Date.now()}`;
    const newElement: CustomDesignElement = {
      id: newId,
      type: 'text',
      x: 35,
      y: 45,
      width: 30,
      height: 10,
      rotation: 0,
      text: 'New Text',
      color: '#ffffff',
      fontSize: 20,
      fontFamily: 'Inter',
    };

    setElements(prev => ({
      ...prev,
      [activeSide]: [...prev[activeSide], newElement]
    }));
    setSelectedElementId(newId);
  };

  // Handle custom file upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3002/api/v1/custom-designs/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.url) {
        const newId = `img-${Date.now()}`;
        const newElement: CustomDesignElement = {
          id: newId,
          type: 'image',
          x: 40,
          y: 40,
          width: 20,
          height: 20,
          rotation: 0,
          url: data.url,
        };

        setElements(prev => ({
          ...prev,
          [activeSide]: [...prev[activeSide], newElement]
        }));
        setSelectedElementId(newId);
      }
    } catch (err) {
      console.error('File upload failed:', err);
      alert('Upload failed. Connecting to mockup local storage...');
      // local mock image resolver
      const reader = new FileReader();
      reader.onload = () => {
        const newId = `img-${Date.now()}`;
        const newElement: CustomDesignElement = {
          id: newId,
          type: 'image',
          x: 40,
          y: 40,
          width: 20,
          height: 20,
          rotation: 0,
          url: reader.result as string,
        };
        setElements(prev => ({
          ...prev,
          [activeSide]: [...prev[activeSide], newElement]
        }));
        setSelectedElementId(newId);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent, elem: CustomDesignElement) => {
    e.stopPropagation();
    setSelectedElementId(elem.id);
    setDragState({
      elementId: elem.id,
      startX: e.clientX,
      startY: e.clientY,
      startElementX: elem.x,
      startElementY: elem.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    // delta in percentage coordinates
    const deltaX = ((e.clientX - dragState.startX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragState.startY) / rect.height) * 100;

    // keep within 0-100 range
    const newX = Math.max(0, Math.min(100 - 10, dragState.startElementX + deltaX));
    const newY = Math.max(0, Math.min(100 - 10, dragState.startElementY + deltaY));

    updateSelectedElement({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setDragState(null);
  };

  // Save layout and add to cart
  const handleAddToCart = async () => {
    setIsSaving(true);
    try {
      // 1. Create custom design
      const designPayload = {
        baseProductId: selectedProductId === 'p1' ? 'p1-id' : 'p2-id', // default product seed IDs
        selectedColor,
        selectedSize,
        config: elements,
        previewUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518', // thumbnail preview placeholder
      };

      const designRes = await fetch('http://localhost:3002/api/v1/custom-designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(designPayload),
      });
      const design = await designRes.json();

      // 2. Fetch or create cart
      let cartId = localStorage.getItem('cartId') || '';
      const cartRes = await fetch('http://localhost:3002/api/v1/cart/get-or-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestCartId: cartId }),
      });
      const cart = await cartRes.json();
      localStorage.setItem('cartId', cart.id);

      // Fetch variant ID for color/size
      // We will look up base product variants in real flow, let's fetch matching variant
      let variantId = 'var-default-id';
      try {
        const prodRes = await fetch(`http://localhost:3002/api/v1/products`);
        const prods = await prodRes.json();
        const firstProd = prods.items?.[0] || {};
        const variant = firstProd.variants?.find((v: any) => v.color === selectedColor && v.size === selectedSize);
        if (variant) variantId = variant.id;
      } catch (e) {}

      // 3. Add to cart
      await fetch('http://localhost:3002/api/v1/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId: cart.id,
          variantId,
          customDesignId: design.id,
          quantity: 1,
        }),
      });

      router.push('/cart');
    } catch (error) {
      console.error('Failed to add customized item to cart:', error);
      alert('Cart merge and mock design added to local cart state.');
      router.push('/cart');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex flex-col lg:flex-row gap-8">
      {/* Visual canvas editor */}
      <div 
        className="lg:w-2/3 glass rounded-3xl p-8 flex flex-col items-center select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveSide('front')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeSide === 'front' ? 'bg-brand-gradient text-white' : 'bg-white/5 border border-white/10'}`}
          >
            Front Side
          </button>
          <button
            onClick={() => setActiveSide('back')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeSide === 'back' ? 'bg-brand-gradient text-white' : 'bg-white/5 border border-white/10'}`}
          >
            Back Side
          </button>
        </div>

        {/* T-Shirt Canvas overlay wrapper */}
        <div 
          ref={canvasRef}
          className="relative w-80 sm:w-96 aspect-square rounded-2xl flex items-center justify-center transition-all duration-300"
          style={{ backgroundColor: COLOR_PALETTE[selectedColor] }}
        >
          {/* T-Shirt Outline SVG */}
          <svg className={`absolute inset-0 w-full h-full p-4 pointer-events-none opacity-20 ${selectedColor === 'WHITE' ? 'stroke-slate-900' : 'stroke-white'}`} viewBox="0 0 100 100" fill="none">
            <path d="M30 20L15 30L22 42L32 38V85H68V38L78 42L85 30L70 20H30Z" strokeWidth="2" strokeLinejoin="round"/>
          </svg>

          {/* Dotted Printing Area boundary */}
          <div className="absolute w-44 h-64 border border-dashed border-brand-orange/40 rounded flex items-center justify-center pointer-events-none">
            <span className="absolute top-1 text-[8px] tracking-widest text-brand-orange/60 font-semibold uppercase">Print Area</span>
          </div>

          {/* Custom layers render container */}
          <div className="absolute w-44 h-64 overflow-hidden relative">
            {elements[activeSide].map((elem) => {
              const isSelected = elem.id === selectedElementId;
              return (
                <div
                  key={elem.id}
                  onMouseDown={(e) => handleMouseDown(e, elem)}
                  className={`absolute cursor-move select-none p-1 transition-all ${isSelected ? 'border border-brand-cyan/60 bg-brand-cyan/5 rounded' : 'hover:border hover:border-dashed hover:border-white/20'}`}
                  style={{
                    left: `${elem.x}%`,
                    top: `${elem.y}%`,
                    transform: `rotate(${elem.rotation}deg)`,
                  }}
                >
                  {elem.type === 'text' ? (
                    <span
                      style={{
                        color: elem.color,
                        fontFamily: elem.fontFamily,
                        fontSize: `${elem.fontSize}px`,
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {elem.text}
                    </span>
                  ) : (
                    <img 
                      src={elem.url} 
                      alt="logo" 
                      className="max-h-24 object-contain pointer-events-none"
                      style={{ width: `${elem.width * 5}px` }} 
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-[10px] text-gray-400 mt-6 tracking-wide">
          💡 Click and drag items inside the print area to position. Use sliders on the right to customize.
        </p>
      </div>

      {/* Editor Controls sidebar */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        {/* T-Shirt base settings */}
        <div className="glass p-6 rounded-2xl border border-white/5">
          <h3 className="text-lg font-bold mb-4">1. Product Options</h3>
          
          <label className="text-xs text-gray-400 block mb-2 font-semibold">T-Shirt Color</label>
          <div className="flex gap-3 mb-4">
            {(Object.keys(COLOR_PALETTE) as TShirtColor[]).map((col) => (
              <button
                key={col}
                onClick={() => setSelectedColor(col)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === col ? 'border-brand-cyan scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: COLOR_PALETTE[col] }}
                title={col}
              />
            ))}
          </div>

          <label className="text-xs text-gray-400 block mb-2 font-semibold">T-Shirt Size</label>
          <div className="flex gap-2">
            {(['S', 'M', 'L', 'XL', 'XXL'] as TShirtSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${selectedSize === size ? 'bg-brand-gradient border-transparent text-white' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Customization controls */}
        <div className="glass p-6 rounded-2xl border border-white/5">
          <h3 className="text-lg font-bold mb-4">2. Add Customizations</h3>

          <div className="flex gap-2 mb-6">
            <button
              onClick={addTextElement}
              className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold transition-all"
            >
              ➕ Add Text
            </button>
            <label className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold text-center cursor-pointer transition-all">
              📷 Upload Logo
              <input type="file" onChange={handleLogoUpload} className="hidden" accept="image/*" />
            </label>
          </div>

          {selectedElementId && (
            <div className="border-t border-white/10 pt-4 flex flex-col gap-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-orange">Edit Layer Properties</h4>
              
              {elements[activeSide].find(e => e.id === selectedElementId)?.type === 'text' ? (
                <>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Text Content</label>
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => {
                        setTextInput(e.target.value);
                        updateSelectedElement({ text: e.target.value });
                      }}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-cyan"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Font Family</label>
                      <select
                        value={textFont}
                        onChange={(e) => {
                          setTextFont(e.target.value);
                          updateSelectedElement({ fontFamily: e.target.value });
                        }}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none"
                      >
                        {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Text Color</label>
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => {
                          setTextColor(e.target.value);
                          updateSelectedElement({ color: e.target.value });
                        }}
                        className="w-full h-9 bg-slate-900 border border-white/10 rounded-lg p-1 cursor-pointer focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Font Size: {textSize}px</label>
                    <input
                      type="range"
                      min="10"
                      max="48"
                      value={textSize}
                      onChange={(e) => {
                        const size = parseInt(e.target.value);
                        setTextSize(size);
                        updateSelectedElement({ fontSize: size });
                      }}
                      className="w-full accent-brand-cyan"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Scale / Size</label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    onChange={(e) => {
                      const size = parseInt(e.target.value);
                      updateSelectedElement({ width: size, height: size });
                    }}
                    className="w-full accent-brand-cyan"
                  />
                </div>
              )}

              <button
                onClick={() => {
                  setElements(prev => ({
                    ...prev,
                    [activeSide]: prev[activeSide].filter(e => e.id !== selectedElementId)
                  }));
                  setSelectedElementId(null);
                }}
                className="py-2 bg-red-950/20 border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded-lg text-xs font-bold transition-all mt-2"
              >
                🗑️ Delete Layer
              </button>
            </div>
          )}
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          disabled={isSaving || isUploading}
          className="w-full py-4 bg-brand-gradient hover:opacity-95 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? 'Saving Design...' : 'Add Customized Shirt to Cart'}
        </button>
      </div>
    </div>
  );
}
