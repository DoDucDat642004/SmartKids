import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Friendship,
  FriendshipDocument,
  FriendStatus,
} from './entities/friendship.entity';
import { User, UserDocument } from 'src/users/entities/user.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friendship.name)
    private friendModel: Model<FriendshipDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // 1. Lấy danh sách bạn bè
  async getFriends(userId: string) {
    const friendships = await this.friendModel
      .find({
        $or: [{ requester: userId }, { recipient: userId }],
        status: FriendStatus.ACCEPTED,
      })
      .populate('requester recipient', 'fullName avatar stats');

    // Map lại dữ liệu để FE dễ dùng
    return friendships.map((f) => {
      const friend: any =
        f.requester['_id'].toString() === userId ? f.recipient : f.requester;
      return {
        id: friend._id,
        name: friend.fullName,
        avatar: friend.avatar || '👶',
        level: friend.stats?.level || 1,
        status: friend.isActive ? 'online' : 'offline', // Giả lập status dựa trên isActive
        bio: friend.studentId,
      };
    });
  }

  // 2. Lấy danh sách lời mời kết bạn (Pending)
  async getRequests(userId: string) {
    const requests = await this.friendModel
      .find({
        recipient: userId,
        status: FriendStatus.PENDING,
      })
      .populate('requester', 'fullName avatar stats createdAt');

    return requests.map((r: any) => ({
      id: r._id, // ID của request (dùng để Accept/Reject)
      requesterId: r.requester._id,
      name: r.requester.fullName,
      avatar: r.requester.avatar || '👶',
      level: r.requester.stats?.level || 1,
      time: r.createdAt,
    }));
  }

  // 3. Gửi lời mời kết bạn
  async sendRequest(userId: string, friendId: string) {
    if (userId === friendId)
      throw new BadRequestException('Không thể kết bạn với chính mình');

    const exists = await this.friendModel.findOne({
      $or: [
        { requester: userId, recipient: friendId },
        { requester: friendId, recipient: userId },
      ],
    });

    if (exists) throw new BadRequestException('Đã là bạn hoặc đã gửi lời mời');

    return new this.friendModel({
      requester: userId,
      recipient: friendId,
      status: FriendStatus.PENDING,
    }).save();
  }

  // 4. Đồng ý kết bạn
  async acceptRequest(requestId: string, userId: string) {
    const request = await this.friendModel.findOne({
      _id: requestId,
      recipient: userId,
    });
    if (!request) throw new NotFoundException('Lời mời không tồn tại');

    request.status = FriendStatus.ACCEPTED;
    return request.save();
  }

  // 5. Hủy kết bạn / Từ chối
  async removeFriend(userId: string, friendId: string) {
    // Xóa record bất kể ai là người gửi
    return this.friendModel.findOneAndDelete({
      $or: [
        { requester: userId, recipient: friendId },
        { requester: friendId, recipient: userId },
      ],
    });
  }

  // 6. Từ chối lời mời (Dựa trên Request ID)
  async rejectRequest(requestId: string) {
    return this.friendModel.findByIdAndDelete(requestId);
  }
}
