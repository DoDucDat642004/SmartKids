import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // --- POSTS ---
  @Get('posts')
  getPosts(@Query('status') status: string = 'ALL') {
    return this.communityService.getPosts(status);
  }

  @Patch('posts/:id/status')
  updatePostStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.communityService.updatePostStatus(id, status);
  }

  @Patch('posts/:id/like')
  updatePostLike(@Param('id') id: string, @Query('liked') liked: boolean) {
    return this.communityService.updatePostLike(id, liked);
  }

  @Patch('posts/:id/feature')
  toggleFeature(@Param('id') id: string) {
    return this.communityService.toggleFeature(id);
  }

  @Delete('posts/:id')
  deletePost(@Param('id') id: string) {
    return this.communityService.deletePost(id);
  }

  // --- REPORTS ---
  @Get('reports')
  getReports(@Query('status') status: string = 'OPEN') {
    return this.communityService.getReports(status);
  }

  @Patch('reports/:id/resolve')
  resolveReport(
    @Param('id') id: string,
    @Body('action') action: 'RESOLVED' | 'DISMISSED',
  ) {
    return this.communityService.resolveReport(id, action);
  }
}
