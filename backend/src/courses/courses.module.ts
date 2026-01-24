import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course, CourseSchema } from './entities/course.entity';
import { Unit, UnitSchema } from './entities/unit.entity';
import { Lesson, LessonSchema } from './entities/lesson.entity';
import { UserProcess, UserProcessSchema } from './entities/user-process.entity';
import {
  UserMilestone,
  UserMilestoneSchema,
} from './entities/user-milestone.entity';
import {
  PracticeQuestion,
  PracticeQuestionSchema,
} from 'src/practice/entities/practice-question.entity';
import { UsersModule } from 'src/users/users.module';
import { GamificationModule } from 'src/gamification/gamification.module';
import { HandbookModule } from 'src/handbook/handbook.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Unit.name, schema: UnitSchema },
      { name: Lesson.name, schema: LessonSchema },
      { name: UserProcess.name, schema: UserProcessSchema },
      { name: UserMilestone.name, schema: UserMilestoneSchema },
      { name: PracticeQuestion.name, schema: PracticeQuestionSchema },
    ]),

    forwardRef(() => UsersModule),
    CoursesModule,
    GamificationModule,
    HandbookModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
