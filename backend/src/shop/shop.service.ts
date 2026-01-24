import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item, ItemDocument } from './entities/item.entity';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/users/entities/user.entity';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(data: any): Promise<Item> {
    const newItem = new this.itemModel(data);
    return newItem.save();
  }

  async findAll(type?: string): Promise<Item[]> {
    const filter = type && type !== 'ALL' ? { type } : {};
    return this.itemModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async update(id: string, data: any): Promise<Item> {
    const updatedItem = await this.itemModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updatedItem) throw new NotFoundException('Item not found');
    return updatedItem;
  }

  async remove(id: string): Promise<any> {
    return this.itemModel.findByIdAndDelete(id).exec();
  }

  // 🔥 1. MUA VẬT PHẨM
  async buyItem(userId: string, itemId: string) {
    // Tìm User và Item
    const user = await this.userModel.findById(userId);
    const item = await this.itemModel.findById(itemId);

    if (!user || !item) throw new NotFoundException('User or Item not found');

    const isOwned = user.inventory.some((id) => id.toString() === itemId);
    if (isOwned) {
      throw new BadRequestException('Bạn đã sở hữu vật phẩm này rồi!');
    }

    // Kiểm tra tiền
    const currency = item.currency === 'DIAMOND' ? 'diamond' : 'gold';
    if (user.stats[currency] < item.price) {
      throw new BadRequestException(`Bạn không đủ ${currency}!`);
    }

    // Trừ tiền & Thêm vào kho (Transaction logic)
    user.stats[currency] -= item.price;

    user.inventory.push(new Types.ObjectId(itemId));

    await user.save();

    return {
      message: 'Mua thành công!',
      newBalance: user.stats,
      inventory: user.inventory,
    };
  }

  // 2. TRANG BỊ VẬT PHẨM
  async equipItem(userId: string, itemId: string) {
    const user = await this.userModel.findById(userId);
    const item = await this.itemModel.findById(itemId);

    if (!user || !item) throw new NotFoundException('Not found');

    // Phải sở hữu mới được mặc
    const isOwned = user.inventory.some((id) => id.toString() === itemId);
    if (!isOwned) {
      throw new BadRequestException('Bạn chưa sở hữu vật phẩm này!');
    }

    const slot = item.type.toLowerCase();

    if (!user) return;

    // Cập nhật User (Sub-schema equipped)
    if (user.equipped[slot] === itemId) {
      user.equipped[slot] = null;
    } else {
      user.equipped[slot] = itemId;
    }

    // CẬP NHẬT PET Ở ROOT
    if (item.type === 'PET') {
      const currentPetId = user.equippedPet
        ? user.equippedPet.toString()
        : null;

      if (currentPetId === itemId) {
        user.equippedPet = null as any;
      } else {
        user.equippedPet = new Types.ObjectId(itemId) as any;
      }
    }

    await user.save();

    return {
      message: 'Cập nhật trang bị thành công',
      equipped: user.equipped,
      equippedPet: user.equippedPet,
    };
  }
}
