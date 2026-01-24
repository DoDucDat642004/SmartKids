import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DiscountType = 'PERCENT' | 'FIXED_AMOUNT';

@Schema({ timestamps: true })
export class Voucher extends Document {
  @Prop({ required: true, unique: true, uppercase: true })
  code: string; // VD: HELLO2025

  @Prop({ required: true })
  description: string; // "Giảm 20% cho người mới"

  @Prop({ required: true })
  discountType: DiscountType; // Giảm theo % hay Tiền mặt

  @Prop({ required: true })
  discountValue: number; // VD: 20 (nếu là %) hoặc 50000 (nếu là tiền)

  @Prop()
  maxDiscountAmount?: number; // Giảm tối đa (VD: giảm 20% nhưng tối đa 100k)

  @Prop({ default: 0 })
  minOrderValue?: number; // Đơn tối thiểu để áp dụng

  @Prop({ required: true })
  quantity: number; // Tổng số lượng mã (VD: 1000)

  @Prop({ default: 0 })
  usedCount: number; // Đã dùng bao nhiêu

  @Prop({ required: true }) startDate: Date;
  @Prop({ required: true }) endDate: Date;

  @Prop({ default: true }) isActive: boolean;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
