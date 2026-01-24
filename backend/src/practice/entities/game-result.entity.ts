import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameResultDocument = GameResult & Document;

@Schema({ timestamps: true })
export class GameResult {
  @Prop({ required: true }) // ID của người chơi
  userId: string;

  @Prop({ required: true }) // Loại game: 'quiz', 'matching'...
  gameType: string;

  @Prop({ default: 0 })
  score: number; // Điểm số đạt được
}

export const GameResultSchema = SchemaFactory.createForClass(GameResult);
