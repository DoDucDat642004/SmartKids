import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HandbookItem, Rarity } from './entities/handbook-item.entity';
import { UserHandbook } from './entities/user-handbook.entity';

@Injectable()
export class HandbookService {
  constructor(
    @InjectModel(HandbookItem.name)
    private handbookItemModel: Model<HandbookItem>,
    @InjectModel(UserHandbook.name)
    private userHandbookModel: Model<UserHandbook>,
  ) {}

  // ================= ADMIN: QUẢN LÝ ITEM =================

  async createItem(dto: any) {
    return new this.handbookItemModel(dto).save();
  }

  async findAllItems() {
    return this.handbookItemModel.find().sort({ createdAt: -1 }).exec();
  }

  async deleteItem(id: string) {
    return this.handbookItemModel.findByIdAndDelete(id);
  }

  // ================= USER: BỘ SƯU TẬP & GACHA =================

  // 1. Lấy danh sách vật phẩm user đang sở hữu
  async getMyCollection(userId: string) {
    let collection = await this.userHandbookModel.findOne({ userId });

    // Nếu chưa có thì tạo mới rỗng
    if (!collection) {
      collection = await new this.userHandbookModel({
        userId,
        items: [],
      }).save();
    }
    return collection;
  }

  // 2. TÍNH NĂNG QUAN TRỌNG: MỞ HỘP QUÀ (Random Sticker)
  async openMysteryBox(userId: string) {
    // A. Lấy tất cả item trong DB
    const allItems = await this.handbookItemModel.find().exec();
    if (allItems.length === 0)
      throw new NotFoundException('Chưa có vật phẩm nào trong hệ thống');

    // B. Thuật toán Random theo độ hiếm (Weighted Random)
    // Tỷ lệ: Common (60%), Rare (25%), Epic (10%), Legendary (5%)
    const rarityWeights = {
      [Rarity.COMMON]: 60,
      [Rarity.RARE]: 25,
      [Rarity.EPIC]: 10,
      [Rarity.LEGENDARY]: 5,
    };

    // Tạo bể chứa (Pool) để random
    const pool: HandbookItem[] = [];
    allItems.forEach((item) => {
      const weight = rarityWeights[item.rarity] || 10;
      // Item càng hiếm thì số lượng bỏ vào pool càng ít -> Tỉ lệ ra càng thấp
      for (let i = 0; i < weight; i++) {
        pool.push(item);
      }
    });

    // C. Chọn ngẫu nhiên 1 item từ pool
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selectedItem = pool[randomIndex];

    // D. Lưu vào túi đồ của User (UserHandbook)
    // $addToSet giúp không bị trùng (nếu bạn muốn user chỉ sở hữu 1 cái mỗi loại)
    // Nếu muốn sở hữu nhiều cái giống nhau thì dùng $push
    await this.userHandbookModel.findOneAndUpdate(
      { userId },
      {
        $addToSet: { items: selectedItem['_id'] }, // Chỉ thêm ID vào mảng
        $setOnInsert: { userId },
      },
      { upsert: true, new: true },
    );

    // E. Trả về item vừa nhận được để Frontend hiển thị hiệu ứng
    return selectedItem;
  }

  // 1. Thêm thẻ vào bộ sưu tập của User
  async addItemsToUser(userId: string, itemIds: string[]) {
    if (!itemIds || itemIds.length === 0) return [];

    // updateOne với upsert: true (Nếu chưa có UserHandbook thì tạo mới)
    // $addToSet: Chỉ thêm nếu chưa có (tránh trùng)
    await this.userHandbookModel.updateOne(
      { userId },
      {
        $addToSet: { items: { $each: itemIds } },
        $setOnInsert: { userId },
      },
      { upsert: true },
    );

    // Trả về thông tin chi tiết của các thẻ vừa thêm (để hiện Popup)
    return this.handbookItemModel.find({ _id: { $in: itemIds } }).exec();
  }
}
