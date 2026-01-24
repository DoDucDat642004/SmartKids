import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  // 1. TẠO BOOKING
  async create(userId: string, data: any) {
    const newClass = new this.bookingModel({
      title: data.topic || 'Lớp học 1-1',
      tutor: new Types.ObjectId(data.tutorId),
      startTime: data.startTime,
      endTime: data.endTime,
      students: [new Types.ObjectId(userId)],
      status: 'PENDING',
    });
    return newClass.save();
  }

  // 2. TÌM LỚP THEO ID (Utility Function)
  async findById(id: string): Promise<Booking> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID lớp học không đúng định dạng');
    }

    const booking = await this.bookingModel.findById(id).exec();

    if (!booking) {
      throw new NotFoundException('Không tìm thấy lớp học trong hệ thống');
    }
    return booking;
  }

  // Tạo lớp học
  async createClass(data: any) {
    const newClass = new this.bookingModel({
      ...data,
      students: [], // Lớp mới tạo (Slot) thì danh sách học sinh rỗng
      status: 'PENDING',
    });
    return newClass.save();
  }

  // Lấy danh sách lớp
  async findAll(query: any) {
    const filter: any = {};
    if (query.tutorId) filter.tutor = query.tutorId;

    return this.bookingModel
      .find(filter)
      .populate('tutor', 'fullName avatar email')
      .populate('students', 'fullName avatar email')
      .sort({ startTime: -1 }) // Sắp xếp theo thời gian: Mới nhất lên đầu
      .exec();
  }

  // Thêm học sinh vào lớp (Đăng ký học)
  async addStudent(classId: string, studentId: string) {
    return this.bookingModel
      .findByIdAndUpdate(
        classId,
        { $addToSet: { students: studentId } },
        { new: true },
      )
      .populate('students');
  }

  // Xóa học sinh khỏi lớp (Hủy đăng ký/Đuổi học)
  async removeStudent(classId: string, studentId: string) {
    return this.bookingModel.findByIdAndUpdate(
      classId,
      { $pull: { students: studentId } },
      { new: true },
    );
  }

  // Cập nhật Record sau khi buổi học kết thúc
  async updateRecording(classId: string, url: string) {
    return this.bookingModel.findByIdAndUpdate(
      classId,
      {
        recordingUrl: url,
        status: 'COMPLETED', // Tự động chuyển trạng thái lớp thành Đã hoàn thành
      },
      { new: true },
    );
  }
}
