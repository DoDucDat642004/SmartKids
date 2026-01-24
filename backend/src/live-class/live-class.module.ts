import { Module } from '@nestjs/common';
import { LiveClassService } from './live-class.service';
import { LiveClassController } from './live-class.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LiveModule } from 'src/live/live.module';
import { LiveClass, LiveClassSchema } from './entities/live-class.entity';
import { Course, CourseSchema } from 'src/courses/entities/course.entity';
import { Unit, UnitSchema } from 'src/courses/entities/unit.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LiveClass.name, schema: LiveClassSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Unit.name, schema: UnitSchema },
    ]),
    LiveModule,
  ],
  controllers: [LiveClassController],
  providers: [LiveClassService],
})
export class LiveClassModule {}
