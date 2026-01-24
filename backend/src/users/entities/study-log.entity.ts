import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudyLogDocument = StudyLog & Document;

@Schema({ timestamps: true })
export class StudyLog {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  date: string; // Lưu dạng "YYYY-MM-DD"
}

export const StudyLogSchema = SchemaFactory.createForClass(StudyLog);
