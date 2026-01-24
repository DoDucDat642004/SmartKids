import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketCategory = 'TECHNICAL' | 'BILLING' | 'ACADEMIC' | 'OTHER';

@Schema({ timestamps: true })
export class Ticket extends Document {
  @Prop({ required: true }) userId: string; // ID Phụ huynh
  @Prop() contactEmail: string; // Email liên hệ (có thể khác email tk)
  @Prop() contactPhone: string;

  @Prop({ required: true }) subject: string; // Tiêu đề: "Lỗi thanh toán"
  @Prop({ required: true }) category: TicketCategory;

  @Prop({ default: 'OPEN' }) status: TicketStatus;

  // Nội dung hội thoại
  @Prop({
    type: [
      {
        sender: { type: String, enum: ['USER', 'ADMIN'] },
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  })
  messages: { sender: 'USER' | 'ADMIN'; content: string; createdAt: Date }[];

  @Prop({ default: false }) isRead: boolean; // Admin đã xem chưa
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
