import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() body: any) {
    return this.categoryService.create(body);
  }

  @Get()
  findAll(@Query('type') type: string) {
    return this.categoryService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }

  @Post(':id/videos')
  addVideo(@Param('id') id: string, @Body('mediaId') mediaId: string) {
    return this.categoryService.addVideo(id, mediaId);
  }

  @Delete(':id/videos/:mediaId')
  removeVideo(@Param('id') id: string, @Param('mediaId') mediaId: string) {
    return this.categoryService.removeVideo(id, mediaId);
  }
}
