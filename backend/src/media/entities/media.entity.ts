import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MediaType = 'VIDEO' | 'AUDIO' | 'IMAGE' | 'DOCUMENT';
export type MediaProvider = 'YOUTUBE' | 'VIMEO' | 'CLOUDINARY' | 'LOCAL';

@Schema({ timestamps: true })
export class Media extends Document {
  @Prop({ required: true })
  title: string; // Tên hiển thị (VD: Video hướng dẫn phát âm /i:/)

  @Prop({ required: true })
  type: MediaType;

  @Prop({ required: true })
  url: string; // Link gốc (https://youtube.com/...) hoặc đường dẫn file

  @Prop({ default: 'LOCAL' })
  provider: MediaProvider;

  @Prop()
  thumbnail?: string; // Ảnh thumb (Nếu là video YouTube thì tự lấy)

  @Prop([String])
  tags: string[]; // ['pronunciation', 'grade1', 'cartoon']

  @Prop()
  duration?: number; // Thời lượng (giây) - Dành cho Video/Audio
}

export const MediaSchema = SchemaFactory.createForClass(Media);
