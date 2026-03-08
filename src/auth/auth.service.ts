import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailService: MailService,
  ) { }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const newUser = await this.usersService.create({
      email: registerDto.email,
      password: registerDto.password,
      name: registerDto.name,
    });

    return this.generateJwt(newUser);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    // User not found or signed up natively but using only Google?
    if (!user || (!user.password && user.google_id)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateJwt(user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new ConflictException('User with this email was not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.usersService.updateResetToken(user.user_id, resetToken, resetExpires);
    await this.mailService.sendPasswordResetEmail(user.email, resetToken, user.name || '');

    return { message: 'If an account with that email exists, we sent a link to reset your password.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByResetToken(resetPasswordDto.token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    await this.usersService.updatePassword(user.user_id, resetPasswordDto.new_password);
    return { message: 'Password successfully updated' };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid user or social login only');
    }

    const isPasswordValid = await bcrypt.compare(changePasswordDto.old_password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    await this.usersService.updatePassword(userId, changePasswordDto.new_password);
    return { message: 'Password successfully changed' };
  }

  async googleNativeLogin(accessToken: string) {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
      const googleUser = await response.json();

      if (!googleUser || googleUser.error) {
        throw new UnauthorizedException('Invalid Google access token');
      }

      const user = await this.usersService.findOrCreate({
        id: googleUser.sub,
        emails: [{ value: googleUser.email }],
        displayName: googleUser.name,
        photos: [{ value: googleUser.picture }],
      });

      return this.generateJwt(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Failed to verify Google token');
    }
  }

  generateJwt(userObject: user) {
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
}
