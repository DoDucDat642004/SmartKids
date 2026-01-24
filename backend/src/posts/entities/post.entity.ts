import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export enum PostCategory {
  NEWS = 'NEWS', // Tin tức
  TIPS = 'TIPS', // Bí quyết học tập
  ANNOUNCEMENT = 'ANNOUNCEMENT', // Thông báo
}

@Schema({ timestamps: true })
export class BlogPost extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string; // URL thân thiện (vd: bi-quyet-hoc-tieng-anh)

  @Prop()
  thumbnail: string;

  @Prop({ required: true })
  content: string; // Lưu dạng HTML (Rich Text)

  @Prop({ default: '' })
  excerpt: string; // Mô tả ngắn

  @Prop({ type: String, enum: PostCategory, default: PostCategory.NEWS })
  category: PostCategory;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: false,
  })
  author: User;

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ default: 0 })
  views: number; // Đếm lượt xem
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
