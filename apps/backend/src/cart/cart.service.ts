import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async findCart(cartId: string) {
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
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  async getOrCreateCart(userId: string | null, guestCartId?: string) {
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

  async addToCart(cartId: string, data: { variantId: string; customDesignId?: string; quantity: number }) {
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

  async updateQuantity(itemId: string, quantity: number) {
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

  async removeItem(itemId: string) {
    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async mergeCarts(guestCartId: string, userId: string) {
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
}
