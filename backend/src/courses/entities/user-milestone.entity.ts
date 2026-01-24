import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum MilestoneType {
  UNIT = 'UNIT', // Hoàn thành xong 1 Unit
  COURSE = 'COURSE', // Hoàn thành xong cả khóa học
}

@Schema({ timestamps: true })
export class UserMilestone extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  targetId: string; // ID của Unit hoặc Course đã hoàn thành

  @Prop({ required: true, enum: MilestoneType })
  type: MilestoneType; // Loại cột mốc

  @Prop({ default: true })
  isRewardClaimed: boolean; // Đánh dấu đã nhận thưởng chưa .
}

export const UserMilestoneSchema = SchemaFactory.createForClass(UserMilestone);

// Đảm bảo tính toàn vẹn dữ liệu.
UserMilestoneSchema.index(
  { userId: 1, targetId: 1, type: 1 },
  { unique: true },
);
