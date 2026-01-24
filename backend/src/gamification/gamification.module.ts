import { forwardRef, Module } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { GamificationController } from './gamification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quest, QuestSchema } from './entities/quest.entity';
import { LevelConfig, LevelConfigSchema } from './entities/level.entity';
import { Achievement, AchievementSchema } from './entities/achievement.entity';
import {
  UserQuestProgress,
  UserQuestProgressSchema,
} from './entities/user-quest-progress.entity';
import { UserBadge, UserBadgeSchema } from './entities/user-badge.entity';
import { UsersModule } from 'src/users/users.module';
import { User, UserSchema } from 'src/users/entities/user.entity';
import {
  UserProcess,
  UserProcessSchema,
} from 'src/courses/entities/user-process.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Quest.name, schema: QuestSchema },
      { name: LevelConfig.name, schema: LevelConfigSchema },
      { name: Achievement.name, schema: AchievementSchema },
      { name: UserQuestProgress.name, schema: UserQuestProgressSchema },
      { name: UserBadge.name, schema: UserBadgeSchema },
      { name: User.name, schema: UserSchema },
      { name: UserProcess.name, schema: UserProcessSchema },
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [GamificationController],
  providers: [GamificationService],
  exports: [GamificationService],
})
export class GamificationModule {}
