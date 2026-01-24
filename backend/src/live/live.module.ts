import { Module } from '@nestjs/common';
import { LiveService } from './live.service';
import { LiveController } from './live.controller';
import { BookingModule } from 'src/booking/booking.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [BookingModule, RolesModule],
  controllers: [LiveController],
  providers: [LiveService],
  exports: [LiveService],
})
export class LiveModule {}
