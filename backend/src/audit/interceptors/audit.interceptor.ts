import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // 👈 Dùng map để có thể sửa đổi dữ liệu trả về
import { Reflector } from '@nestjs/core';
import { AUDIT_KEY, AuditOptions } from '../decorators/audit.decorator';
import { AuditService } from '../audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector, // Dùng để đọc metadata từ @AuditLog
    private auditService: AuditService, // Dùng để ghi log vào DB
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 1. ĐỌC METADATA
    // Lấy thông tin từ decorator @AuditLog (ví dụ: action='UPDATE', module='USER')
    const options = this.reflector.get<AuditOptions>(
      AUDIT_KEY,
      context.getHandler(),
    );

    // 2. CHECK ĐIỀU KIỆN
    // Nếu route này không gắn @AuditLog, bỏ qua logic bên dưới và chạy tiếp
    if (!options) return next.handle();

    // 3. LẤY THÔNG TIN NGỮ CẢNH (CONTEXT)
    // Lấy thông tin Request, User đang login, IP để phục vụ ghi log
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const ip = req.ip || req.connection.remoteAddress;

    // 4. XỬ LÝ RESPONSE (Quan trọng)
    // next.handle() thực thi Controller/Service.
    // .pipe(map(...)) bắt lấy kết quả trả về từ Service để xử lý thêm.
    return next.handle().pipe(
      map(async (response) => {
        // [Mặc định] Log input là body gửi lên, output là cái service trả về
        let logDetail: any = { input: req.body, output: response };
        let finalResponse = response; // Biến này sẽ là dữ liệu cuối cùng trả về Frontend

        // 5. BÓC TÁCH DỮ LIỆU (WRAPPER PATTERN)
        // Đây là kỹ thuật: Service trả về object { oldData, newData, _isAuditWrapper: true }
        // Mục đích: Để Interceptor có cả dữ liệu cũ (để log) và mới.
        if (response && response._isAuditWrapper) {
          // A. Ghi log chi tiết: Lưu rõ cái gì cũ, cái gì mới để Admin dễ so sánh
          logDetail = {
            old: response.oldData, // Dữ liệu trước khi update
            new: response.newData, // Dữ liệu sau khi update
          };

          // B. "Làm sạch" response:
          // Chỉ trả về newData cho Frontend.
          finalResponse = response.newData;
        }

        // 6. TÌM TARGET ID
        // Cố gắng tìm ID của đối tượng bị tác động (từ params URL hoặc từ kết quả trả về)
        const targetId = req.params.id || finalResponse?._id || 'Unknown';

        // 7. GHI LOG VÀO DB (Async)
        // Lưu ý: Việc này chạy background, không chặn response trả về ngay lập tức
        await this.auditService.log({
          actorId: user?._id?.toString() || 'Guest', // Ai làm?
          actorName: user?.fullName || 'Anonymous', // Tên là gì?
          action: options.action, // Hành động gì? (UPDATE/DELETE...)
          module: options.module, // Ở đâu? (USER/COURSE...)
          target: `${options.module} ID: ${targetId}`, // Tác động lên cái gì?
          description: `Thực hiện ${options.action}`,
          ip: ip,
          detail: logDetail, // Lưu object log
        });

        // 8. TRẢ KẾT QUẢ CUỐI CÙNG
        return finalResponse;
      }),
    );
  }
}
