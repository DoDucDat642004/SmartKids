import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PracticeService } from './practice.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('practice')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  // Admin quản lý
  @Post('questions')
  create(@Body() body: any) {
    return this.practiceService.create(body);
  }

  @Get('questions')
  findAll(@Query() query: any) {
    return this.practiceService.findAll(query);
  }

  @Put('questions/:id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.practiceService.update(id, body);
  }

  @Delete('questions/:id')
  remove(@Param('id') id: string) {
    return this.practiceService.remove(id);
  }

  // API lấy danh sách chủ đề
  @Get('topics/:type')
  getTopics(@Param('type') type: string) {
    return this.practiceService.getTopics(type);
  }

  // API vào chơi
  @Get('play/:type')
  getGame(@Param('type') type: string, @Query('topic') topic: string) {
    return this.practiceService.getGameQuestions(type, topic);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getUserStats(@Req() req) {
    return this.practiceService.getUserStats(req.user._id);
  }

  @Post('complete')
  @UseGuards(JwtAuthGuard)
  async completeGame(@Req() req, @Body() body: any) {
    console.log(req.user);
    const userId = req.user._id;

    return this.practiceService.completePractice(userId, body);
  }

  // API lấy bảng xếp hạng
  @UseGuards(JwtAuthGuard)
  @Get('leaderboard/:gameType')
  async getLeaderboard(@Param('gameType') gameType: string) {
    return this.practiceService.getLeaderboard(gameType);
  }
}
