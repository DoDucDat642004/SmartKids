import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './entities/audit.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog.name) private auditModel: Model<AuditLogDocument>,
  ) {}

  // 1. Hàm ghi log (Gọi từ các Service khác)
  async log(data: {
    actorId: string;
    actorName: string;
    action: string;
    module: string;
    target: string;
    description?: string;
    ip?: string;
    detail?: any;
  }) {
    const newLog = new this.auditModel(data);
    newLog.save().catch((err) => console.error('Audit Error:', err));
  }

  // 2. Hàm lấy log cho trang Admin
  async findAll(query: any) {
    const { page = 1, limit = 20, module, search } = query;
    const filter: any = {};

    if (module && module !== 'ALL') filter.module = module;
    if (search) {
      filter.$or = [
        { actorName: { $regex: search, $options: 'i' } },
        { target: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.auditModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      this.auditModel.countDocuments(filter),
    ]);

    return { data, total, page, limit };
  }
}
