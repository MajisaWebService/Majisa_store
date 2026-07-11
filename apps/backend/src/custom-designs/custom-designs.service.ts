import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CustomDesignsService {
  private useCloudinary = false;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const cloudName = this.configService.get<string>('cloudinary.cloudName');
    const apiKey = this.configService.get<string>('cloudinary.apiKey');
    const apiSecret = this.configService.get<string>('cloudinary.apiSecret');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      this.useCloudinary = true;
    }
  }

  async create(data: {
    userId?: string | null;
    baseProductId: string;
    selectedColor: string;
    selectedSize: string;
    config: any;
    previewUrl: string;
  }) {
    return this.prisma.customDesign.create({
      data: {
        userId: data.userId || null,
        baseProductId: data.baseProductId,
        selectedColor: data.selectedColor,
        selectedSize: data.selectedSize,
        config: data.config,
        previewUrl: data.previewUrl,
      },
    });
  }

  async findOne(id: string) {
    const design = await this.prisma.customDesign.findUnique({
      where: { id },
    });
    if (!design) {
      throw new NotFoundException('Custom design not found');
    }
    return design;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (this.useCloudinary) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'majistyle' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result!.secure_url);
          },
        );
        uploadStream.end(file.buffer);
      });
    } else {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, file.buffer);
      return `/uploads/${filename}`;
    }
  }
}
