import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PracticeQuestionDocument = PracticeQuestion & Document;

export enum GameType {
  QUIZ = 'quiz', // Trắc nghiệm
  MATCHING = 'matching', // Nối hình
  LISTENING = 'listening', // Nghe
  SPELLING = 'spelling', // Chính tả
  SPEAKING = 'speaking', // Luyện nói
  FLASHCARD = 'flashcard', // Lật thẻ
}

@Schema({ timestamps: true })
export class PracticeQuestion {
  // Validate dữ liệu đầu vào phải nằm trong danh sách GameType
  @Prop({ required: true, enum: GameType })
  type: string;

  @Prop({ default: 'General' })
  topic: string;

  @Prop()
  topicImage: string;

  @Prop({ default: 1 })
  level: number;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  options: string[];

  @Prop()
  correctAnswer: string;

  @Prop()
  mediaUrl: string;

  @Prop({ type: [{ left: String, right: String }] })
  pairs: { left: string; right: string }[];
  @Prop({ default: 0 }) rewardGold: number;
  @Prop({ default: 0 }) rewardXP: number;
}

export const PracticeQuestionSchema =
  SchemaFactory.createForClass(PracticeQuestion);
