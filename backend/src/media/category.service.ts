import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  VideoCategory,
  VideoCategoryDocument,
} from './entities/video-category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(VideoCategory.name)
    private catModel: Model<VideoCategoryDocument>,
  ) {}

  // 1. Tạo chủ đề mới
  async create(data: any) {
    return new this.catModel(data).save();
  }

  // 2. Lấy danh sách (Có thể filter theo type: cartoon/music)
  async findAll(type?: string) {
    const filter = type && type !== 'ALL' ? { type } : {};
    return this.catModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  // 3. Lấy chi tiết 1 chủ đề (Kèm danh sách Video đầy đủ)
  async findOne(id: string) {
    return this.catModel.findById(id).populate('videos').exec();
  }

  // 4. Thêm Video vào Chủ đề
  async addVideo(categoryId: string, mediaId: string) {
    return this.catModel
      .findByIdAndUpdate(
        categoryId,
        { $addToSet: { videos: mediaId } }, // $addToSet để không trùng video
        { new: true },
      )
      .populate('videos');
  }

  // 5. Xóa Video khỏi Chủ đề
  async removeVideo(categoryId: string, mediaId: string) {
    return this.catModel
      .findByIdAndUpdate(
        categoryId,
        { $pull: { videos: mediaId } }, // $pull để xóa
        { new: true },
      )
      .populate('videos');
  }

  // 6. Xóa chủ đề
  async delete(id: string) {
    return this.catModel.findByIdAndDelete(id);
  }
}
