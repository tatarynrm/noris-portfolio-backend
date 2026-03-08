import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private jwtService;
    private usersService;
    private mailService;
    constructor(jwtService: JwtService, usersService: UsersService, mailService: MailService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            picture: string | null;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            picture: string | null;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    googleNativeLogin(accessToken: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            picture: string | null;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
    generateJwt(userObject: user): {
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string | null;
            picture: string | null;
            role: import(".prisma/client").$Enums.UserRole;
        };
    };
}
