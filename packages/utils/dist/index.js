"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPrice = formatPrice;
exports.generateSKU = generateSKU;
exports.validateEmail = validateEmail;
exports.calculateDiscount = calculateDiscount;
function formatPrice(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount);
}
function generateSKU(productName, color, size) {
    const prefix = productName.slice(0, 3).toUpperCase();
    return `${prefix}-${color.slice(0, 3)}-${size}-${Math.floor(100 + Math.random() * 900)}`;
}
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
function calculateDiscount(orderTotal, discountType, discountValue) {
    if (discountType === 'PERCENT') {
        return Math.round((orderTotal * discountValue) / 100);
    }
    return Math.min(discountValue, orderTotal);
}
//# sourceMappingURL=index.js.map