import { OrdersService } from './orders.service';
import { OrderStatus } from '@prisma/client';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    create(body: any): Promise<{
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            quantity: number;
            customDesignId: string | null;
            productVariantId: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        userId: string | null;
        fullName: string;
        phone: string;
        city: string;
        state: string;
        zipCode: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        discountAmount: number;
        finalAmount: number;
        couponCode: string | null;
        shippingAddress: string;
        trackingNumber: string | null;
    }>;
    findOne(id: string): Promise<{
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
            price: number;
            quantity: number;
            customDesignId: string | null;
            productVariantId: string;
            orderId: string;
        })[];
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            status: string;
            amount: number;
            provider: string;
            transactionId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        userId: string | null;
        fullName: string;
        phone: string;
        city: string;
        state: string;
        zipCode: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        discountAmount: number;
        finalAmount: number;
        couponCode: string | null;
        shippingAddress: string;
        trackingNumber: string | null;
    }>;
    findUserOrders(userId: string, currentUserId: string): Promise<({
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
            price: number;
            quantity: number;
            customDesignId: string | null;
            productVariantId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        userId: string | null;
        fullName: string;
        phone: string;
        city: string;
        state: string;
        zipCode: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        discountAmount: number;
        finalAmount: number;
        couponCode: string | null;
        shippingAddress: string;
        trackingNumber: string | null;
    })[]>;
    findAllOrders(): Promise<({
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
            price: number;
            quantity: number;
            customDesignId: string | null;
            productVariantId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        userId: string | null;
        fullName: string;
        phone: string;
        city: string;
        state: string;
        zipCode: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        discountAmount: number;
        finalAmount: number;
        couponCode: string | null;
        shippingAddress: string;
        trackingNumber: string | null;
    })[]>;
    updateStatus(id: string, status: OrderStatus, trackingNumber?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        userId: string | null;
        fullName: string;
        phone: string;
        city: string;
        state: string;
        zipCode: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        discountAmount: number;
        finalAmount: number;
        couponCode: string | null;
        shippingAddress: string;
        trackingNumber: string | null;
    }>;
}
