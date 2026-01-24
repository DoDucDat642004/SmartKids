import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VideoCategoryDocument = VideoCategory & Document;

@Schema({ timestamps: true })
export class VideoCategory {
  @Prop({ required: true })
  title: string; // Tên chủ đề (VD: Peppa Pig, Doremon, English Songs)

  @Prop()
  description: string; // Mô tả ngắn

  @Prop()
  thumbnail: string; // Ảnh bìa chủ đề

  @Prop({ default: 'cartoon' })
  type: 'cartoon' | 'music' | 'story'; // Loại danh mục

  @Prop({ default: 'Easy' })
  level: string;

  // Danh sách các video thuộc chủ đề này (Liên kết với bảng Media)
  @Prop([{ type: Types.ObjectId, ref: 'Media' }])
  videos: Types.ObjectId[];
}

export const VideoCategorySchema = SchemaFactory.createForClass(VideoCategory);
