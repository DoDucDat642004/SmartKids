import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  // 1. Tạo mới
  async create(createQuestionDto: any): Promise<Question> {
    const newQuestion = new this.questionModel(createQuestionDto);
    return newQuestion.save();
  }

  // 2. Lấy danh sách (tìm kiếm & lọc)
  async findAll(query: any): Promise<Question[]> {
    const filter: any = {};

    if (query.type) filter.type = query.type;
    if (query.difficulty) filter.difficulty = query.difficulty;
    if (query.search) {
      filter.content = { $regex: query.search, $options: 'i' }; // Tìm gần đúng
    }

    return this.questionModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  // 3. Lấy chi tiết 1 câu
  async findOne(id: string): Promise<Question> {
    const question = await this.questionModel.findById(id).exec();
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  // 4. Cập nhật
  async update(id: string, updateQuestionDto: any) {
    return this.questionModel
      .findByIdAndUpdate(id, updateQuestionDto, { new: true })
      .exec();
  }

  // 5. Xóa
  async remove(id: string): Promise<any> {
    return this.questionModel.findByIdAndDelete(id).exec();
  }
}
