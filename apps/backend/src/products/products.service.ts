import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(categoryId?: string, search?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where: any = {
      deletedAt: null,
      isActive: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { variants: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: {
        variants: true,
        category: true,
        reviews: {
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(data: {
    name: string;
    description: string;
    basePrice: number;
    imageUrl: string;
    categoryId: string;
    variants: Array<{ color: string; size: string; price?: number; stock: number; sku: string }>;
  }) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
        variants: {
          create: data.variants.map((v) => ({
            color: v.color,
            size: v.size,
            price: v.price !== undefined ? v.price : data.basePrice,
            stock: v.stock,
            sku: v.sku,
          })),
        },
      },
      include: { variants: true },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    const { variants, ...productData } = data;

    const updated = await this.prisma.product.update({
      where: { id },
      data: productData,
      include: { variants: true },
    });

    if (variants && Array.isArray(variants)) {
      for (const v of variants) {
        if (v.id) {
          await this.prisma.productVariant.update({
            where: { id: v.id },
            data: {
              price: v.price,
              stock: v.stock,
              sku: v.sku,
            },
          });
        } else {
          await this.prisma.productVariant.create({
            data: {
              productId: id,
              color: v.color,
              size: v.size,
              price: v.price !== undefined ? v.price : updated.basePrice,
              stock: v.stock,
              sku: v.sku,
            },
          });
        }
      }
    }

    return this.prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }
}
