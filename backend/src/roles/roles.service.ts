import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async create(dto: any) {
    // Check trùng tên
    const exist = await this.roleModel.findOne({ name: dto.name });
    if (exist) throw new BadRequestException('Tên vai trò đã tồn tại');
    return new this.roleModel(dto).save();
  }

  async findAll() {
    return this.roleModel.find().exec();
  }

  async findById(id: string) {
    return this.roleModel.findById(id).exec();
  }

  async update(id: string, dto: any) {
    const role = await this.roleModel.findById(id);
    if (!role) return;
    if (role.isSystem)
      throw new BadRequestException('Không thể sửa vai trò hệ thống');
    return this.roleModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    const role = await this.roleModel.findById(id);
    if (!role) return;
    if (role.isSystem)
      throw new BadRequestException('Không thể xóa vai trò hệ thống');
    return this.roleModel.findByIdAndDelete(id);
  }
}
