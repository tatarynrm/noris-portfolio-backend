"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async findById(user_id) {
        return this.prisma.user.findUnique({ where: { user_id } });
    }
    async findByGoogleId(google_id) {
        return this.prisma.user.findUnique({ where: { google_id } });
    }
    async create(data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return this.prisma.user.create({ data });
    }
    async findOrCreate(profile) {
        const { id, emails, displayName, photos } = profile;
        const email = emails[0].value;
        const picture = photos && photos.length > 0 ? photos[0].value : null;
        let userResult = await this.findByGoogleId(id);
        if (!userResult) {
            userResult = await this.findByEmail(email);
            if (userResult) {
                userResult = await this.prisma.user.update({
                    where: { email },
                    data: { google_id: id, picture, name: displayName },
                });
            }
            else {
                userResult = await this.create({
                    email,
                    name: displayName,
                    picture: picture ?? undefined,
                    google_id: id,
                });
            }
        }
        return userResult;
    }
    async findByResetToken(token) {
        return this.prisma.user.findFirst({
            where: {
                password_reset_token: token,
                password_reset_expires: {
                    gt: new Date(),
                },
            },
        });
    }
    async updateResetToken(userId, token, expires) {
        return this.prisma.user.update({
            where: { user_id: userId },
            data: {
                password_reset_token: token,
                password_reset_expires: expires,
            },
        });
    }
    async updatePassword(userId, password) {
        let hashedPassword = undefined;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        return this.prisma.user.update({
            where: { user_id: userId },
            data: {
                password: hashedPassword,
                password_reset_token: null,
                password_reset_expires: null,
            },
        });
    }
    async findAll() {
        return this.prisma.user.findMany({
            orderBy: { created_at: 'desc' },
        });
    }
    async update(userId, data) {
        const { password, ...updateData } = data;
        return this.prisma.user.update({
            where: { user_id: userId },
            data: updateData,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map