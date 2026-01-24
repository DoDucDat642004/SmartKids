import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { Report } from './entities/report.entity';
import { Model } from 'mongoose';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Report.name) private reportModel: Model<Report>,
  ) {}
  // --- POSTS ---
  async getPosts(status: string) {
    const filter = status === 'ALL' ? {} : { status };
    return this.postModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async updatePostStatus(id: string, status: string) {
    return this.postModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }

  async updatePostLike(id: string, liked: boolean) {
    const post = await this.postModel.findById(id);
    const like = (post ? post.likes : 0) + 1;
    return this.postModel.findByIdAndUpdate(id, { like }, { new: true }).exec();
  }

  async deletePost(id: string) {
    return this.postModel.findByIdAndDelete(id).exec();
  }

  async toggleFeature(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    post.isFeatured = !post.isFeatured;
    return post.save();
  }

  // --- REPORTS ---
  async getReports(status: string) {
    const filter = status === 'ALL' ? {} : { status };
    return this.reportModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async resolveReport(id: string, action: 'RESOLVED' | 'DISMISSED') {
    return this.reportModel
      .findByIdAndUpdate(id, { status: action }, { new: true })
      .exec();
  }
}
