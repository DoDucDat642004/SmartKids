import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  UnauthorizedException,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { LiveClassService } from './live-class.service';
import { LiveService } from 'src/live/live.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('classes')
export class LiveClassController {
  constructor(
    private readonly liveClassService: LiveClassService,
    private readonly liveService: LiveService,
  ) {}

  // 1. Lấy danh sách Public
  @Get('public')
  async getPublicClasses(@Query('search') search: string) {
    return this.liveClassService.findAllAdmin();
  }

  // 2. Lấy danh sách Admin
  @Get('admin/all')
  async getAllClassesAdmin() {
    return this.liveClassService.findAllAdmin();
  }

  // 3. Lấy lớp
  @UseGuards(JwtAuthGuard)
  @Get('my-enrollments')
  async getMyClasses(@Request() req) {
    return this.liveClassService.getMyClasses(req.user.userId || req.user._id);
  }

  @Get('admin/calendar')
  getCalendarEvents() {
    return this.liveClassService.getAllSessionsForCalendar();
  }

  // Chi tiết lớp học
  @Get(':id')
  async getClassDetail(@Param('id') id: string) {
    return this.liveClassService.findOne(id);
  }

  // Update
  @Put(':id')
  async updateClass(@Param('id') id: string, @Body() body: any) {
    return this.liveClassService.update(id, body);
  }

  // Delete
  @Delete(':id')
  async deleteClass(@Param('id') id: string) {
    return this.liveClassService.remove(id);
  }

  @Put(':id/sync')
  async syncContent(@Param('id') id: string) {
    return this.liveClassService.syncContent(id);
  }

  // Enroll (Đăng ký)
  @UseGuards(JwtAuthGuard)
  @Post(':id/enroll')
  async enrollClass(@Request() req, @Param('id') classId: string) {
    return this.liveClassService.addStudent(
      classId,
      req.user.userId || req.user._id,
    );
  }

  // Join Room (Vào học)
  @UseGuards(JwtAuthGuard)
  @Get(':id/join')
  async joinClassRoom(@Request() req, @Param('id') classId: string) {
    const userId = req.user._id.toString();

    const liveClass = await this.liveClassService.findOne(classId);
    if (!liveClass) throw new NotFoundException('Lớp không tồn tại');

    const isStudent = liveClass.students.some(
      (s: any) => s.toString() === userId,
    );

    const tutorId = liveClass.tutorId as any;
    const isTutor =
      tutorId?._id?.toString() === userId || tutorId?.toString() === userId;

    if (!isStudent && !isTutor) {
      throw new UnauthorizedException('Bạn không thuộc lớp học này');
    }

    return this.liveService.createRoomToken(
      { _id: userId, name: req.user.fullName },
      classId,
    );
  }

  // Update Schedule (Cho Admin/GV xếp lịch)
  @Put(':id/schedule/:lessonId')
  async updateSchedule(
    @Param('id') classId: string,
    @Param('lessonId') lessonId: string,
    @Body() body: any,
  ) {
    return this.liveClassService.updateSession(classId, lessonId, body);
  }

  // Thêm học sinh (Admin)
  @Post(':id/students')
  async addStudent(
    @Param('id') classId: string,
    @Body('studentId') studentId: string,
  ) {
    return this.liveClassService.addStudent(classId, studentId);
  }

  // Tạo lớp
  @Post()
  async createClass(@Body() dto: any) {
    return this.liveClassService.create(dto);
  }
}
