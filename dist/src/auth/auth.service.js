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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const mail_service_1 = require("../mail/mail.service");
let AuthService = class AuthService {
    jwtService;
    usersService;
    mailService;
    constructor(jwtService, usersService, mailService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.mailService = mailService;
    }
    async register(registerDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('User already exists');
        }
        const newUser = await this.usersService.create({
            email: registerDto.email,
            password: registerDto.password,
            name: registerDto.name,
        });
        return this.generateJwt(newUser);
    }
    async login(loginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user || (!user.password && user.google_id)) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.generateJwt(user);
    }
    async forgotPassword(forgotPasswordDto) {
        const user = await this.usersService.findByEmail(forgotPasswordDto.email);
        if (!user) {
            throw new common_1.ConflictException('User with this email was not found');
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000);
        await this.usersService.updateResetToken(user.user_id, resetToken, resetExpires);
        await this.mailService.sendPasswordResetEmail(user.email, resetToken, user.name || '');
        return { message: 'If an account with that email exists, we sent a link to reset your password.' };
    }
    async resetPassword(resetPasswordDto) {
        const user = await this.usersService.findByResetToken(resetPasswordDto.token);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
        await this.usersService.updatePassword(user.user_id, resetPasswordDto.new_password);
        return { message: 'Password successfully updated' };
    }
    async changePassword(userId, changePasswordDto) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException('Invalid user or social login only');
        }
        const isPasswordValid = await bcrypt.compare(changePasswordDto.old_password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid old password');
        }
        await this.usersService.updatePassword(userId, changePasswordDto.new_password);
        return { message: 'Password successfully changed' };
    }
    generateJwt(userObject) {
        const payload = { sub: userObject.user_id, email: userObject.email, role: userObject.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: userObject.user_id,
                email: userObject.email,
                name: userObject.name,
                picture: userObject.picture,
                role: userObject.role,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map