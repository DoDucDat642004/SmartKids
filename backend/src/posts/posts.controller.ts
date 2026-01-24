import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Put,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: any, @Req() req: any) {
    return this.postsService.create(body, req.user._id);
  }

  @Get()
  findAll(@Query('category') category: string) {
    return this.postsService.findAll(category);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  // Lấy danh sách quản lý
  @Get('admin/all')
  findAllAdmin() {
    return this.postsService.findAllAdmin();
  }

  // Update
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.postsService.update(id, body);
  }

  // Delete
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
