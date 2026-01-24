import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  getFriends(@Req() req) {
    return this.friendsService.getFriends(req.user._id);
  }

  @Get('requests')
  getRequests(@Req() req) {
    return this.friendsService.getRequests(req.user._id);
  }

  @Post('request')
  sendRequest(@Req() req, @Body('friendId') friendId: string) {
    return this.friendsService.sendRequest(req.user._id, friendId);
  }

  @Patch('accept/:id')
  acceptRequest(@Req() req, @Param('id') id: string) {
    return this.friendsService.acceptRequest(id, req.user._id);
  }

  @Delete('reject/:id')
  rejectRequest(@Param('id') id: string) {
    return this.friendsService.rejectRequest(id);
  }

  @Delete(':friendId')
  removeFriend(@Req() req, @Param('friendId') friendId: string) {
    return this.friendsService.removeFriend(req.user._id, friendId);
  }
}
