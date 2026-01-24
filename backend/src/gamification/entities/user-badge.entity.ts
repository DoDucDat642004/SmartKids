import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserBadgeDocument = UserBadge & Document;

@Schema({ timestamps: true })
export class UserBadge {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) achievementId: string; // ID của Achievement

  @Prop() name: string;
  @Prop() imageUrl: string;
  @Prop({ default: true }) isUnlocked: boolean;
}

export const UserBadgeSchema = SchemaFactory.createForClass(UserBadge);
