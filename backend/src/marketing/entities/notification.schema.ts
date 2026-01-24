import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TargetSegment =
  | 'ALL_USERS'
  | 'FREE_USERS'
  | 'PAID_USERS'
  | 'INACTIVE_3_DAYS'
  | 'SPECIFIC_USER';
export type PushStatus = 'DRAFT' | 'SCHEDULED' | 'SENT' | 'FAILED';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true }) title: string; // "Bé ơi, học thôi!"
  @Prop({ required: true }) body: string; // "Mr. Lion đang đợi bé..."

  @Prop() image?: string; // Rich Push (Ảnh to)
  @Prop() deepLink?: string; // Link nhảy: '/shop', '/course/unit-1'

  @Prop({ required: true })
  targetSegment: TargetSegment;

  @Prop([String])
  targetUserIds?: string[]; // Nếu gửi riêng cho ai đó

  @Prop() scheduledTime?: Date; // Thời gian hẹn giờ
  @Prop({ default: 'DRAFT' }) status: PushStatus;

  // Số liệu báo cáo
  @Prop({ default: 0 }) sentCount: number; // Đã gửi tới bao nhiêu máy
  @Prop({ default: 0 }) openCount: number; // Bao nhiêu người bấm vào
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
