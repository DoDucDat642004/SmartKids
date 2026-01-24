import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BannerType = 'HOME_SLIDER' | 'POPUP' | 'EVENT_SECTION';
export type ActionType = 'OPEN_URL' | 'DEEP_LINK';

@Schema({ timestamps: true })
export class Banner extends Document {
  @Prop({ required: true }) title: string; // Tên nội bộ (Admin xem)

  @Prop({ required: true }) imageUrl: string; // Link ảnh

  @Prop({ required: true }) type: BannerType;

  @Prop({ default: 0 }) priority: number; // Thứ tự hiển thị (Số lớn hiện trước)

  @Prop({ default: true }) isActive: boolean;

  // Hành động khi user bấm vào
  @Prop({ default: 'DEEP_LINK' }) actionType: ActionType;
  @Prop() actionValue: string; // VD: '/shop/pack-1' hoặc 'https://youtube.com...'

  @Prop() startDate?: Date; // Hẹn giờ hiện
  @Prop() endDate?: Date; // Hẹn giờ tắt
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
