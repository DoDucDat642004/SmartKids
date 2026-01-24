import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SystemSetting extends Document {
  // 1. Thông tin chung
  @Prop({ default: 'SmartKids' }) appName: string;
  @Prop() appLogo: string;
  @Prop() supportEmail: string;
  @Prop() supportPhone: string;

  // 2. Cấu hình Ứng dụng Mobile (Force Update)
  @Prop() minIosVersion: string; // VD: 1.0.5 (Nếu thấp hơn -> Bắt update)
  @Prop() minAndroidVersion: string;
  @Prop() iosStoreLink: string;
  @Prop() androidStoreLink: string;

  // 3. Hệ thống & Bảo trì
  @Prop({ default: false }) maintenanceMode: boolean; // Bật bảo trì toàn hệ thống
  @Prop() maintenanceMessage: string; // "Hệ thống đang nâng cấp, vui lòng quay lại sau 15p"

  // 4. SEO & Mạng xã hội
  @Prop() facebookUrl: string;
  @Prop() youtubeUrl: string;
  @Prop() defaultSeoTitle: string;
  @Prop() defaultSeoDesc: string;

  // 5. Tích hợp (API Keys - Chỉ lưu các key Public, key Private nên để .env)
  @Prop() firebaseConfig: string;
  @Prop() gaMeasurementId: string; // Google Analytics
}

export const SystemSettingSchema = SchemaFactory.createForClass(SystemSetting);
