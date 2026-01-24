import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Unit } from './unit.entity';
import { Item } from 'src/shop/entities/item.entity';
import { HandbookItem } from 'src/handbook/entities/handbook-item.entity';
import { LessonType } from '../enums/lesson-type.enum';

// 1. SUB-SCHEMA: CẤU HÌNH LIVE (LỚP HỌC TRỰC TUYẾN)
// Dùng cho các bài học dạng Livestream/Meeting với giáo viên
@Schema({ _id: false })
export class LiveConfig {
  @Prop({ default: 90 })
  duration: number; // Thời lượng phút (mặc định 90p)

  @Prop({ default: true })
  autoRecord: boolean; // Tự động ghi hình (để học sinh xem lại sau)

  @Prop({ default: true })
  allowMic: boolean; // Mặc định cho phép học sinh bật mic
}

// 2. SUB-SCHEMA: PHẦN THƯỞNG (REWARD)
// Phần thưởng bé nhận được sau khi hoàn thành bài học này
@Schema({ _id: false })
class RewardConfig {
  @Prop({ default: 0 }) gold: number; // Vàng
  @Prop({ default: 0 }) xp: number; // Kinh nghiệm

  // Vật phẩm game (Skin, Pet)
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Item' }] })
  items: Item[];

  // Thẻ bài sưu tầm (Vocabulary Card)
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'HandbookItem' }],
  })
  handbookItems: HandbookItem[];
}

// Định nghĩa cấu trúc câu hỏi
class Question {
  @Prop() id: string;
  @Prop() text: string;
  @Prop() options: string[];
  @Prop() correctAnswer: number;
  @Prop() point: number;
}

// Định nghĩa cấu hình bài thi
class ExamConfig {
  @Prop() durationMinutes: number; // Thời gian làm bài
  @Prop() passingScore: number; // Điểm đạt (VD: 50)
  @Prop({ type: [Question], default: [] })
  questions: Question[];
}

// ==========================================
// 3. MAIN SCHEMA: LESSON
// ==========================================
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Lesson extends Document {
  @Prop({ required: true }) title: string;

  // Quan hệ N-1: Nhiều Lesson thuộc về 1 Unit
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Unit', required: true })
  unitId: Unit;

  // Nội dung bài học.
  @Prop({ type: [MongooseSchema.Types.Mixed], default: [] })
  activities: any[];

  @Prop({ default: 1 }) order: number; // Thứ tự bài học trong Unit

  @Prop() backgroundImage: string; // Ảnh nền cho bài học (Theme)

  @Prop() videoUrl: string; // Video bài giảng chính

  @Prop({
    type: RewardConfig,
    default: () => ({ gold: 10, xp: 10, items: [], handbookItems: [] }),
  })
  rewards: RewardConfig;

  // Cấu hình riêng cho bài học Live
  @Prop({
    type: LiveConfig,
    default: () => ({ duration: 90, autoRecord: true }),
  })
  liveConfig: LiveConfig;

  // Tài liệu đính kèm (PDF, Slide...)
  @Prop({ type: [String], default: [] })
  materials: string[];

  // Loại bài học: GAME (tự học) hay LIVE (học với thầy) hay QUIZ (kiểm tra)
  @Prop({
    enum: LessonType,
    default: LessonType.GAME,
  })
  type: LessonType;

  @Prop() description: string;

  @Prop({ type: ExamConfig })
  examConfig: ExamConfig;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
