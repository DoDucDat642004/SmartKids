import { Injectable } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LiveService {
  constructor(private configService: ConfigService) {}

  async createRoomToken(user: { _id: string; name: string }, roomId: string) {
    const apiKey = this.configService.get('LIVEKIT_API_KEY');
    const apiSecret = this.configService.get('LIVEKIT_API_SECRET');

    if (!apiKey || !apiSecret) throw new Error('Missing LiveKit Keys');

    const at = new AccessToken(apiKey, apiSecret, {
      identity: user._id,
      name: user.name,
    });

    at.addGrant({
      roomJoin: true,
      room: roomId,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    return {
      token: token, // Trả về chuỗi token
      roomId: roomId,
    };
  }
}
