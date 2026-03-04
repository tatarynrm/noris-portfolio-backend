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
exports.TranslationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TranslationsService = class TranslationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMessages(locale) {
        const translations = await this.prisma.translation.findMany({
            where: { locale },
        });
        const messages = {};
        translations.forEach((t) => {
            const keys = t.key.split('.');
            let current = messages;
            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    current[key] = t.value;
                }
                else {
                    current[key] = (current[key] || {});
                    current = current[key];
                }
            });
        });
        return messages;
    }
    async upsertTranslation(locale, key, value, namespace) {
        return this.prisma.translation.upsert({
            where: {
                locale_key: { locale, key },
            },
            update: { value, namespace },
            create: { locale, key, value, namespace },
        });
    }
};
exports.TranslationsService = TranslationsService;
exports.TranslationsService = TranslationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TranslationsService);
//# sourceMappingURL=translations.service.js.map