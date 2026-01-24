import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { HandbookService } from './handbook.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('handbook')
export class HandbookController {
  constructor(private readonly handbookService: HandbookService) {}

  // --- ADMIN ENDPOINTS ---

  @Post('items')
  create(@Body() body: any) {
    return this.handbookService.createItem(body);
  }

  @Get('items')
  findAll() {
    return this.handbookService.findAllItems();
  }

  @Delete('items/:id')
  remove(@Param('id') id: string) {
    return this.handbookService.deleteItem(id);
  }

  // --- USER ENDPOINTS ---

  // 1. Lấy danh sách vật phẩm CỦA TÔI
  @UseGuards(JwtAuthGuard)
  @Get('my-collection')
  getMyCollection(@Req() req) {
    return this.handbookService.getMyCollection(req.user._id);
  }

  // 2. Mở hộp quà (Gacha)
  @UseGuards(JwtAuthGuard)
  @Post('open-box')
  openBox(@Req() req) {
    // Có thể thêm logic trừ Xu (Gold) ở đây nếu muốn
    return this.handbookService.openMysteryBox(req.user._id);
  }
}
