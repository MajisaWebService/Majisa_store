export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export type TShirtColor = 'WHITE' | 'BLACK' | 'NAVY' | 'GRAY' | 'RED' | 'BLUE' | 'GREEN';
export type TShirtSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string; // Default preview image
  categoryId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  variants?: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  color: TShirtColor;
  size: TShirtSize;
  price: number; // Final price if overrides basePrice
  stock: number;
  sku: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomDesignElement {
  type: 'text' | 'image';
  id: string;
  x: number; // percentage coordinate 0-100 or canvas pixels
  y: number;
  width: number;
  height: number;
  rotation: number; // degrees
  
  // Text specific
  text?: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  
  // Image specific
  url?: string;
}

export interface CustomDesignConfig {
  front: CustomDesignElement[];
  back: CustomDesignElement[];
}

export interface CustomDesign {
  id: string;
  userId: string | null;
  baseProductId: string;
  selectedColor: TShirtColor;
  selectedSize: TShirtSize;
  config: CustomDesignConfig; // JSON of text and logo coordinates
  previewUrl: string; // generated thumbnail data URL or saved image URL
  createdAt: Date;
}

export interface CartItemDto {
  variantId: string;
  quantity: number;
  customDesignId?: string; // Optional if this is a customized item
}

export interface CartItem {
  id: string;
  cartId: string;
  productVariantId: string;
  customDesignId: string | null;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  productVariant?: ProductVariant & { product: Product };
  customDesign?: CustomDesign | null;
}

export interface Cart {
  id: string;
  userId: string | null;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 'PENDING' | 'PRINTING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  productVariantId: string;
  customDesignId: string | null;
  quantity: number;
  price: number;
  productVariant?: ProductVariant & { product: Product };
  customDesign?: CustomDesign | null;
}

export interface Order {
  id: string;
  userId: string | null;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  couponCode: string | null;
  fullName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  city: string;
  state: string;
  zipCode: string;
  trackingNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  expiryDate: Date;
  isActive: boolean;
  maxUses: number;
  usedCount: number;
}
