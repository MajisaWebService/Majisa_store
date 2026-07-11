"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT || '3002', 10),
    jwt: {
        secret: process.env.JWT_SECRET || 'majistyle-access-token-secret-key-2026',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'majistyle-refresh-token-secret-key-2026',
        expiresIn: '15m',
        refreshExpiresIn: '7d',
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    },
});
//# sourceMappingURL=configuration.js.map