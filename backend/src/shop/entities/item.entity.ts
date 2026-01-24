import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ItemDocument = Item & Document;
export type ItemType = 'PET' | 'SKIN' | 'CONSUMABLE';
export type Currency = 'GOLD' | 'DIAMOND';

@Schema({ timestamps: true })
export class Item extends Document {
  @Prop({ required: true }) name: string;
  @Prop() description: string; // Mô tả

  @Prop({ required: true }) type: ItemType;

  @Prop({ required: true }) price: number; // Giá: 1000
  @Prop({ default: 'GOLD' }) currency: Currency; // Loại tiền: Vàng/Kim cương

  @Prop() thumbnail: string; // Ảnh hiển thị trong shop

  @Prop() lottieUrl: string;

  // Cấu hình riêng cho từng loại
  @Prop({ type: MongooseSchema.Types.Mixed })
  config: {
    // Nếu là SKIN
    slot?: 'HEAD' | 'FACE' | 'FRAME'; // Vị trí đeo

    // Nếu là PET
    evolution?: [
      { level: number; image: string; name: string }, // Lv1: Trứng, Lv10: Rồng con...
    ];

    // Nếu là CONSUMABLE
    effect?: string; // 'STREAK_FREEZE', 'DOUBLE_XP'
  };

  @Prop({ default: true }) isActive: boolean; // Đang bán hay ẩn
}

export const ItemSchema = SchemaFactory.createForClass(Item);
