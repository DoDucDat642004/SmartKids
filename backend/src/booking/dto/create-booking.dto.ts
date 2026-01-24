import { IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsMongoId()
  tutorId: string; // ID của gia sư

  @IsDateString()
  startTime: string; // Thời gian bắt đầu

  @IsDateString()
  endTime: string; // Thời gian kết thúc

  @IsString()
  @IsOptional()
  topic?: string; // Chủ đề (Optional)
}
