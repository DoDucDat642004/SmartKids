import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FriendshipDocument = Friendship & Document;

export enum FriendStatus {
  PENDING = 'PENDING', // Đang chờ đồng ý
  ACCEPTED = 'ACCEPTED', // Đã là bạn bè
}

@Schema({ timestamps: true })
export class Friendship {
  @Prop({ required: true, ref: 'User' })
  requester: string; // Người gửi lời mời

  @Prop({ required: true, ref: 'User' })
  recipient: string; // Người nhận

  @Prop({ enum: FriendStatus, default: FriendStatus.PENDING })
  status: FriendStatus;
}

export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
