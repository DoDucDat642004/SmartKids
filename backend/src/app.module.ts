import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { CoursesModule } from './courses/courses.module';
import { QuestionsModule } from './questions/questions.module';
import { MediaModule } from './media/media.module';
import { GamificationModule } from './gamification/gamification.module';
import { ShopModule } from './shop/shop.module';
import { CommunityModule } from './community/community.module';
import { FinanceModule } from './finance/finance.module';
import { ReportsModule } from './reports/reports.module';
import { SupportModule } from './support/support.module';
import { SettingsModule } from './settings/settings.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MarketingModule } from './marketing/marketing.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FilesModule } from './files/files.module';
import { RolesModule } from './roles/roles.module';
import { AuditModule } from './audit/audit.module';
import { PracticeModule } from './practice/practice.module';
import { HandbookModule } from './handbook/handbook.module';
import { FriendsModule } from './friends/friends.module';
import { LiveModule } from './live/live.module';
import { BookingModule } from './booking/booking.module';
import { QuizModule } from './quiz/quiz.module';
import { LiveClassModule } from './live-class/live-class.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    // A. Cấu hình đọc file .env
    ConfigModule.forRoot({
      isGlobal: true, // Để dùng được biến môi trường ở mọi nơi
    }),

    // B. Cấu hình kết nối MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), // Lấy địa chỉ từ file .env
      }),
      inject: [ConfigService],
    }),

    // C. Cấu hình để folder 'uploads' có thể truy cập từ bên ngoài
    // VD: http://localhost:4000/uploads/anh.jpg
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Thư mục lưu file
      serveRoot: '/uploads', // Đường dẫn ảo trên URL
    }),

    // D. Các module chức năng
    UsersModule,

    AuthModule,

    ChatModule,

    CoursesModule,

    QuestionsModule,

    MediaModule,

    GamificationModule,

    ShopModule,

    CommunityModule,

    FinanceModule,

    ReportsModule,

    SupportModule,

    SettingsModule,

    AnalyticsModule,

    MarketingModule,

    FilesModule,

    RolesModule,

    AuditModule,

    PracticeModule,

    HandbookModule,

    FriendsModule,

    LiveModule,

    BookingModule,

    QuizModule,

    LiveClassModule,

    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
