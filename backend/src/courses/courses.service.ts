import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from './entities/course.entity';
import { Unit } from './entities/unit.entity';
import { Lesson } from './entities/lesson.entity';
import { GamificationService } from 'src/gamification/gamification.service';
import {
  UserProcess,
  UserProcessDocument,
} from './entities/user-process.entity';
import { UsersService } from 'src/users/users.service';
import { PracticeQuestion } from 'src/practice/entities/practice-question.entity';
import { MilestoneType, UserMilestone } from './entities/user-milestone.entity';
import { HandbookService } from 'src/handbook/handbook.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Unit.name) private unitModel: Model<Unit>,
    @InjectModel(Lesson.name) private lessonModel: Model<Lesson>,
    @InjectModel(UserProcess.name)
    private userProcessModel: Model<UserProcessDocument>,
    private gamificationService: GamificationService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @InjectModel(PracticeQuestion.name)
    private practiceQuestionModel: Model<PracticeQuestion>,
    @InjectModel(UserMilestone.name)
    private userMilestoneModel: Model<UserMilestone>,
    private handbookService: HandbookService,
  ) {}

  // 1. COURSE CRUD
  async createCourse(dto: any) {
    return new this.courseModel(dto).save();
  }

  async findAllCourses() {
    return this.courseModel
      .find()
      .populate({
        path: 'units',
        model: 'Unit',
        select: '_id title videoUrl',
        populate: {
          path: 'lessons',
          model: 'Lesson',
          select: '_id title videoUrl',
        },
      })
      .sort({ order: 1 })
      .exec();
  }

  async updateCourse(courseId: string, body: any) {
    return this.courseModel.findByIdAndUpdate(courseId, body, { new: true });
  }

  async deleteCourse(courseId: string) {
    const units = await this.unitModel.find({ courseId: courseId });
    const unitIds = units.map((u) => u._id);

    if (unitIds.length > 0) {
      await this.lessonModel.deleteMany({ unitId: { $in: unitIds } });
    }
    await this.unitModel.deleteMany({ courseId: courseId });
    return this.courseModel.findByIdAndDelete(courseId);
  }

  // 2. UNIT CRUD
  async createUnit(
    courseId: string,
    dto: { title: string; videoUrl?: string },
  ) {
    return new this.unitModel({
      courseId,
      title: dto.title,
      videoUrl: dto.videoUrl,
    }).save();
  }

  async updateUnit(unitId: string, body: any) {
    return this.unitModel.findByIdAndUpdate(unitId, body, { new: true });
  }

  async deleteUnit(unitId: string) {
    await this.lessonModel.deleteMany({ unitId });
    return this.unitModel.findByIdAndDelete(unitId);
  }

  // 3. LESSON CRUD
  async createLesson(unitId: string, dto: any) {
    return new this.lessonModel({
      unitId,
      title: dto.title,
      videoUrl: dto.videoUrl,

      type: dto.type || 'GAME',
      description: dto.description || '',
      materials: dto.materials || [],

      order: dto.order || 1,
    }).save();
  }

  async updateLessonInfo(lessonId: string, updateData: any) {
    return this.lessonModel.findByIdAndUpdate(lessonId, updateData, {
      new: true,
    });
  }

  async updateLessonContent(lessonId: string, activities: any[]) {
    return this.lessonModel.findByIdAndUpdate(
      lessonId,
      { activities },
      { new: true },
    );
  }

  async deleteLesson(lessonId: string) {
    return this.lessonModel.findByIdAndDelete(lessonId);
  }

  async findLesson(lessonId: string) {
    return this.lessonModel.findById(lessonId).exec();
  }

  // 4. LEARNING LOGIC (HỌC VIÊN)
  async getCourseTree(courseId: string, userId: string) {
    const course = await this.courseModel.findById(courseId).lean().exec();
    if (!course) throw new NotFoundException('Course not found');

    const units = await this.unitModel
      .find({ courseId })
      .sort({ order: 1 })
      .lean()
      .exec();
    const completedLessons = await this.userProcessModel
      .find({ userId, courseId, isCompleted: true })
      .select('lessonId')
      .exec();

    const completedSet = new Set(
      completedLessons.map((log) => log.lessonId.toString()),
    );

    const unitsWithLessons = await Promise.all(
      units.map(async (unit) => {
        let isPreviousLessonCompleted = true;

        const lessonsRaw = await this.lessonModel
          .find({ unitId: unit._id })
          .sort({ order: 1 })
          .lean()
          .exec();

        const lessons = lessonsRaw.map((lesson) => {
          const lessonId = lesson._id.toString();
          let status = 'LOCKED';

          if (completedSet.has(lessonId)) {
            status = 'COMPLETED';
            isPreviousLessonCompleted = true;
          } else if (isPreviousLessonCompleted) {
            status = 'UNLOCKED';
            isPreviousLessonCompleted = false;
          }
          return { ...lesson, status };
        });

        const unitCompletedCount = lessons.filter(
          (l) => l.status === 'COMPLETED',
        ).length;
        let unitStatus = 'LOCKED';
        if (lessons.length > 0) {
          if (unitCompletedCount === lessons.length) unitStatus = 'COMPLETED';
          else if (
            lessons.some(
              (l) => l.status === 'UNLOCKED' || l.status === 'COMPLETED',
            )
          )
            unitStatus = 'ACTIVE';
        }

        return { ...unit, status: unitStatus, lessons };
      }),
    );

    return {
      ...course,
      units: unitsWithLessons,
      totalLessons: unitsWithLessons.reduce(
        (acc, u) => acc + u.lessons.length,
        0,
      ),
      completedCount: completedSet.size,
    };
  }

  async getLessonDetail(lessonId: string) {
    const lesson = await this.lessonModel.findById(lessonId).lean().exec();
    if (!lesson) throw new NotFoundException('Lesson not found');

    if (lesson.activities && lesson.activities.length > 0) {
      lesson.activities = await Promise.all(
        lesson.activities.map(async (act: any) => {
          if (act.data && act.data.refId) {
            try {
              const question: any = await this.practiceQuestionModel
                .findById(act.data.refId)
                .lean()
                .exec();
              if (question) {
                const media = question.mediaUrl || '';
                const isVideo =
                  media.match(/\.(mp4|webm|ogg)$/i) || media.includes('youtu');
                const isAudio = media.match(/\.(mp3|wav)$/i);
                const isImage = media.match(/\.(jpeg|jpg|gif|png)$/i);

                return {
                  ...act,
                  data: {
                    ...act.data,
                    word: question.content,
                    question: question.content,
                    correctAnswers: question.correctAnswer
                      ? [question.correctAnswer]
                      : act.data.correctAnswers,
                    audio: isAudio ? media : act.data.audio || '',
                    video: isVideo ? media : act.data.video || '',
                    image: isImage ? media : act.data.image || '',
                    options: question.options
                      ? question.options.map((opt: string, idx: number) => ({
                          id: `opt-${idx}`,
                          text: opt,
                          isCorrect: opt === question.correctAnswer,
                        }))
                      : act.data.options,
                    pairs: question.pairs
                      ? question.pairs.map((p: any) => ({
                          contentA: p.left,
                          contentB: p.right,
                        }))
                      : act.data.pairs,
                  },
                };
              }
            } catch (err) {
              console.error(`Error populating question ${act.data.refId}`, err);
            }
          }
          return act;
        }),
      );
    }
    return lesson;
  }

  // C. HOÀN THÀNH BÀI HỌC
  async completeLesson(userId: string, lessonId: string) {
    const lesson = await this.lessonModel.findById(lessonId);
    if (!lesson) throw new NotFoundException('Lesson not found');

    // Lưu tiến độ bài học
    const unit = await this.unitModel.findById(lesson.unitId).lean();
    if (!unit) return;

    await this.userProcessModel.findOneAndUpdate(
      { userId, lessonId },
      {
        userId,
        lessonId,
        unitId: lesson.unitId,
        courseId: unit.courseId, // ✅
        isCompleted: true,
      },
      { upsert: true, new: true },
    );

    // Tính quà bài học
    const lessonRewards = (lesson as any)['rewards'] || { gold: 10, xp: 10 };
    await this.giveRewards(userId, lessonRewards);

    let unitEarned: any = null;
    let courseEarned: any = null;

    const chainResult = await this.checkAndCompleteUnit(
      userId,
      lesson.unitId.toString(),
    );

    if (chainResult) {
      unitEarned = chainResult.unitRewards;
      courseEarned = chainResult.courseRewards;
    }

    return {
      message: 'Lesson completed',
      earned: lessonRewards,
      unitEarned: unitEarned,
      courseEarned: courseEarned,
    };
  }

  private async checkAndCompleteUnit(userId: string, unitId: string) {
    const existingMilestone = await this.userMilestoneModel.findOne({
      userId,
      targetId: unitId,
      type: MilestoneType.UNIT,
    });

    if (existingMilestone) {
      return null;
    }

    const totalLessons = await this.lessonModel.countDocuments({ unitId });
    const completedLessons = await this.userProcessModel.countDocuments({
      userId,
      unitId,
      isCompleted: true,
    });

    if (completedLessons < totalLessons) return null;

    const unit = await this.unitModel.findById(unitId);
    if (!unit) return null;
    const rewards = (unit as any)['rewards'] || { gold: 50, xp: 100 };
    await this.giveRewards(userId, rewards);

    await this.userMilestoneModel.create({
      userId,
      targetId: unitId,
      type: MilestoneType.UNIT,
      isRewardClaimed: true,
    });

    const courseRewards = await this.checkAndCompleteCourse(
      userId,
      unit.courseId.toString(),
    );

    return {
      unitRewards: rewards,
      courseRewards: courseRewards,
    };
  }

  private async checkAndCompleteCourse(userId: string, courseId: string) {
    const existingMilestone = await this.userMilestoneModel.findOne({
      userId,
      targetId: courseId,
      type: MilestoneType.COURSE,
    });
    if (existingMilestone) return null;

    const units = await this.unitModel.find({ courseId }).select('_id');
    const unitIds = units.map((u) => u._id.toString());

    const totalLessons = await this.lessonModel.countDocuments({
      unitId: { $in: unitIds },
    });

    const userCompletedCount = await this.userProcessModel.countDocuments({
      userId,
      unitId: { $in: unitIds },
      isCompleted: true,
    } as any);

    console.log(`Course Check: ${userCompletedCount}/${totalLessons}`);

    if (userCompletedCount < totalLessons) return null;

    const course = await this.courseModel.findById(courseId);
    if (!course) return null;

    const rewards = (course as any)['rewards'] || { gold: 500, diamond: 5 };

    await this.giveRewards(userId, rewards);

    await this.userMilestoneModel.create({
      userId,
      targetId: courseId,
      type: MilestoneType.COURSE,
      isRewardClaimed: true,
    });

    return rewards;
  }

  // 4. Hàm trao quà
  private async giveRewards(userId: string, rewards: any) {
    // 1. Cộng XP
    if (rewards.xp) await this.usersService.addXp(userId, rewards.xp);

    // 2. Cộng Vàng/Kim cương
    if (rewards.gold || rewards.diamond) {
      await this.usersService.addCurrency(userId, {
        gold: rewards.gold || 0,
        diamond: rewards.diamond || 0,
      });
    }

    let earnedHandbookItems: any[] = [];
    let earnedInventoryItems: any[] = [];

    // 3. Cộng Thẻ bài (Handbook)
    if (rewards.handbookItems && rewards.handbookItems.length > 0) {
      earnedHandbookItems = await this.handbookService.addItemsToUser(
        userId,
        rewards.handbookItems,
      );
    }

    // 4. Cộng Vật phẩm (Inventory)
    if (rewards.items && rewards.items.length > 0) {
      earnedInventoryItems = await this.usersService.addInventoryItems(
        userId,
        rewards.items,
      );
    }

    return {
      ...rewards,
      handbookDetails: earnedHandbookItems,
      itemDetails: earnedInventoryItems,
    };
  }

  // 3. Xử lý nộp bài
  async submitExamResult(userId: string, lessonId: string, score: number) {
    // A. Lấy thông tin bài học để check điểm chuẩn
    const lesson = await this.lessonModel.findById(lessonId);
    if (!lesson) throw new NotFoundException('Bài học không tồn tại');

    // B. Kiểm tra xem có phải bài thi không
    if (lesson.type !== 'EXAM' || !lesson.examConfig) {
      throw new Error('Đây không phải là bài kiểm tra');
    }

    const passingScore = lesson.examConfig.passingScore || 50;
    const isPassed = score >= passingScore;

    // C. Lưu kết quả vào UserProgress (Ví dụ)
    if (isPassed) {
      await this.completeLesson(userId, lessonId);
    }

    return {
      success: true,
      passed: isPassed,
      message: isPassed
        ? 'Chúc mừng! Bạn đã vượt qua bài thi.'
        : 'Bạn chưa đạt điểm yêu cầu. Hãy thử lại!',
      receivedScore: score,
      requiredScore: passingScore,
    };
  }
}
