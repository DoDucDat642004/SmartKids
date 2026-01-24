import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AchievementDocument = Achievement & Document;

export enum BadgeCriteriaType {
  TOTAL_XP = 'TOTAL_XP', // Tổng XP tích lũy
  STREAK_DAYS = 'STREAK_DAYS', // Chuỗi ngày học liên tiếp
  LESSONS_COMPLETED = 'LESSONS_COMPLETED', // Số bài học hoàn thành
  GAMES_WON = 'GAMES_WON', // Số game thắng
  VOCAB_COLLECTED = 'VOCAB_COLLECTED', // Số từ vựng sưu tập được
}

@Schema({ timestamps: true })
export class Achievement {
  @Prop({ required: true })
  name: string; // Tên: "Ong chăm chỉ"

  @Prop()
  description: string; // Mô tả: "Học liên tiếp 7 ngày không nghỉ"

  @Prop()
  imageUrl: string; // Link ảnh huy hiệu

  @Prop({
    required: true,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    default: 'Bronze',
  })
  tier: string; // Hạng huy hiệu

  // Điều kiện để đạt được
  @Prop({ type: Object })
  criteria: {
    type: BadgeCriteriaType;
    value: number;
  };

  // Phần thưởng đi kèm (Optional)
  @Prop({ type: Object })
  rewards?: {
    gold: number;
    diamond: number;
  };
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);
