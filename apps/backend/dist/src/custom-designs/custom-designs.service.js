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
exports.CustomDesignsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
const fs = require("fs");
const path = require("path");
let CustomDesignsService = class CustomDesignsService {
    prisma;
    configService;
    useCloudinary = false;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        const cloudName = this.configService.get('cloudinary.cloudName');
        const apiKey = this.configService.get('cloudinary.apiKey');
        const apiSecret = this.configService.get('cloudinary.apiSecret');
        if (cloudName && apiKey && apiSecret) {
            cloudinary_1.v2.config({
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret,
            });
            this.useCloudinary = true;
        }
    }
    async create(data) {
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
    async findOne(id) {
        const design = await this.prisma.customDesign.findUnique({
            where: { id },
        });
        if (!design) {
            throw new common_1.NotFoundException('Custom design not found');
        }
        return design;
    }
    async uploadFile(file) {
        if (this.useCloudinary) {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: 'majistyle' }, (error, result) => {
                    if (error)
                        return reject(error);
                    resolve(result.secure_url);
                });
                uploadStream.end(file.buffer);
            });
        }
        else {
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
};
exports.CustomDesignsService = CustomDesignsService;
exports.CustomDesignsService = CustomDesignsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], CustomDesignsService);
//# sourceMappingURL=custom-designs.service.js.map