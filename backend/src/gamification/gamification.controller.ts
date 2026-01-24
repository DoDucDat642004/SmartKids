import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { CreateGamificationDto } from './dto/create-gamification.dto';
import { UpdateGamificationDto } from './dto/update-gamification.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  // --- QUESTS ENDPOINTS ---
  @Post('quests')
  createQuest(@Body() body: any) {
    return this.gamificationService.createQuest(body);
  }

  @Get('quests')
  getQuests() {
    return this.gamificationService.getQuests();
  }

  @Put('quests/:id')
  updateQuest(@Param('id') id: string, @Body() body: any) {
    return this.gamificationService.updateQuest(id, body);
  }

  @Delete('quests/:id')
  deleteQuest(@Param('id') id: string) {
    return this.gamificationService.deleteQuest(id);
  }

  // --- LEVELS ENDPOINTS ---
  @Post('levels')
  createLevel(@Body() body: any) {
    return this.gamificationService.createLevel(body);
  }

  @Get('levels')
  getLevels() {
    return this.gamificationService.getLevels();
  }

  @Put('levels/:id')
  updateLevel(@Param('id') id: string, @Body() body: any) {
    return this.gamificationService.updateLevel(id, body);
  }

  @Delete('levels/:id')
  deleteLevel(@Param('id') id: string) {
    return this.gamificationService.deleteLevel(id);
  }

  // --- ACHIEVEMENTS ENDPOINTS ---
  @Post('achievements')
  createAchievement(@Body() body: any) {
    return this.gamificationService.createAchievement(body);
  }

  @Get('achievements')
  getAchievements() {
    return this.gamificationService.getAchievements();
  }

  @Put('achievements/:id')
  updateAchievement(@Param('id') id: string, @Body() body: any) {
    return this.gamificationService.updateAchievement(id, body);
  }

  @Delete('achievements/:id')
  deleteAchievement(@Param('id') id: string) {
    return this.gamificationService.deleteAchievement(id);
  }

  // --- USER ENDPOINTS (CLIENT) ---

  // 1. Lấy nhiệm vụ của tôi
  @UseGuards(JwtAuthGuard) // Bắt buộc phải đăng nhập mới gọi được
  @Get('quests/me')
  getMyQuests(@Req() req: any) {
    // req.user được passport tự động gán vào sau khi giải mã Token
    const userId = req.user._id; // Hoặc req.user.id tùy vào JWT Strategy của bạn
    return this.gamificationService.getMyQuests(userId);
  }

  // 2. Nhận thưởng
  @UseGuards(JwtAuthGuard)
  @Post('quests/:id/claim')
  claimReward(@Param('id') questId: string, @Req() req: any) {
    const userId = req.user._id;
    return this.gamificationService.claimReward(userId, questId);
  }

  // 3. API Test (Giữ nguyên Body để test cho dễ, hoặc đổi sang Req nếu muốn)
  @Post('track-test')
  trackProgressTest(
    @Body() body: { userId: string; type: string; amount: number },
  ) {
    return this.gamificationService.trackProgress(
      body.userId,
      body.type,
      body.amount,
    );
  }
}
