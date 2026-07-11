import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Delete previous data
  await prisma.coupon.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.customDesign.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Categories
  const catClassic = await prisma.category.create({
    data: {
      name: 'Classic Fit',
      slug: 'classic-fit',
    },
  });

  const catOversized = await prisma.category.create({
    data: {
      name: 'Oversized Fit',
      slug: 'oversized-fit',
    },
  });

  console.log('Created categories:', catClassic.name, ',', catOversized.name);

  // 2. Create default Admin & User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);
  const userPasswordHash = await bcrypt.hash('user123', salt);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@majistyle.com',
      passwordHash,
      name: 'MajiStyle Admin',
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      passwordHash: userPasswordHash,
      name: 'John Customer',
      role: 'USER',
    },
  });

  console.log('Created default accounts:');
  console.log(`- Admin: ${admin.email} / admin123`);
  console.log(`- User: ${customer.email} / user123`);

  // 3. Create Products and Variants
  const product1 = await prisma.product.create({
    data: {
      name: 'Classic Crewneck T-Shirt',
      description: 'Our signature classic fit crewneck T-shirt, crafted from 100% premium combed cotton. Perfect for durable custom prints and everyday comfort.',
      basePrice: 499.00,
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
      categoryId: catClassic.id,
      variants: {
        create: [
          { color: 'WHITE', size: 'S', price: 499.00, stock: 50, sku: 'CLS-WHT-S' },
          { color: 'WHITE', size: 'M', price: 499.00, stock: 60, sku: 'CLS-WHT-M' },
          { color: 'WHITE', size: 'L', price: 499.00, stock: 70, sku: 'CLS-WHT-L' },
          { color: 'WHITE', size: 'XL', price: 549.00, stock: 40, sku: 'CLS-WHT-XL' },
          { color: 'BLACK', size: 'S', price: 499.00, stock: 45, sku: 'CLS-BLK-S' },
          { color: 'BLACK', size: 'M', price: 499.00, stock: 55, sku: 'CLS-BLK-M' },
          { color: 'BLACK', size: 'L', price: 499.00, stock: 65, sku: 'CLS-BLK-L' },
          { color: 'BLACK', size: 'XL', price: 549.00, stock: 35, sku: 'CLS-BLK-XL' },
          { color: 'NAVY', size: 'M', price: 499.00, stock: 40, sku: 'CLS-NVY-M' },
          { color: 'NAVY', size: 'L', price: 499.00, stock: 50, sku: 'CLS-NVY-L' },
          { color: 'RED', size: 'M', price: 499.00, stock: 30, sku: 'CLS-RED-M' },
          { color: 'RED', size: 'L', price: 499.00, stock: 30, sku: 'CLS-RED-L' },
        ],
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Premium Heavyweight Oversized Tee',
      description: 'Streetwear-inspired heavyweight tee with dropped shoulders and a boxy silhouette. Made from 240 GSM organic cotton, built to last.',
      basePrice: 799.00,
      imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop',
      categoryId: catOversized.id,
      variants: {
        create: [
          { color: 'BLACK', size: 'M', price: 799.00, stock: 30, sku: 'OVR-BLK-M' },
          { color: 'BLACK', size: 'L', price: 799.00, stock: 40, sku: 'OVR-BLK-L' },
          { color: 'BLACK', size: 'XL', price: 849.00, stock: 25, sku: 'OVR-BLK-XL' },
          { color: 'GRAY', size: 'M', price: 799.00, stock: 20, sku: 'OVR-GRY-M' },
          { color: 'GRAY', size: 'L', price: 799.00, stock: 25, sku: 'OVR-GRY-L' },
          { color: 'GRAY', size: 'XL', price: 849.00, stock: 15, sku: 'OVR-GRY-XL' },
        ],
      },
    },
  });

  console.log('Created products with variants:', product1.name, ',', product2.name);

  // 4. Create Coupons
  const couponPercent = await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      discountType: 'PERCENT',
      discountValue: 10,
      minOrderValue: 200,
      expiryDate: new Date('2027-12-31T23:59:59Z'),
      maxUses: 500,
      usedCount: 0,
      isActive: true,
    },
  });

  const couponFixed = await prisma.coupon.create({
    data: {
      code: 'MAJISTYLE150',
      discountType: 'FIXED',
      discountValue: 150,
      minOrderValue: 999,
      expiryDate: new Date('2027-12-31T23:59:59Z'),
      maxUses: 100,
      usedCount: 0,
      isActive: true,
    },
  });

  console.log('Created coupons:', couponPercent.code, ',', couponFixed.code);
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
