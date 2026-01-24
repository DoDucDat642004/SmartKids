import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entities/user.entity';
import { Lesson } from 'src/courses/entities/lesson.entity';

// 1. ĐỊNH NGHĨA SUB-SCHEMA CHO LỊCH TRÌNH
@Schema({ _id: false })
export class SessionSchedule {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Lesson', required: true })
  lessonId: Lesson;

  @Prop({ type: Date, default: null })
  startTime: Date | null;

  @Prop({ type: Date, default: null })
  endTime: Date | null;

  @Prop({ type: String, default: null })
  liveRoomId: string | null;

  @Prop({ type: String, default: null })
  recordingUrl: string | null;

  @Prop({ type: String, default: null })
  quizId: string | null;

  @Prop({ default: false })
  isCompleted: boolean;
}

// 2. MAIN SCHEMA
@Schema({ timestamps: true })
export class LiveClass extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  baseCourseId: Course;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  tutorId: User;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  students: User[];

  @Prop({ type: [SchemaFactory.createForClass(SessionSchedule)], default: [] })
  schedule: SessionSchedule[];

  @Prop({ default: true })
  isActive: boolean;
}

export const LiveClassSchema = SchemaFactory.createForClass(LiveClass);
