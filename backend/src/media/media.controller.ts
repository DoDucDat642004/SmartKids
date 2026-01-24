import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  create(@Body() createMediaDto: any) {
    return this.mediaService.create(createMediaDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.mediaService.findAll(query);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.mediaService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}
