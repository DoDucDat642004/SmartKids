import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // Tạo lớp
  @Post('create-class')
  create(@Body() body: any) {
    return this.bookingService.createClass(body);
  }

  // Lấy danh sách (Quản lý)
  @Get('list')
  findAll(@Query() query: any) {
    return this.bookingService.findAll(query);
  }

  // Thêm học sinh vào lớp
  @Put(':id/add-student')
  addStudent(@Param('id') id: string, @Body('studentId') studentId: string) {
    return this.bookingService.addStudent(id, studentId);
  }

  // Lưu link record
  @Put(':id/recording')
  updateRecording(@Param('id') id: string, @Body('url') url: string) {
    return this.bookingService.updateRecording(id, url);
  }
}
