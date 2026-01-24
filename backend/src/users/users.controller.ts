import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuditLog } from 'src/audit/decorators/audit.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.usersService.findAll(query);
  }

  // @Get()
  // findAll(@Query('role') role?: string) {
  //   // 🔥 Nhận query param role
  //   if (role) {
  //     return this.usersService.findAllByRole(role); // Cần viết hàm này trong Service
  //   }
  //   return this.usersService.findAll();
  // }

  // @Get('/inventory')
  // getInventory() {
  //   return this.usersService.getInventory(query);
  // }

  @Get('search')
  async searchUser(@Query('email') email: string) {
    return this.usersService.searchForAddStudent(email);
  }

  @Post('equip') // Dùng POST thay vì GET, thêm đường dẫn 'equip'
  @UseGuards(JwtAuthGuard)
  async equipItem(@Req() req, @Body('itemId') itemId: string) {
    // req.user._id lấy từ Token (người đang đăng nhập)
    return this.usersService.equipItem(req.user._id, itemId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.usersService.updateStatus(id, isActive);
  }

  @Patch(':id/gift')
  addGift(
    @Param('id') id: string,
    @Body() rewards: { gold?: number; diamond?: number },
  ) {
    return this.usersService.addGift(id, rewards);
  }

  // --- STAFF MANAGEMENT ---

  // API Tạo User mới (Admin dùng để tạo Tutor/Student thủ công)
  @Post()
  @AuditLog({ action: 'CREATE', module: 'USER' })
  create(@Body() createUserDto: any) {
    // Hoặc CreateUserDto nếu có
    return this.usersService.create(createUserDto);
  }

  @Post('tutors')
  @AuditLog({ action: 'CREATE', module: 'USER' }) // Ghi log nếu có
  createTutor(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createTutor(createUserDto);
  }

  @Get('staffs')
  // @RequirePermissions('ADMIN_MANAGE') // Nếu muốn chặt chẽ
  getStaffs() {
    return this.usersService.getStaffs();
  }

  @Post('staffs')
  @AuditLog({ action: 'CREATE', module: 'USER' })
  createStaff(@Body() body: any) {
    return this.usersService.createStaff(body);
  }

  @Put(':id/role')
  @AuditLog({ action: 'UPDATE', module: 'USER' })
  updateRole(@Param('id') id: string, @Body('roleId') roleId: string) {
    return this.usersService.updateRole(id, roleId);
  }

  @Delete(':id/delete')
  @AuditLog({ action: 'DELETE', module: 'USER' })
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    // req.user._id đến từ JWT Token
    return this.usersService.getProfile(req.user._id);
  }

  // src/users/users.controller.ts

  @Get('friends/top')
  @UseGuards(JwtAuthGuard)
  getTopFriends(@Req() req) {
    return this.usersService.getTopFriends(req.user._id);
  }

  @Get('leaderboard')
  async getLeaderboard() {
    return this.usersService.getLeaderboard();
  }
}
