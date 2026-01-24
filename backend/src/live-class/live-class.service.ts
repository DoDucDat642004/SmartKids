import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LiveClass, SessionSchedule } from './entities/live-class.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Unit } from 'src/courses/entities/unit.entity';

@Injectable()
export class LiveClassService {
  constructor(
    @InjectModel(LiveClass.name) private liveClassModel: Model<LiveClass>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Unit.name) private unitModel: Model<Unit>,
  ) {}

  // --- 1. TẠO LỚP MỚI ---
  async create(createLiveClassDto: any) {
    const { name, baseCourseId, tutorId } = createLiveClassDto;

    const course = await this.courseModel.findById(baseCourseId);
    if (!course) throw new NotFoundException('Giáo trình không tồn tại');

    // Lấy tất cả Unit và Lesson của khóa học gốc
    const units = await this.unitModel
      .find({ courseId: baseCourseId })
      .populate('lessons');

    // Tạo mảng lịch trình trống (Copy cấu trúc)
    const initialSchedule: SessionSchedule[] = [];

    for (const unit of units) {
      const unitData = unit as any;
      if (unitData.lessons && unitData.lessons.length > 0) {
        for (const lesson of unitData.lessons) {
          initialSchedule.push({
            lessonId: lesson._id,
            startTime: null,
            endTime: null,
            liveRoomId: null,
            recordingUrl: null,
            quizId: null,
            isCompleted: false,
          });
        }
      }
    }

    const newClass = new this.liveClassModel({
      name,
      baseCourseId,
      tutorId,
      schedule: initialSchedule,
      isActive: true,
      students: [],
    });

    return newClass.save();
  }

  // --- 2. CHI TIẾT LỚP HỌC ---
  async findOne(id: string) {
    return this.liveClassModel
      .findById(id)
      .populate({
        path: 'schedule.lessonId',
        select: 'title type description thumbnail materials unitId videoUrl',
        populate: {
          path: 'unitId',
          select: 'title order',
        },
      })
      .populate('tutorId', 'fullName avatar email')
      .populate('baseCourseId', 'title') // Lấy tên khóa học gốc
      .exec();
  }

  // --- 3. LỚP CỦA TÔI ---
  async getMyClasses(userId: string) {
    return this.liveClassModel
      .find({ students: userId } as any)
      .populate('baseCourseId', 'title thumbnail')
      .populate('tutorId', 'fullName avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  // --- 4. ADMIN: Lấy danh sách ---
  async findAllAdmin() {
    return this.liveClassModel
      .find()
      .populate('baseCourseId', 'title')
      .populate('tutorId', 'fullName email')
      .sort({ createdAt: -1 })
      .exec();
  }

  // --- 5. ADMIN: Quản lý học sinh ---
  async addStudent(classId: string, studentId: string) {
    return this.liveClassModel.findByIdAndUpdate(
      classId,
      { $addToSet: { students: studentId } },
      { new: true },
    );
  }

  async removeStudent(classId: string, studentId: string) {
    return this.liveClassModel.findByIdAndUpdate(
      classId,
      { $pull: { students: studentId } },
      { new: true },
    );
  }

  // --- 6. ADMIN: Cập nhật lịch & Record (QUAN TRỌNG) ---
  async updateSession(classId: string, lessonId: string, data: any) {
    // Tạo object update động để không bị ghi đè null lên dữ liệu cũ
    const updateFields: any = {};

    if (data.startTime) updateFields['schedule.$.startTime'] = data.startTime;
    if (data.endTime) updateFields['schedule.$.endTime'] = data.endTime;
    if (data.recordingUrl)
      updateFields['schedule.$.recordingUrl'] = data.recordingUrl;

    // Luôn set roomId bằng classId nếu là bài Live
    updateFields['schedule.$.liveRoomId'] = classId;

    return this.liveClassModel.updateOne(
      { _id: classId, 'schedule.lessonId': lessonId } as any,
      { $set: updateFields },
    );
  }

  async syncContent(classId: string) {
    // 1. Lấy thông tin lớp hiện tại
    const liveClass = await this.liveClassModel.findById(classId);
    if (!liveClass) throw new NotFoundException('Lớp học không tồn tại');

    // 2. Lấy cấu trúc MỚI NHẤT từ Course gốc (Bao gồm Unit và Lesson)
    const units = await this.unitModel
      .find({ courseId: liveClass.baseCourseId })
      .populate('lessons')
      .sort({ order: 1 }); // Sắp xếp theo thứ tự Unit

    // 3. Tạo Map để lưu giữ cấu hình cũ (Giờ học, Record, Link...)
    const existingSessionsMap = new Map<string, any>();
    if (liveClass.schedule) {
      liveClass.schedule.forEach((session) => {
        const lessonId = (session.lessonId as any)._id
          ? (session.lessonId as any)._id.toString()
          : session.lessonId.toString();

        existingSessionsMap.set(lessonId, session);
      });
    }

    // 4. Tạo lịch trình MỚI dựa trên cấu trúc Course MỚI
    const newSchedule: SessionSchedule[] = [];

    for (const unit of units) {
      const unitData = unit as any;

      // Nếu unit có bài học
      if (unitData.lessons && unitData.lessons.length > 0) {
        // Sắp xếp lesson trong unit (quan trọng để hiển thị đúng thứ tự)
        const sortedLessons = unitData.lessons.sort(
          (a, b) => a.order - b.order,
        );

        for (const lesson of sortedLessons) {
          const lessonIdStr = lesson._id.toString();

          // Kiểm tra xem bài này đã có trong lịch cũ chưa?
          if (existingSessionsMap.has(lessonIdStr)) {
            // TRƯỜNG HỢP 1: BÀI CŨ -> Giữ nguyên thông tin cũ (Giờ học, Record...)
            // Push lại object cũ vào mảng mới
            newSchedule.push(existingSessionsMap.get(lessonIdStr));
          } else {
            // TRƯỜNG HỢP 2: BÀI MỚI -> Thêm mới vào lịch với giá trị mặc định
            newSchedule.push({
              lessonId: lesson._id,
              startTime: null,
              endTime: null,
              liveRoomId: null,
              recordingUrl: null,
              quizId: null,
              isCompleted: false,
            });
          }
        }
      }
    }

    // 5. Cập nhật lại DB
    // Mongoose sẽ tự động thay thế mảng cũ bằng mảng mới (đã được merge)
    liveClass.schedule = newSchedule;
    return liveClass.save();
  }

  // Cập nhật thông tin lớp (Tên, Tutor, Trạng thái)
  async update(id: string, updateDto: any) {
    return this.liveClassModel.findByIdAndUpdate(id, updateDto, { new: true });
  }

  // Xóa lớp học
  async remove(id: string) {
    return this.liveClassModel.findByIdAndDelete(id);
  }

  // LẤY TOÀN BỘ LỊCH DẠY (Dành cho Calendar Admin)
  async getAllSessionsForCalendar() {
    // 1. Lấy tất cả lớp đang Active
    const classes = await this.liveClassModel
      .find({ isActive: true })
      .populate({
        path: 'schedule.lessonId',
        select: 'title', // Lấy tên bài học
      })
      .populate('tutorId', 'fullName avatar') // Lấy tên GV
      .select('name schedule tutorId baseCourseId')
      .lean(); // Dùng lean() để chạy nhanh hơn

    // 2. "Làm phẳng" (Flatten) mảng schedule thành danh sách sự kiện
    const events: any[] = [];

    classes.forEach((cls: any) => {
      if (cls.schedule && cls.schedule.length > 0) {
        cls.schedule.forEach((session: any) => {
          // Chỉ lấy những bài đã xếp lịch (có startTime)
          if (session.startTime && session.endTime) {
            events.push({
              _id: session._id, // ID buổi học
              classId: cls._id,
              title: `[${cls.name}] - ${session.lessonId?.title || 'Bài học'}`,
              start: session.startTime,
              end: session.endTime,
              tutor: cls.tutorId,
              resource: {
                className: cls.name,
                lessonName: session.lessonId?.title,
                recordingUrl: session.recordingUrl,
                liveRoomId: session.liveRoomId,
              },
            });
          }
        });
      }
    });

    // 3. Sắp xếp theo thời gian
    return events.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );
  }
}
