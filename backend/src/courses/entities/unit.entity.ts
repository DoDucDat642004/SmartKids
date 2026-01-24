import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Course } from './course.entity';

import { Item } from 'src/shop/entities/item.entity';
import { HandbookItem } from 'src/handbook/entities/handbook-item.entity';

class RewardConfig {
  @Prop({ default: 0 }) gold: number; // Thưởng vàng
  @Prop({ default: 0 }) diamond: number;
  @Prop({ default: 0 }) xp: number; // Thưởng kinh nghiệm

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Item' }] })
  items: Item[]; // Vật phẩm (Skin, Pet...)

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'HandbookItem' }],
  })
  handbookItems: HandbookItem[]; // Thẻ bài từ vựng
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Unit extends Document {
  @Prop({ required: true }) title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  courseId: Course;

  @Prop({ default: 1 }) order: number;

  @Prop() backgroundImage: string;

  @Prop() videoUrl: string; // Video giới thiệu Unit

  @Prop({
    type: RewardConfig,
    default: () => ({ gold: 10, xp: 10, items: [], handbookItems: [] }),
  })
  rewards: RewardConfig;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);

UnitSchema.virtual('lessons', {
  ref: 'Lesson', // Model cần liên kết
  localField: '_id', // ID của Unit
  foreignField: 'unitId', // Trường bên Lesson lưu ID của Unit
});
