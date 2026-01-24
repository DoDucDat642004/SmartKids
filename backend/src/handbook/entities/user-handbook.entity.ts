import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserHandbook {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: [{ type: String, ref: 'HandbookItem' }] })
  items: string[]; // Mảng chứa ID các item đã sở hữu
}

export const UserHandbookSchema = SchemaFactory.createForClass(UserHandbook);
