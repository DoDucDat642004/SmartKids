import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Media } from './entities/media.entity';
import { Model } from 'mongoose';

@Injectable()
export class MediaService {
  constructor(@InjectModel(Media.name) private mediaModel: Model<Media>) {}
  async create(createMediaDto: CreateMediaDto): Promise<Media> {
    const newMedia = new this.mediaModel(createMediaDto);
    return newMedia.save();
  }

  // 2. Lấy danh sách
  async findAll(query: any): Promise<Media[]> {
    const filter: any = {};

    if (query.type && query.type !== 'ALL') {
      filter.type = query.type;
    }

    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }

    return this.mediaModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async update(id: string, updateMediaDto: any) {
    return this.mediaModel
      .findByIdAndUpdate(id, updateMediaDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.mediaModel.findByIdAndDelete(id).exec();
  }
}
