import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Package,
  PackageDocument,
  Transaction,
  TransactionDocument,
  Subscription,
  SubscriptionDocument,
} from './entities/finance.entity';

@Injectable()
export class FinanceService {
  constructor(
    @InjectModel(Package.name) private packageModel: Model<PackageDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  // --- PACKAGES ---
  async createPackage(data: any) {
    return new this.packageModel(data).save();
  }
  async getPackages(activeOnly = false) {
    const filter = activeOnly ? { isActive: true } : {};
    return this.packageModel.find(filter).exec();
  }
  async updatePackage(id: string, data: any) {
    return this.packageModel.findByIdAndUpdate(id, data, { new: true });
  }
  async deletePackage(id: string) {
    return this.packageModel.findByIdAndDelete(id);
  }

  // --- TRANSACTIONS ---
  async createTransaction(data: any) {
    // 1. Tạo giao dịch
    const trx = await new this.transactionModel(data).save();

    // 2. Nếu thành công -> Kích hoạt Subscription
    if (trx.status === 'SUCCESS') {
      await this.activateSubscription(trx.userId, trx.packageId);
    }
    return trx;
  }

  async getTransactions() {
    return this.transactionModel
      .find()
      .sort({ createdAt: -1 })
      .populate('packageId', 'name')
      .exec();
  }

  // --- SUBSCRIPTIONS ---
  async getSubscriptions() {
    return this.subscriptionModel
      .find()
      .populate('packageId', 'name')
      .sort({ endDate: -1 })
      .exec();
  }

  // Kích hoạt gói (Private function)
  private async activateSubscription(userId: string, packageId: string) {
    const pack = await this.packageModel.findById(packageId);
    if (!pack) return;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + pack.duration); // Cộng ngày

    // Tắt các gói cũ nếu có
    await this.subscriptionModel.updateMany(
      { userId, status: 'ACTIVE' },
      { status: 'CANCELED' },
    );

    // Tạo gói mới
    await new this.subscriptionModel({
      userId,
      packageId,
      startDate,
      endDate,
      status: 'ACTIVE',
    }).save();
  }
}
