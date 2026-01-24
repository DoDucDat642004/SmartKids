import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserQuestProgressDocument = UserQuestProgress & Document;

@Schema({ timestamps: true })
export class UserQuestProgress {
  @Prop({ required: true }) userId: string; // ID học viên
  @Prop({ required: true }) questId: string; // ID nhiệm vụ gốc

  @Prop({ default: 0 }) progress: number; // Tiến độ hiện tại (VD: đã học 5/15 phút)
  @Prop({ default: false }) isClaimed: boolean; // Đã nhận thưởng chưa?

  // Dùng để reset nhiệm vụ hàng ngày (Lưu dạng chuỗi "YYYY-MM-DD")
  @Prop({ required: true }) trackingDate: string;
}

export const UserQuestProgressSchema =
  SchemaFactory.createForClass(UserQuestProgress);
