import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PostStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// 1. Schema Bình luận
@Schema({ timestamps: true })
export class Comment {
  @Prop() userId: string;
  @Prop() content: string;
  @Prop({ default: false }) isFlagged: boolean; // Bị đánh dấu là tiêu cực?
}
const CommentSchema = SchemaFactory.createForClass(Comment);

// 2. Schema Bài viết
@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true }) userId: string; // ID học viên
  @Prop() content: string;
  @Prop([String]) images: string[]; // Ảnh đính kèm

  @Prop({ default: 'PENDING' })
  status: PostStatus; // Mặc định là PENDING (Cần duyệt mới được hiện)

  @Prop({ default: 0 }) likes: number;
  @Prop({ type: [CommentSchema], default: [] }) comments: Comment[];

  @Prop({ default: false }) isFeatured: boolean; // Bài viết nổi bật (Ghim)
}
export const PostSchema = SchemaFactory.createForClass(Post);
