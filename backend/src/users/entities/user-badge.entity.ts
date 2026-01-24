import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserBadgeDocument = UserBadge & Document;

@Schema({ timestamps: true })
export class UserBadge {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  badgeId: string; // ID của Badge (VD: 'BADGE_MATH_MASTER')

  @Prop({ required: true })
  name: string; // Tên hiển thị

  @Prop({ required: true })
  icon: string; // Icon: 🧮

  @Prop({ default: true })
  isUnlocked: boolean; // Đã mở khóa
}

export const UserBadgeSchema = SchemaFactory.createForClass(UserBadge);
