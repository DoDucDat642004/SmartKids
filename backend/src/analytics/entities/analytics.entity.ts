import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class QuestionAttempt extends Document {
  // 1. Định danh (Who, Where, What)
  // ---------------------------------------------------------
  @Prop({ required: true })
  userId: string; // ID của người học

  @Prop({ required: true })
  lessonId: string; // ID bài học (để biết đang học bài nào)

  @Prop({ required: true })
  questionId: string; // ID câu hỏi (để biết nội dung câu hỏi là gì)

  // 2. Kết quả & Phân tích hành vi (Analytics)
  // ---------------------------------------------------------
  @Prop({ required: true })
  isCorrect: boolean; // Kết quả: Đúng hay Sai? (Dùng để tính điểm/XP)

  @Prop()
  userAnswer: string;
  // Đáp án thực tế chọn/nhập.
  // VD: Đáp án đúng là "Apple", bé nhập "Aple".
  // -> Lưu lại để AI phân tích xem hay sai chính tả hay sai kiến thức.

  @Prop()
  timeSpent: number;
  // Thời gian hoàn thành câu này (giây).
  // - Nếu time quá ngắn (<3s) + sai -> đoán bừa/không tập trung.
  // - Nếu time quá dài + đúng/sai -> Câu hỏi khó, phải suy nghĩ lâu.

  // 3. Phân loại kỹ năng (Skill Graph)
  // ---------------------------------------------------------
  @Prop()
  skillType: 'VOCAB' | 'LISTENING' | 'SPEAKING' | 'GRAMMAR';
  // Dùng để vẽ biểu đồ năng lực.
  // VD: Nếu isCorrect=false nhiều ở 'LISTENING' -> Hệ thống sẽ gợi ý thêm bài nghe.
}

export const QuestionAttemptSchema =
  SchemaFactory.createForClass(QuestionAttempt);
