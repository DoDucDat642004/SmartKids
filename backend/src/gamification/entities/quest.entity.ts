import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestDocument = Quest & Document;
@Schema({ timestamps: true })
export class Quest {
  @Prop({ required: true }) title: string;
  @Prop() description: string;
  @Prop({
    required: true,
    enum: ['LEARNING_TIME', 'LESSONS_COMPLETED', 'GAME_WON', 'LOGIN'],
  })
  type: string;
  @Prop({ required: true }) target: number;
  @Prop({ type: Object }) rewards: { gold: number; xp: number };
  @Prop({ default: true }) isActive: boolean;
}
export const QuestSchema = SchemaFactory.createForClass(Quest);
