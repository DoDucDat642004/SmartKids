import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum HandbookType {
  VOCAB = 'VOCAB', // Thẻ Từ vựng (Ảnh + Tiếng Anh + Tiếng Việt)
  GRAMMAR = 'GRAMMAR', // Thẻ Ngữ pháp (Công thức + Ví dụ)
}

export enum Rarity {
  COMMON = 'COMMON', // Thường
  RARE = 'RARE', // Hiếm
  EPIC = 'EPIC', // Cực hiếm
  LEGENDARY = 'LEGENDARY', // Huyền thoại
}

@Schema({ timestamps: true })
export class HandbookItem {
  @Prop({ required: true, enum: HandbookType, default: HandbookType.VOCAB })
  type: HandbookType; // Loại thẻ

  @Prop({ required: true, enum: Rarity, default: Rarity.COMMON })
  rarity: Rarity;

  // --- Dành cho VOCAB (Từ vựng) ---
  @Prop()
  word: string; // VD: "Apple"

  @Prop()
  meaning: string; // VD: "Quả táo"

  @Prop()
  imageUrl: string; // Ảnh minh họa

  // --- Dành cho GRAMMAR (Ngữ pháp) ---
  @Prop()
  ruleName: string; // VD: "Thì hiện tại đơn"

  @Prop()
  explanation: string; // VD: "Diễn tả một chân lý..."

  @Prop()
  example: string; // VD: "The sun rises in the East."

  @Prop()
  audioUrl: string; // Link phát âm (Cho thẻ Từ vựng)

  @Prop()
  videoUrl: string; // Link video minh họa (Cho thẻ Hiếm/Legendary)
}

export const HandbookItemSchema = SchemaFactory.createForClass(HandbookItem);
