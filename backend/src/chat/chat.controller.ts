import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('talk')
  async talk(@Body() body: { message: string; history: any[] }) {
    return this.chatService.talkToLion(body.message, body.history || []);
  }
}
