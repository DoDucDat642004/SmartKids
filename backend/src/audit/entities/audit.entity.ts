import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ required: true })
  actorId: string; // ID của Admin/User thực hiện hành động

  @Prop({ required: true })
  actorName: string;
  // Tên người thực hiện tại thời điểm đó.
  // QUAN TRỌNG: Lưu cứng (Snapshot) thay vì chỉ lưu ID.
  // Lý do: Nếu sau này nhân viên đó nghỉ việc và bị xóa tài khoản,
  // lịch sử vẫn phải hiển thị được tên họ chứ không phải lỗi "User not found".

  // ---------------------------------------------------------
  @Prop({ required: true })
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'EXPORT';
  // Loại hành động giúp filter nhanh. VD: Chỉ muốn xem ai đã DELETE dữ liệu.

  // ---------------------------------------------------------
  @Prop({ required: true })
  module: 'USER' | 'COURSE' | 'FINANCE' | 'SYSTEM';
  // Phân hệ xảy ra sự việc.
  // VD: module='FINANCE' để kiểm tra các biến động số dư/tiền bạc.

  // ---------------------------------------------------------
  @Prop({ required: true })
  target: string;
  // Định danh ngắn gọn đối tượng bị tác động để dễ đọc bằng mắt thường.
  // VD: "Học sinh: NguyenVanA", "Bài học: Unit 1 - Hello"

  @Prop()
  description: string;
  // Mô tả lý do hoặc diễn giải hành động.
  // VD: "Cộng bù 500 vàng do lỗi hệ thống", "Ban nick vì spam".

  // 5. Dữ liệu kỹ thuật & Bằng chứng (Evidence)
  // ---------------------------------------------------------
  @Prop()
  ip: string; // Địa chỉ IP

  // Lưu chi tiết dữ liệu Trước và Sau khi thay đổi
  // Cấu trúc : { old: { ... }, new: { ... } }
  @Prop({ type: Object })
  detail: any;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
