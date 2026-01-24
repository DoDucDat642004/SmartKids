import { Module } from '@nestjs/common';
import { HandbookService } from './handbook.service';
import { HandbookController } from './handbook.controller';
import {
  HandbookItem,
  HandbookItemSchema,
} from './entities/handbook-item.entity';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserHandbook,
  UserHandbookSchema,
} from './entities/user-handbook.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HandbookItem.name, schema: HandbookItemSchema },
      { name: UserHandbook.name, schema: UserHandbookSchema },
    ]),
  ],
  controllers: [HandbookController],
  providers: [HandbookService],
  exports: [HandbookService],
})
export class HandbookModule {}
