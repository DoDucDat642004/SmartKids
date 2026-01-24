import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { LiveService } from './live.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingService } from 'src/booking/booking.service';
import { RolesService } from 'src/roles/roles.service';

@Controller('live')
export class LiveController {
  constructor(
    private readonly liveService: LiveService,
    private readonly bookingService: BookingService,
    private readonly rolesService: RolesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('join/:bookingId')
  async joinClass(@Request() req, @Param('bookingId') bookingId: string) {
    const user = req.user;

    const userIdStr = user._id.toString();

    console.log('--- JOIN CLASS ---');
    console.log('User ID:', userIdStr);

    const booking = await this.bookingService.findById(bookingId);
    if (!booking) throw new UnauthorizedException('Lớp học không tồn tại');

    const isStudent = booking.students.some((s) => s.toString() === userIdStr);
    const isTutor = booking.tutor.toString() === userIdStr;

    let isAdmin = false;
    if (user.role) {
      try {
        const roleData = await this.rolesService.findById(user.role);
        if (roleData && roleData.name?.toUpperCase() === 'ADMIN') {
          isAdmin = true;
        }
      } catch (e) {
        console.error('Lỗi check role:', e.message);
      }
    }

    if (!isStudent && !isTutor && !isAdmin) {
      throw new UnauthorizedException('Bạn không có quyền tham gia.');
    }

    // Gọi service, truyền ID dạng string vào
    return this.liveService.createRoomToken(
      {
        _id: userIdStr,
        name: user.fullName || user.email,
      },
      bookingId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('book')
  async bookSession(@Request() req, @Body() body: any) {
    const userIdStr = req.user._id.toString();
    return this.bookingService.create(userIdStr, body);
  }
}
