"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findCart(cartId) {
        const cart = await this.prisma.cart.findUnique({
            where: { id: cartId },
            include: {
                items: {
                    include: {
                        productVariant: {
                            include: { product: true },
                        },
                        customDesign: true,
                    },
                },
            },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        return cart;
    }
    async getOrCreateCart(userId, guestCartId) {
        if (userId) {
            let cart = await this.prisma.cart.findUnique({
                where: { userId },
                include: {
                    items: {
                        include: {
                            productVariant: {
                                include: { product: true },
                            },
                            customDesign: true,
                        },
                    },
                },
            });
            if (!cart) {
                cart = await this.prisma.cart.create({
                    data: { userId },
                    include: {
                        items: {
                            include: {
                                productVariant: {
                                    include: { product: true },
                                },
                                customDesign: true,
                            },
                        },
                    },
                });
            }
            return cart;
        }
        if (guestCartId) {
            let cart = await this.prisma.cart.findUnique({
                where: { id: guestCartId },
                include: {
                    items: {
                        include: {
                            productVariant: {
                                include: { product: true },
                            },
                            customDesign: true,
                        },
                    },
                },
            });
            if (!cart) {
                cart = await this.prisma.cart.create({
                    data: {},
                    include: {
                        items: {
                            include: {
                                productVariant: {
                                    include: { product: true },
                                },
                                customDesign: true,
                            },
                        },
                    },
                });
            }
            return cart;
        }
        return this.prisma.cart.create({
            data: {},
            include: {
                items: {
                    include: {
                        productVariant: {
                            include: { product: true },
                        },
                        customDesign: true,
                    },
                },
            },
        });
    }
    async addToCart(cartId, data) {
        const existing = await this.prisma.cartItem.findFirst({
            where: {
                cartId,
                productVariantId: data.variantId,
                customDesignId: data.customDesignId || null,
            },
        });
        if (existing) {
            return this.prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: existing.quantity + data.quantity },
            });
        }
        return this.prisma.cartItem.create({
            data: {
                cartId,
                productVariantId: data.variantId,
                customDesignId: data.customDesignId || null,
                quantity: data.quantity,
            },
        });
    }
    async updateQuantity(itemId, quantity) {
        if (quantity <= 0) {
            return this.prisma.cartItem.delete({
                where: { id: itemId },
            });
        }
        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
        });
    }
    async removeItem(itemId) {
        return this.prisma.cartItem.delete({
            where: { id: itemId },
        });
    }
    async mergeCarts(guestCartId, userId) {
        const guestCart = await this.prisma.cart.findUnique({
            where: { id: guestCartId },
            include: { items: true },
        });
        if (!guestCart || guestCart.items.length === 0) {
            return this.getOrCreateCart(userId);
        }
        const userCart = await this.getOrCreateCart(userId);
        for (const item of guestCart.items) {
            await this.addToCart(userCart.id, {
                variantId: item.productVariantId,
                customDesignId: item.customDesignId || undefined,
                quantity: item.quantity,
            });
        }
        await this.prisma.cartItem.deleteMany({
            where: { cartId: guestCartId },
        });
        await this.prisma.cart.delete({
            where: { id: guestCartId },
        });
        return this.findCart(userCart.id);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map