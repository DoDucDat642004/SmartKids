import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Media, MediaSchema } from './entities/media.entity';
import {
  VideoCategory,
  VideoCategorySchema,
} from './entities/video-category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Media.name, schema: MediaSchema },
      { name: VideoCategory.name, schema: VideoCategorySchema },
    ]),
  ],
  controllers: [MediaController, CategoryController],
  providers: [MediaService, CategoryService],
  exports: [MediaService],
})
export class MediaModule {}
