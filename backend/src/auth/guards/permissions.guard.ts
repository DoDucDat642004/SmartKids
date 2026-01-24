import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector, // Công cụ để đọc Metadata (Custom Decorator)
    @InjectModel(User.name) private userModel: Model<User>, // Inject Model User để query DB
    @InjectModel(Role.name) private roleModel: Model<Role>, // Inject Model Role
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. LẤY DANH SÁCH QUYỀN YÊU CẦU
    // Sử dụng Reflector để đọc dữ liệu từ decorator @Permissions('CREATE_USER', ...)
    // getAllAndOverride: Ưu tiên quyền ở mức method (handler) hơn mức class (controller)
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 2. CHECK CƠ BẢN
    // Nếu API không gắn decorator @Permissions -> Coi như không yêu cầu quyền -> Cho qua
    if (!requiredPermissions) {
      return true;
    }

    // 3. LẤY USER TỪ REQUEST
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false; // Chưa đăng nhập -> Chặn

    // 4. LẤY THÔNG TIN ROLE TỪ DB
    const dbUser = await this.userModel.findById(user._id).populate('role');

    // Kiểm tra tính hợp lệ của User và Role trong DB
    if (!dbUser || !dbUser.role) {
      throw new ForbiddenException('Tài khoản lỗi hoặc chưa được cấp vai trò.');
    }

    // Ép kiểu để TypeScript hiểu đây là object Role đầy đủ (đã populate)
    const userRole = dbUser.role as unknown as Role;

    // 5. SUPER ADMIN BYPASS
    if (userRole.isSystem && userRole.name === 'Super Admin') {
      return true;
    }

    // 6. SO KHỚP QUYỀN
    const hasPermission = requiredPermissions.some((perm) =>
      userRole.permissions.includes(perm),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện hành động này (Missing Permissions).',
      );
    }

    return true;
  }
}
