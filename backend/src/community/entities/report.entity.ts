import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// 3. Schema Báo cáo vi phạm (Report)
@Schema({ timestamps: true })
export class Report extends Document {
  @Prop({ required: true }) reporterId: string; // Người báo cáo
  @Prop({ required: true }) targetId: string; // ID bài viết hoặc User bị báo
  @Prop({ required: true }) type: 'POST' | 'COMMENT' | 'USER';

  @Prop() reason: string; // Lý do: Thô tục...
  @Prop({ default: 'OPEN' }) status: 'OPEN' | 'RESOLVED' | 'DISMISSED';
}
export const ReportSchema = SchemaFactory.createForClass(Report);
