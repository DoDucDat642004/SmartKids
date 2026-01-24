import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// Sub-schema cho từng câu hỏi
@Schema({ _id: false })
export class Question {
  @Prop({ required: true }) title: string; // Câu hỏi
  @Prop([String]) options: string[]; // 4 đáp án: ["A", "B", "C", "D"]
  @Prop({ required: true }) correctIndex: number; // Đáp án đúng: 0 (là A)
  @Prop({ default: 10 }) point: number; // Điểm số
}

@Schema({ timestamps: true })
export class Quiz extends Document {
  @Prop({ required: true }) title: string; // VD: "Kiểm tra giữa kỳ Unit 5"

  @Prop({ default: 45 }) durationMinutes: number; // 45 phút

  @Prop({ type: [Question], default: [] })
  questions: Question[];

  // Link tới người tạo (Admin/Gia sư)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  creatorId: string;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
