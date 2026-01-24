import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LevelConfigDocument = LevelConfig & Document;
@Schema({ timestamps: true })
export class LevelConfig {
  @Prop({ required: true, unique: true }) level: number; // Level 1, 2, 3...
  @Prop({ required: true }) requiredXP: number; // XP cần để đạt level này
  @Prop({ type: Object }) rewards: {
    gold: number;
    diamonds?: number;
    items?: string[];
  };
}
export const LevelConfigSchema = SchemaFactory.createForClass(LevelConfig);
