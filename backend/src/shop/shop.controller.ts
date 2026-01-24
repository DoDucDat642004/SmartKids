import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  create(@Body() body: any) {
    console.log('create');
    return this.shopService.create(body);
  }

  @Get()
  findAll(@Query('type') type: string) {
    return this.shopService.findAll(type);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.shopService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopService.remove(id);
  }

  // MUA
  @UseGuards(JwtAuthGuard)
  @Post('buy')
  buy(@Req() req, @Body('itemId') itemId: string) {
    return this.shopService.buyItem(req.user._id, itemId);
  }

  // TRANG BỊ
  @UseGuards(JwtAuthGuard)
  @Post('equip')
  equip(@Req() req, @Body('itemId') itemId: string) {
    return this.shopService.equipItem(req.user._id, itemId);
  }
}
