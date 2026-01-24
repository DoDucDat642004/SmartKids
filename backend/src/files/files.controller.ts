import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

@Controller('files')
export class FilesController {
  // Body: form-data { file: <binary_file> }
  @Post('upload')
  @UseInterceptors(
    // FileInterceptor('file'): Lắng nghe field có tên là 'file' trong form-data
    FileInterceptor('file', {
      // 1. CẤU HÌNH LƯU TRỮ
      storage: diskStorage({
        destination: './uploads', // Thư mục đích để lưu file trên Server

        filename: (req, file, cb) => {
          // Tạo một chuỗi ngẫu nhiên 32 ký tự (hexadecimal)
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');

          // Tên file mới = Mã ngẫu nhiên + Đuôi file gốc (VD: a1b2c3... .jpg)
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),

      // 2. BỘ LỌC FILE (SECURITY / VALIDATION)
      // Chỉ cho phép các định dạng an toàn đi qua. Chặn file .exe, .sh, .php...
      fileFilter: (req, file, cb) => {
        // Regex kiểm tra đuôi file (Case insensitive với flag 'i')
        // Hỗ trợ: Ảnh, Video, Audio, Tài liệu văn phòng (Word, Excel, PPT), PDF, JSON
        if (
          !file.originalname.match(
            /\.(jpg|jpeg|png|gif|mp4|mp3|wav|pdf|json|doc|docx|ppt|pptx|xls|xlsx)$/i,
          )
        ) {
          // Nếu không khớp regex -> Trả về lỗi 400 Bad Request
          return cb(
            new BadRequestException(
              'File không hợp lệ! (Chỉ hỗ trợ: Ảnh, Video, Audio, PDF, Office)',
            ),
            false, // false = Từ chối lưu file
          );
        }
        // Nếu hợp lệ -> Cho phép (true)
        cb(null, true);
      },

      // 3. GIỚI HẠN DUNG LƯỢNG
      // Giúp chống tấn công DoS bằng cách up file quá nặng làm tràn ổ cứng
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB (Tính theo bytes)
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file)
      throw new BadRequestException(
        'File không tồn tại hoặc định dạng bị từ chối!',
      );

    const protocol = req.protocol;
    const host = req.get('host');

    // URL kết quả: http://localhost:4000/uploads/random-name.jpg
    const fullUrl = `${protocol}://${host}/uploads/${file.filename}`;

    return {
      url: fullUrl, // Link để Frontend hiển thị ảnh/video
      filename: file.filename, // Tên file lưu trên server
      mimetype: file.mimetype, // Loại file (image/png, application/pdf...)
      size: file.size, // Kích thước file (bytes)
    };
  }
}
