import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PracticeQuestion,
  PracticeQuestionDocument,
} from './entities/practice-question.entity';
import { GameResult, GameResultDocument } from './entities/game-result.entity';
import { UsersService } from 'src/users/users.service';
import { GamificationService } from 'src/gamification/gamification.service';

@Injectable()
export class PracticeService {
  constructor(
    @InjectModel(PracticeQuestion.name)
    private questionModel: Model<PracticeQuestionDocument>,
    @InjectModel(GameResult.name)
    private gameResultModel: Model<GameResultDocument>,

    // Inject UsersService để cộng tiền/XP
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,

    // Inject GamificationService để check nhiệm vụ hàng ngày
    @Inject(forwardRef(() => GamificationService))
    private gamificationService: GamificationService,
  ) {}

  // ==================================================
  // 1. ADMIN: QUẢN LÝ CÂU HỎI (CRUD)
  // ==================================================
  async create(dto: any) {
    return new this.questionModel(dto).save();
  }

  async findAll(query: any) {
    return this.questionModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async update(id: string, dto: any) {
    return this.questionModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    return this.questionModel.findByIdAndDelete(id);
  }

  // ==================================================
  // 2. CLIENT: CHUẨN BỊ GAME
  // ==================================================

  // Lấy danh sách chủ đề (để hiện ở trang chọn bài)
  async getTopics(type: string) {
    return this.questionModel.aggregate([
      { $match: { type } },
      {
        $group: {
          _id: '$topic',
          image: { $first: '$topicImage' }, // Lấy ảnh topicImage đầu tiên tìm thấy
          count: { $sum: 1 }, // Đếm số câu hỏi
        },
      },
      { $project: { topic: '$_id', image: 1, count: 1, _id: 0 } },
    ]);
  }

  // Lấy danh sách câu hỏi ngẫu nhiên cho 1 lượt chơi
  async getGameQuestions(type: string, topic: string, limit = 10) {
    const matchQuery: any = { type };

    if (topic && topic !== 'ALL') {
      matchQuery.topic = topic;
    }

    // Dùng Aggregate $sample để lấy ngẫu nhiên
    return this.questionModel.aggregate([
      { $match: matchQuery },
      { $sample: { size: Number(limit) } },
    ]);
  }

  // ==================================================
  // 3. CLIENT: KẾT THÚC GAME & THƯỞNG
  // ==================================================

  async completePractice(
    userId: string,
    dto: {
      gameType: string;
      topic: string;
      score: number;
      earnedGold;
      earnedXP;
    },
  ) {
    const { gameType, topic, score, earnedGold, earnedXP } = dto;

    // A. Lưu lịch sử chơi vào DB
    const result = await new this.gameResultModel({
      userId,
      gameType,
      topic,
      score,
      completedAt: new Date(),
      rewards: { gold: earnedGold || 0, xp: earnedXP || 0 },
    }).save();

    // B. Tính toán phần thưởng
    // Công thức: 10 điểm = 1 Vàng, 5 điểm = 1 XP (Tùy chỉnh theo ý bạn)
    const finalGold =
      earnedGold !== undefined ? earnedGold : Math.floor(score / 10);
    const finalXP = earnedXP !== undefined ? earnedXP : Math.floor(score / 5);

    // C. Cộng thưởng vào tài khoản User
    if (finalGold > 0) {
      await this.usersService.addGift(userId, { gold: finalGold });
    }
    if (finalXP > 0) {
      await this.usersService.addXp(userId, finalXP);
    }

    // D. Cập nhật tiến độ Nhiệm vụ (Gamification)
    // VD: Nhiệm vụ "Làm bài tập toán", "Chơi game"...
    try {
      // Track nhiệm vụ chung: Chơi game bất kỳ
      await this.gamificationService.trackProgress(userId, 'PRACTICE_GAME', 1);

      // Track nhiệm vụ theo loại: VD thắng game Quiz
      if (gameType === 'quiz') {
        await this.gamificationService.trackProgress(userId, 'QUIZ_GAME', 1);
      }
    } catch (error) {
      console.error('Lỗi track gamification:', error);
    }

    // E. Kiểm tra kỷ lục (High Score)
    // Xem lượt chơi này có phải là điểm cao nhất từ trước đến giờ không
    const userStats = await this.getUserStats(userId);
    const currentHighScore = userStats[gameType] || 0;
    const isNewRecord = score > currentHighScore;

    return {
      success: true,
      resultId: result._id,
      rewards: {
        gold: earnedGold,
        xp: earnedXP,
      },
      isNewRecord, // Frontend có thể dùng để hiện hiệu ứng "Kỷ lục mới!"
    };
  }

  // ==================================================
  // 4. CLIENT: THỐNG KÊ & BẢNG XẾP HẠNG
  // ==================================================

  // Lấy điểm cao nhất của User ở từng game
  async getUserStats(userId: string) {
    const stats = await this.gameResultModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$gameType',
          highScore: { $max: '$score' },
        },
      },
    ]);

    return stats.reduce((acc, curr) => {
      acc[curr._id] = curr.highScore;
      return acc;
    }, {});
  }

  // Lấy lịch sử chơi gần đây
  async getHistory(userId: string, limit = 10) {
    return this.gameResultModel
      .find({ userId })
      .sort({ completedAt: -1 })
      .limit(limit)
      .exec();
  }

  // Lấy bảng xếp hạng Top 10 người điểm cao nhất theo loại game
  async getLeaderboard(gameType: string) {
    return this.gameResultModel.aggregate([
      { $match: { gameType } },
      { $sort: { score: -1 } }, // Sắp xếp điểm giảm dần
      { $limit: 10 }, // Lấy top 10
      // Join với bảng User để lấy tên và avatar
      {
        $lookup: {
          from: 'users',
          let: { uId: { $toObjectId: '$userId' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$uId'] } } },
            { $project: { fullName: 1, avatar: 1 } },
          ],
          as: 'userInfo',
        },
      },
      { $unwind: '$userInfo' }, // Làm phẳng mảng
      {
        $project: {
          score: 1,
          topic: 1,
          date: '$createdAt',
          userName: '$userInfo.fullName',
          userAvatar: '$userInfo.avatar',
        },
      },
    ]);
  }
}
