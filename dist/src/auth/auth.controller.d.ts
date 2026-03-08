import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GoogleNativeLoginDto } from './dto/google-native-login.dto';
import { user } from '@prisma/client';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: {
        user: user;
    }, res: any): any;
    googleNativeLogin(googleNativeLoginDto: GoogleNativeLoginDto): Promise<{
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
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getProfile(req: any): any;
}
