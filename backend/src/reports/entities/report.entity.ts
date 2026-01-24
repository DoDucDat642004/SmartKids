import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReportStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED';
export type ReportReason =
  | 'SPAM'
  | 'HARASSMENT'
  | 'INAPPROPRIATE_CONTENT'
  | 'FAKE_ACCOUNT';

@Schema({ timestamps: true })
export class Report extends Document {
  @Prop({ required: true }) reporterId: string; // Người báo cáo

  @Prop({ required: true }) targetId: string; // ID của đối tượng bị báo (PostId, CommentId, UserId)
  @Prop({ required: true }) targetType: 'POST' | 'COMMENT' | 'USER';

  @Prop({ required: true }) reason: ReportReason; // Lý do
  @Prop() description?: string; // Mô tả thêm của người báo

  @Prop({ default: 'OPEN' }) status: ReportStatus;

  // Lưu lại snapshot nội dung bị báo cáo
  @Prop({ type: Object })
  snapshot: {
    content?: string;
    image?: string;
    authorId: string;
  };

  @Prop() adminNote?: string; // Ghi chú của Admin khi xử lý
  @Prop() resolvedBy?: string; // Admin nào xử lý
}
export const ReportSchema = SchemaFactory.createForClass(Report);
