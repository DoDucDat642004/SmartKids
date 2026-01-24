import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserProcessDocument = UserProcess & Document;

@Schema({ timestamps: true })
export class UserProcess {
  @Prop({ required: true }) userId: string;

  // Lưu đủ 3 cấp ID để dễ dàng query/thống kê:
  // "User này đã hoàn thành bao nhiêu % Course A?" -> Query theo courseId
  // "User này đã xong bao nhiêu bài trong Unit 1?" -> Query theo unitId
  @Prop({ required: true }) courseId: string;
  @Prop({ required: true }) unitId: string;
  @Prop({ required: true }) lessonId: string;

  @Prop({ default: false }) isCompleted: boolean; // Trạng thái hoàn thành
}

export const UserProcessSchema = SchemaFactory.createForClass(UserProcess);

UserProcessSchema.index({ userId: 1, courseId: 1 });
UserProcessSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
