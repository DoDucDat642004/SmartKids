import { forwardRef, Module } from '@nestjs/common';
import { PracticeService } from './practice.service';
import { PracticeController } from './practice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PracticeQuestion,
  PracticeQuestionSchema,
} from './entities/practice-question.entity';
import { GameResult, GameResultSchema } from './entities/game-result.entity';
import { UsersModule } from 'src/users/users.module';
import { GamificationModule } from 'src/gamification/gamification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PracticeQuestion.name, schema: PracticeQuestionSchema },
      { name: GameResult.name, schema: GameResultSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => GamificationModule),
  ],
  controllers: [PracticeController],
  providers: [PracticeService],
  exports: [PracticeService],
})
export class PracticeModule {}
