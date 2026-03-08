import { Controller, Get, Post, Body, Req, Res, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GoogleNativeLoginDto } from './dto/google-native-login.dto';
import { user } from '@prisma/client';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'Return JWT Token' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'Return JWT Token' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Initiate Google Login' })
  async googleAuth() {
    // passport delegates this automatically
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google Login Callback' })
  @ApiResponse({ status: 302, description: 'Redirect to frontend with JWT Token' })
  googleAuthRedirect(@Req() req: { user: user }, @Res() res: any) {
    const { access_token } = this.authService.generateJwt(req.user);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    return res.redirect(`${frontendUrl}/auth/callback?token=${access_token}`);
  }

  @Post('google-native')
  @ApiOperation({ summary: 'Google Native Login' })
  @ApiResponse({ status: 200, description: 'Return JWT Token' })
  googleNativeLogin(@Body() googleNativeLoginDto: GoogleNativeLoginDto) {
    return this.authService.googleNativeLogin(googleNativeLoginDto.access_token);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset link' })
  @ApiResponse({ status: 200, description: 'Return confirmation message' })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiResponse({ status: 200, description: 'Return confirmation message' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('change-password')
  @ApiOperation({ summary: 'Change password for authenticated user' })
  @ApiResponse({ status: 200, description: 'Return confirmation message' })
  changePassword(@Req() req: any, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.user_id, changePasswordDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Req() req: any) {
    const { password, ...userWithoutPassword } = req.user;
    console.log(userWithoutPassword);

    return userWithoutPassword;
  }
}
