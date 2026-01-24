import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true })
  title: string; // Tên buổi học (VD: Tiếng Anh Giao Tiếp K12)

  // 1 Gia sư
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  tutor: Types.ObjectId;

  // Mảng học sinh (Hỗ trợ lớp nhóm)
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  students: Types.ObjectId[];

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ default: 'PENDING' })
  status: 'PENDING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

  // Lưu link video xem lại
  @Prop()
  recordingUrl?: string;

  @Prop()
  meetingLink?: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
