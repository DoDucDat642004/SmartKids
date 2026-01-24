import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
  Req,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // Packages
  @Post('packages')
  createPackage(@Body() body: any) {
    return this.financeService.createPackage(body);
  }

  @Get('packages')
  getPackages(@Query('active') active: string) {
    return this.financeService.getPackages(active === 'true');
  }

  @Put('packages/:id')
  updatePackage(@Param('id') id: string, @Body() body: any) {
    console.log('update');
    return this.financeService.updatePackage(id, body);
  }

  @Delete('packages/:id')
  deletePackage(@Param('id') id: string) {
    return this.financeService.deletePackage(id);
  }

  // Transactions (User mua gói)
  @UseGuards(JwtAuthGuard)
  @Post('transactions')
  createTransaction(@Body() body: any, @Req() req: any) {
    const userId = req.user._id; // Lấy ID từ Token

    // Gộp userId vào dữ liệu body trước khi gửi sang Service
    return this.financeService.createTransaction({
      ...body,
      userId: userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('transactions')
  getTransactions() {
    return this.financeService.getTransactions();
  }

  // Subscriptions (Admin xem)
  @Get('subscriptions')
  getSubscriptions() {
    return this.financeService.getSubscriptions();
  }
}
