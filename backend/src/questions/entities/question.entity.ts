import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// 1. Thêm 'VOCAB' vào danh sách các loại câu hỏi
export type QuestionType =
  | 'MULTIPLE_CHOICE'
  | 'FILL_IN_BLANK'
  | 'PRONUNCIATION'
  | 'MATCHING'
  | 'VOCAB';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

// 2. Interface cho Từ vựng (Dictionary)
export interface VocabConfig {
  word: string;
  meaning: string;
  partOfSpeech?: string; // noun, verb...
  image?: string;
  audio?: string;
  example?: string;
}

@Schema({ timestamps: true })
export class Question extends Document {
  @Prop({ required: true })
  content: string;

  @Prop()
  audioUrl?: string;

  @Prop({
    required: true,
    // 3. Cập nhật enum trong @Prop
    enum: [
      'MULTIPLE_CHOICE',
      'FILL_IN_BLANK',
      'PRONUNCIATION',
      'MATCHING',
      'VOCAB',
    ],
  })
  type: QuestionType;

  @Prop({ default: 'EASY', enum: ['EASY', 'MEDIUM', 'HARD'] })
  difficulty: Difficulty;

  @Prop([String])
  tags: string[];

  @Prop({ type: MongooseSchema.Types.Mixed })
  config: any;

  @Prop({ default: 0 }) rewardGold: number;
  @Prop({ default: 0 }) rewardXP: number;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
