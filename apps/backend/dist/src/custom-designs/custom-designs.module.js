"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomDesignsModule = void 0;
const common_1 = require("@nestjs/common");
const custom_designs_service_1 = require("./custom-designs.service");
const custom_designs_controller_1 = require("./custom-designs.controller");
let CustomDesignsModule = class CustomDesignsModule {
};
exports.CustomDesignsModule = CustomDesignsModule;
exports.CustomDesignsModule = CustomDesignsModule = __decorate([
    (0, common_1.Module)({
        providers: [custom_designs_service_1.CustomDesignsService],
        controllers: [custom_designs_controller_1.CustomDesignsController],
        exports: [custom_designs_service_1.CustomDesignsService],
    })
], CustomDesignsModule);
//# sourceMappingURL=custom-designs.module.js.map