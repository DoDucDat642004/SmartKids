import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Item } from 'src/shop/entities/item.entity';
import { HandbookItem } from 'src/handbook/entities/handbook-item.entity';

// 1. SUB-DOCUMENT: CẤU HÌNH PHẦN THƯỞNG
class RewardConfig {
  @Prop({ default: 0 }) gold: number; // Vàng (Tiền tệ game)
  @Prop({ default: 0 }) diamond: number; // Kim cương (Tiền tệ cao cấp)
  @Prop({ default: 0 }) xp: number; // Kinh nghiệm (để lên cấp)

  // Liên kết đến bảng Item (Vật phẩm game: Skin, Pet...)
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Item' }] })
  items: Item[];

  // Liên kết đến bảng HandbookItem (Thẻ từ vựng sưu tầm)
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'HandbookItem' }],
  })
  handbookItems: HandbookItem[];
}

// 2. MAIN SCHEMA: KHÓA HỌC
@Schema({
  timestamps: true, // Tự động tạo createdAt, updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Course extends Document {
  @Prop({ required: true }) title: string;
  @Prop() description: string;
  @Prop() thumbnail: string; // URL ảnh bìa
  @Prop() theme: string;
  @Prop({ default: 1 }) order: number; // Thứ tự hiển thị khóa học

  @Prop({
    type: RewardConfig,
    default: () => ({ gold: 10, xp: 10, items: [], handbookItems: [] }),
  })
  rewards: RewardConfig;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.virtual('units', {
  ref: 'Unit', // Tên Model cần liên kết
  localField: '_id', // Trường bên Course dùng để so khớp (Course._id)
  foreignField: 'courseId', // Trường bên Unit dùng để so khớp (Unit.courseId)

  // Logic hoạt động:
  // Tìm tất cả các Unit mà: Unit.courseId === Course._id
});
