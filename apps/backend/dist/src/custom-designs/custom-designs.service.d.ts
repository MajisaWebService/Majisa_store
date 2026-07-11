import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class CustomDesignsService {
    private prisma;
    private configService;
    private useCloudinary;
    constructor(prisma: PrismaService, configService: ConfigService);
    create(data: {
        userId?: string | null;
        baseProductId: string;
        selectedColor: string;
        selectedSize: string;
        config: any;
        previewUrl: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        baseProductId: string;
        selectedColor: string;
        selectedSize: string;
        config: import("@prisma/client/runtime/library").JsonValue;
        previewUrl: string;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        baseProductId: string;
        selectedColor: string;
        selectedSize: string;
        config: import("@prisma/client/runtime/library").JsonValue;
        previewUrl: string;
    }>;
    uploadFile(file: Express.Multer.File): Promise<string>;
}
