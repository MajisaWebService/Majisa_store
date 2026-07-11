import { CartService } from './cart.service';
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
    findCart(cartId: string): Promise<{
        items: ({
            productVariant: {
                product: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    description: string;
                    basePrice: number;
                    imageUrl: string;
                    isActive: boolean;
                    categoryId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                color: string;
                size: string;
                price: number;
                stock: number;
                sku: string;
                productId: string;
            };
            customDesign: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string | null;
                baseProductId: string;
                selectedColor: string;
                selectedSize: string;
                config: import("@prisma/client/runtime/library").JsonValue;
                previewUrl: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            cartId: string;
            customDesignId: string | null;
            productVariantId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
    }>;
    getOrCreateCart(body: {
        userId?: string | null;
        guestCartId?: string;
    }): Promise<{
        items: ({
            productVariant: {
                product: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    description: string;
                    basePrice: number;
                    imageUrl: string;
                    isActive: boolean;
                    categoryId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                color: string;
                size: string;
                price: number;
                stock: number;
                sku: string;
                productId: string;
            };
            customDesign: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string | null;
                baseProductId: string;
                selectedColor: string;
                selectedSize: string;
                config: import("@prisma/client/runtime/library").JsonValue;
                previewUrl: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            cartId: string;
            customDesignId: string | null;
            productVariantId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
    }>;
    addToCart(body: {
        cartId: string;
        variantId: string;
        customDesignId?: string;
        quantity: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        cartId: string;
        customDesignId: string | null;
        productVariantId: string;
    }>;
    updateQuantity(itemId: string, quantity: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        cartId: string;
        customDesignId: string | null;
        productVariantId: string;
    }>;
    removeItem(itemId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        cartId: string;
        customDesignId: string | null;
        productVariantId: string;
    }>;
    mergeCarts(body: {
        guestCartId: string;
        userId: string;
    }): Promise<{
        items: ({
            productVariant: {
                product: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    description: string;
                    basePrice: number;
                    imageUrl: string;
                    isActive: boolean;
                    categoryId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                color: string;
                size: string;
                price: number;
                stock: number;
                sku: string;
                productId: string;
            };
            customDesign: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string | null;
                baseProductId: string;
                selectedColor: string;
                selectedSize: string;
                config: import("@prisma/client/runtime/library").JsonValue;
                previewUrl: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            cartId: string;
            customDesignId: string | null;
            productVariantId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
    }>;
}
