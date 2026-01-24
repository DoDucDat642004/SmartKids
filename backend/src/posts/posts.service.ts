import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogPost } from './entities/post.entity';
import slugify from 'slugify';

@Injectable()
export class PostsService {
  constructor(@InjectModel(BlogPost.name) private postModel: Model<BlogPost>) {}

  async create(createPostDto: any, userId: string) {
    console.log('--- DEBUG SCHEMA ---');
    console.log(this.postModel.schema.paths);

    const slug =
      slugify(createPostDto.title, { lower: true, strict: true }) +
      '-' +
      Date.now();

    const newPost = new this.postModel({
      ...createPostDto,
      slug,
      author: userId,
    });

    return newPost.save();
  }

  // Lấy danh sách
  async findAll(category?: string) {
    const filter = { isPublished: true };
    if (category && category !== 'ALL') {
      filter['category'] = category;
    }

    return this.postModel
      .find(filter)
      .populate('author', 'fullName avatar')
      .sort({ createdAt: -1 }) // Bài mới nhất lên đầu
      .exec();
  }

  // Lấy chi tiết bằng Slug (để URL đẹp)
  async findBySlug(slug: string) {
    const post = await this.postModel
      .findOneAndUpdate(
        { slug },
        { $inc: { views: 1 } }, // Tăng view khi xem
        { new: true },
      )
      .populate('author', 'fullName avatar');

    if (!post) throw new NotFoundException('Bài viết không tồn tại');
    return post;
  }

  async findAllAdmin() {
    return this.postModel
      .find() // Không lọc isPublished
      .populate('author', 'fullName email')
      .sort({ createdAt: -1 })
      .exec();
  }

  // 2. Cập nhật bài viết
  async update(id: string, updateData: any) {

    return this.postModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  // 3. Xóa bài viết
  async remove(id: string) {
    return this.postModel.findByIdAndDelete(id);
  }
}
