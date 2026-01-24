import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Item } from 'src/shop/entities/item.entity';

export type UserDocument = User & Document;

// Tạo Sub-schema cho trang bị
@Schema({ _id: false })
class EquippedItems {
  @Prop({ default: null }) hat: string; // Lưu URL ảnh hoặc ID item
  @Prop({ default: null }) glasses: string;
  @Prop({ default: null }) pet: string;
  @Prop({ default: null }) skin: string;
}

// --- 1. SUB-SCHEMA: THỐNG KÊ GAME (GAMIFICATION) ---
@Schema({ _id: false })
export class UserStats {
  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  currentXP: number;

  @Prop({ default: 100 }) // XP cần để lên cấp tiếp theo
  nextLevelXP: number;

  @Prop({ default: 0 })
  gold: number; // Tiền vàng (mua đồ)

  @Prop({ default: 0 })
  diamond: number; // Kim cương (cao cấp)

  @Prop({ default: 0 })
  streak: number; // Chuỗi ngày học liên tiếp

  @Prop({ type: Date, default: Date.now })
  lastLogin: Date; // Để tính streak
}

// --- 2. SUB-SCHEMA: TIẾN ĐỘ HỌC TẬP ---
@Schema({ _id: false })
export class LearningProgress {
  @Prop({ type: Types.ObjectId, ref: 'Course' }) // Link tới bảng Course (nếu có)
  courseId: Types.ObjectId;

  @Prop({ default: 0 })
  completedLessons: number; // Số bài đã học

  @Prop({ default: 0 })
  totalScore: number; // Tổng điểm làm bài tập
}

// --- 3. MAIN SCHEMA: USER ---
@Schema({ timestamps: true }) // Tự động tạo createdAt, updatedAt
export class User {
  // --- THÔNG TIN ĐĂNG NHẬP ---
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string; // Lưu hash (đã mã hóa), KHÔNG lưu plain text

  @Prop({ required: true })
  fullName: string;

  @Prop({ default: 'STUDENT' })
  role: string;

  // --- HỒ SƠ CÁ NHÂN (PROFILE) ---
  @Prop({ default: 'https://i.pravatar.cc/150?img=1' }) // Avatar mặc định
  avatar: string;

  @Prop({ unique: true })
  studentId: string; // Mã định danh ngắn (VD: SK123456) dùng để kết bạn/tạo QR

  @Prop()
  phoneNumber?: string; // Tùy chọn cho phụ huynh

  // --- GAMIFICATION & THỐNG KÊ ---
  @Prop({ type: UserStats, default: () => ({}) })
  stats: UserStats;

  // --- HỌC TẬP ---
  @Prop({ type: [LearningProgress], default: [] })
  progress: LearningProgress[];

  // --- XÃ HỘI (KẾT BẠN) ---
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  friends: Types.ObjectId[]; // Danh sách ID bạn bè

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  friendRequests: Types.ObjectId[]; // Lời mời kết bạn đang chờ

  // --- KHO ĐỒ ---
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Item' }], default: [] })
  inventory: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  // Mới: Đồ đang mặc
  @Prop({ type: EquippedItems, default: () => ({}) })
  equipped: EquippedItems;

  @Prop({ type: Types.ObjectId, ref: 'Item', default: null })
  equippedPet: Item;

  createdAt?: Date;
  updatedAt?: Date;
}

// Schema Learner (Học viên)
@Schema()
export class Learner {
  @Prop({ required: true }) name: string; // Bé Na
  @Prop() avatar: string;
  @Prop() age: number;

  // Link tới tài khoản cha mẹ
  @Prop({ type: Types.ObjectId, ref: 'User' })
  parentId: User;

  @Prop({ default: 0 }) xp: number;
  @Prop({ default: 0 }) gold: number;
  @Prop({ default: 1 }) level: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// --- INDEXING (Tối ưu tìm kiếm) ---
UserSchema.index({ email: 1 });
UserSchema.index({ studentId: 1 });
