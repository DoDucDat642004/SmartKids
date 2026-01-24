import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 1. Package (Gói cước)
export type PackageDocument = Package & Document;
@Schema({ timestamps: true })
export class Package {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) price: number;
  @Prop() originalPrice: number;
  @Prop({ required: true }) duration: number; // Ngày
  @Prop([String]) benefits: string[];
  @Prop() badge?: string;
  @Prop({ default: true }) isActive: boolean;
}
export const PackageSchema = SchemaFactory.createForClass(Package);

// 2. Transaction (Giao dịch)
export type TransactionDocument = Transaction & Document;
@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) packageId: string;
  @Prop({ required: true }) amount: number;
  @Prop({ required: true }) method: string;
  @Prop({ default: 'PENDING' }) status: 'PENDING' | 'SUCCESS' | 'FAILED';
  @Prop() code: string; // Mã giao dịch
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// 3. Subscription (Thuê bao)
export type SubscriptionDocument = Subscription & Document;
@Schema({ timestamps: true })
export class Subscription {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) packageId: string;
  @Prop({ required: true }) startDate: Date;
  @Prop({ required: true }) endDate: Date;
  @Prop({ default: 'ACTIVE' }) status: 'ACTIVE' | 'EXPIRED' | 'CANCELED';
}
export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
