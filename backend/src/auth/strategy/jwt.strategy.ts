import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  ConsoleLogger,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      // 1. LẤY TOKEN
      // fromAuthHeaderAsBearerToken() -> Tìm trong Header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2. CHECK HẾT HẠN
      // false -> Nếu token hết hạn (exp), NestJS sẽ tự động throw lỗi 401 Unauthorized
      // true -> Cho phép token hết hạn đi tiếp
      ignoreExpiration: false,

      // 3. KHÓA BÍ MẬT
      // Dùng secret key này để giải mã token. Phải TRÙNG KHỚP với key lúc sign (tạo) token bên AuthService.
      secretOrKey: process.env.JWT_SECRET || '12345',
    });
  }

  // Hàm validate này CHỈ CHẠY khi Token đã được verify chữ ký (signature) và hạn dùng (exp) thành công.
  async validate(payload: any) {
    // payload: Là dữ liệu đã giải mã từ token (thường chứa { sub: userId, email: ..., iat: ..., exp: ... })

    // 4. KIỂM TRA LẠI VỚI DATABASE
    const user = await this.usersService.findById(payload.sub);

    // Nếu không tìm thấy user trong DB
    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại hoặc đã bị xóa');
    }

    return user;
  }
}
