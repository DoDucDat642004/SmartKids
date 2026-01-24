import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // --- COURSE ---
  @Post()
  createCourse(@Body() body: any) {
    return this.coursesService.createCourse(body);
  }

  @Get()
  findAllCourses() {
    return this.coursesService.findAllCourses();
  }

  @Patch(':courseId')
  updateCourse(@Param('courseId') courseId: string, @Body() body: any) {
    return this.coursesService.updateCourse(courseId, body);
  }

  // --- UNIT ---
  @Delete(':courseId')
  deleteCourse(@Param('courseId') courseId: string) {
    return this.coursesService.deleteCourse(courseId);
  }

  // --- UNIT ---
  @Post(':id/units')
  addUnit(
    @Param('id') courseId: string,
    @Body() body: { title: string; videoUrl?: string },
  ) {
    return this.coursesService.createUnit(courseId, body);
  }

  // --- LESSON ---
  @Post('units/:unitId/lessons')
  addLesson(
    @Param('unitId') unitId: string,
    @Body()
    body: {
      title: string;
      videoUrl?: string;
      type?: string;
      description?: string;
      materials?: string[];
    },
  ) {
    return this.coursesService.createLesson(unitId, body);
  }

  // UPDATE LESSON
  @Patch('lessons/:lessonId')
  updateLesson(@Param('lessonId') lessonId: string, @Body() body: any) {
    return this.coursesService.updateLessonInfo(lessonId, body);
  }

  @Patch('units/:unitId')
  updateUnit(@Param('unitId') unitId: string, @Body() body: any) {
    console.log('ok', body);
    return this.coursesService.updateUnit(unitId, body);
  }

  // --- UNIT ---
  @Delete('units/:unitId')
  deleteUnit(@Param('unitId') unitId: string) {
    return this.coursesService.deleteUnit(unitId);
  }

  // --- LESSON ---
  @Put('lessons/:lessonId/content')
  updateContent(
    @Param('lessonId') lessonId: string,
    @Body('activities') activities: any[],
  ) {
    return this.coursesService.updateLessonContent(lessonId, activities);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/tree')
  getCourseTree(@Param('id') id: string, @Req() req: any) {
    const userId = req.user._id;
    return this.coursesService.getCourseTree(id, userId);
  }

  // Hoàn thành bài học
  @UseGuards(JwtAuthGuard)
  @Post('lessons/:id/complete')
  completeLesson(@Param('id') lessonId: string, @Req() req: any) {
    const userId = req.user._id;
    return this.coursesService.completeLesson(userId, lessonId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('lessons/:id')
  getLessonDetail(@Param('id') id: string) {
    return this.coursesService.getLessonDetail(id);
  }

  @Delete('lessons/:lessonId')
  deleteLesson(@Param('lessonId') lessonId: string) {
    return this.coursesService.deleteLesson(lessonId);
  }

  /**
   * Học sinh nộp bài thi
   */
  @UseGuards(JwtAuthGuard)
  @Post('lessons/:id/exam/submit')
  async submitExam(
    @Param('id') lessonId: string,
    @Body() body: { score: number },
    @Req() req: any,
  ) {
    const userId = req.user._id;
    return this.coursesService.submitExamResult(userId, lessonId, body.score);
  }
}
