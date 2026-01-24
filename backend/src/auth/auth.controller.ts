import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport'; // Import Guard

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    // 1. Lấy token từ service
    const { accessToken, user } = await this.authService.login(loginDto);

    // 2. Gắn token vào HttpOnly Cookie
    response.cookie('access_token', accessToken, {
      httpOnly: true, // JavaScript không đọc được (Chống XSS)
      secure: false, // Để false nếu chạy localhost (true nếu có https)
      sameSite: 'lax',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 ngày
    });

    // 3. Trả về thông tin user
    return {
      message: 'Success',
      user,
      access_token: accessToken,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    // Xóa cookie bằng cách set thời gian hết hạn ngay lập tức
    response.clearCookie('access_token');
    return { message: 'Logged out' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
