import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { GamificationService } from 'src/gamification/gamification.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private gamificationService: GamificationService,
  ) {}

  async login(loginDto: any) {
    const { email, password } = loginDto;

    // 1. Tìm user trong DB
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email không tồn tại');
    }

    // 2. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu sai');
    }

    // 3. Tạo Token (Payload chứa ID và Email)
    const payload = { sub: user._id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    // Trả về token và thông tin user (để hiển thị frontend)
    // Ẩn password trước khi trả về
    const { password: p, ...userInfo } = user.toObject();

    // Cập nhật tiến trình
    this.gamificationService
      .trackProgress(user._id.toString(), 'LOGIN', 1)
      .catch((err) => console.error(err));

    return {
      accessToken,
      user: userInfo,
    };
  }
}
