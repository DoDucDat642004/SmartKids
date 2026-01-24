import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { AuditModule } from 'src/audit/audit.module';
import {
  Friendship,
  FriendshipSchema,
} from '../friends/entities/friendship.entity';
import { UserBadge, UserBadgeSchema } from './entities/user-badge.entity';
import { StudyLog, StudyLogSchema } from './entities/study-log.entity';
import { FriendsModule } from 'src/friends/friends.module';
import { Item, ItemSchema } from 'src/shop/entities/item.entity';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Friendship.name, schema: FriendshipSchema },
      { name: UserBadge.name, schema: UserBadgeSchema },
      { name: StudyLog.name, schema: StudyLogSchema },
      { name: Item.name, schema: ItemSchema },
    ]),
    AuditModule,
    forwardRef(() => CoursesModule),
    forwardRef(() => FriendsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
