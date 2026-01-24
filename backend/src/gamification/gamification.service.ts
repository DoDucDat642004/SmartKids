import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quest, QuestDocument } from './entities/quest.entity';
import { LevelConfig, LevelConfigDocument } from './entities/level.entity';
import {
  Achievement,
  AchievementDocument,
  BadgeCriteriaType,
} from './entities/achievement.entity';
import {
  UserQuestProgress,
  UserQuestProgressDocument,
} from './entities/user-quest-progress.entity';
import { UserBadge, UserBadgeDocument } from './entities/user-badge.entity';
import { UsersService } from 'src/users/users.service';
import { User, UserDocument } from 'src/users/entities/user.entity';

@Injectable()
export class GamificationService {
  constructor(
    @InjectModel(Quest.name) private questModel: Model<QuestDocument>,
    @InjectModel(LevelConfig.name)
    private levelModel: Model<LevelConfigDocument>,
    @InjectModel(Achievement.name)
    private achievementModel: Model<AchievementDocument>,
    @InjectModel(UserQuestProgress.name)
    private progressModel: Model<UserQuestProgressDocument>,
    @InjectModel(UserBadge.name)
    private userBadgeModel: Model<UserBadgeDocument>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // ==========================================
  // PHẦN 1: QUẢN LÝ CRUD (ADMIN) - GIỮ NGUYÊN
  // ==========================================
  async createQuest(data: any) {
    return new this.questModel(data).save();
  }
  async getQuests() {
    return this.questModel.find().exec();
  }
  async updateQuest(id: string, data: any) {
    return this.questModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
  async deleteQuest(id: string) {
    return this.questModel.findByIdAndDelete(id).exec();
  }

  async createLevel(data: any) {
    return new this.levelModel(data).save();
  }
  async getLevels() {
    return this.levelModel.find().sort({ level: 1 }).exec();
  }
  async updateLevel(id: string, data: any) {
    return this.levelModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
  async deleteLevel(id: string) {
    return this.levelModel.findByIdAndDelete(id).exec();
  }

  async createAchievement(data: any) {
    return new this.achievementModel(data).save();
  }
  async getAchievements() {
    return this.achievementModel.find().exec();
  }
  async updateAchievement(id: string, data: any) {
    return this.achievementModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }
  async deleteAchievement(id: string) {
    return this.achievementModel.findByIdAndDelete(id).exec();
  }

  // ==========================================
  // PHẦN 2: LOGIC CLIENT (USER)
  // ==========================================

  // 1. Lấy danh sách nhiệm vụ hôm nay & Trạng thái
  async getMyQuests(userId: string) {
    const today = new Date().toISOString().split('T')[0];

    // a. Lấy Quest active
    const quests = await this.questModel.find({ isActive: true }).exec();

    // b. Lấy Progress hôm nay
    const progressLogs = await this.progressModel
      .find({ userId, trackingDate: today })
      .exec();

    // c. Map dữ liệu
    return quests.map((quest) => {
      const log = progressLogs.find((p) => p.questId === quest._id.toString());
      return {
        ...quest.toObject(),
        progress: log ? log.progress : 0,
        isClaimed: log ? log.isClaimed : false,
        isCompleted: log ? log.progress >= quest.target : false,
      };
    });
  }

  // 2. Track Progress: Gọi hàm này mỗi khi User làm gì đó (Học xong, Thắng game...)
  async trackProgress(userId: string, type: string, amount: number = 1) {
    const today = new Date().toISOString().split('T')[0];

    // A. XỬ LÝ NHIỆM VỤ NGÀY (DAILY QUESTS)
    const relevantQuests = await this.questModel.find({ type, isActive: true });

    for (const quest of relevantQuests) {
      await this.progressModel.findOneAndUpdate(
        { userId, questId: quest._id.toString(), trackingDate: today },
        {
          $setOnInsert: { isClaimed: false }, // Nếu mới tạo thì chưa nhận
          $inc: { progress: amount }, // Cộng dồn tiến độ
        },
        { upsert: true, new: true },
      );
    }

    // B. XỬ LÝ THÀNH TỰU (ACHIEVEMENTS) - CHECK TỰ ĐỘNG
    // Mỗi khi progress tăng, kiểm tra xem có đạt Huy hiệu nào không
    await this.checkAndUnlockAchievements(userId);
  }

  // 3. Nhận thưởng (Claim Reward) - Cần kết nối UsersService
  async claimReward(userId: string, questId: string) {
    const today = new Date().toISOString().split('T')[0];

    // a. Check Quest
    const quest = await this.questModel.findById(questId);
    if (!quest) throw new NotFoundException('Nhiệm vụ không tồn tại');

    // b. Check Progress
    const log = await this.progressModel.findOne({
      userId,
      questId,
      trackingDate: today,
    });

    if (!log || log.progress < quest.target) {
      throw new BadRequestException('Bạn chưa hoàn thành nhiệm vụ này!');
    }

    if (log.isClaimed) {
      throw new BadRequestException('Bạn đã nhận thưởng rồi!');
    }

    // c. Đánh dấu đã nhận
    log.isClaimed = true;
    await log.save();

    // d. CỘNG THƯỞNG VÀO TÀI KHOẢN USER (QUAN TRỌNG)
    const { gold, xp } = quest.rewards;

    if (gold > 0) {
      await this.usersService.addGift(userId, { gold });
    }
    if (xp > 0) {
      await this.usersService.addXp(userId, xp);
    }

    return {
      message: 'Nhận thưởng thành công!',
      received: quest.rewards,
    };
  }

  // ==========================================
  // PHẦN 3: LOGIC THÀNH TỰU (ACHIEVEMENTS)
  // ==========================================

  // HÀM KIỂM TRA VÀ TRAO HUY HIỆU TỰ ĐỘNG
  async checkAndUnlockAchievements(userId: string) {
    // 1. Lấy thông tin hiện tại của User để so sánh
    const user = await this.userModel.findById(userId);
    if (!user) return;
    const completedLessonsCount = await this.userModel.countDocuments({
      userId,
      isCompleted: true,
    });

    // 2. Lấy tất cả các luật (Achievements) trong hệ thống
    const allAchievements = await this.achievementModel.find().exec();

    // 3. Lấy danh sách huy hiệu user ĐÃ CÓ (để không trao trùng)
    const ownedBadges = await this.userBadgeModel.find({ userId }).exec();

    const ownedBadgeIds = new Set(ownedBadges.map((b) => b.achievementId));

    // 4. DUYỆT QUA TỪNG LUẬT ĐỂ KIỂM TRA
    for (const achievement of allAchievements) {
      // Nếu đã có rồi thì bỏ qua
      if (ownedBadgeIds.has(achievement._id.toString())) continue;

      let isUnlocked = false;

      // --- LOGIC SO SÁNH ĐIỀU KIỆN ---
      switch (achievement.criteria.type) {
        case BadgeCriteriaType.TOTAL_XP:
          if (user.stats.currentXP >= achievement.criteria.value) {
            isUnlocked = true;
          }
          break;

        case BadgeCriteriaType.LESSONS_COMPLETED:
          if (completedLessonsCount >= achievement.criteria.value) {
            isUnlocked = true;
          }
          break;

        case BadgeCriteriaType.STREAK_DAYS:
          if (user.stats.streak >= achievement.criteria.value) {
            isUnlocked = true;
          }
          break;
      }

      // 5. NẾU ĐẠT -> TRAO HUY HIỆU
      if (isUnlocked) {
        await this.unlockBadge(user, achievement);
      }
    }
  }

  // Hàm trao thưởng (lưu vào DB)
  private async unlockBadge(user: any, achievement: AchievementDocument) {
    // a. Lưu UserBadge
    await new this.userBadgeModel({
      userId: user._id,
      badgeId: achievement._id, // Link tới Achievement gốc
      name: achievement.name,
      imageUrl: achievement.imageUrl,
      isUnlocked: true,
    }).save();

    // b. Cộng thưởng
    if (achievement.rewards) {
      user.stats.gold += achievement.rewards.gold || 0;
      user.stats.diamond += achievement.rewards.diamond || 0;
      await user.save();
    }

    console.log(`🎉 User ${user.fullName} unlocked badge: ${achievement.name}`);
  }
}
