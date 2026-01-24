import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { customAlphabet } from 'nanoid';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import {
  Friendship,
  FriendshipDocument,
  FriendStatus,
} from '../friends/entities/friendship.entity';
import {
  StudyLog,
  StudyLogDocument,
  StudyLogSchema,
} from './entities/study-log.entity';
import { UserBadge, UserBadgeDocument } from './entities/user-badge.entity';
import { Item, ItemDocument } from 'src/shop/entities/item.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Friendship.name)
    private friendModel: Model<FriendshipDocument>,
    @InjectModel(UserBadge.name) private badgeModel: Model<UserBadgeDocument>,
    @InjectModel(StudyLog.name) private studyLogModel: Model<StudyLogDocument>,
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>, // Inject Item Model để query chi tiết
  ) {}
  // Tạo bộ ký tự tùy chỉnh: Bỏ 0, O, I, l, 1 để tránh nhầm lẫn
  private generateId = customAlphabet('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 6);
  async create(createUserDto: CreateUserDto) {
    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const studentId = this.generateId();

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      studentId: studentId,
      stats: {
        // Khởi tạo chỉ số ban đầu
        level: 1,
        xp: 0,
        gold: 100, // Thưởng 100 vàng khi đăng ký
      },
    });

    return createdUser.save();
  }

  async createTutor(data: any) {
    // 1. Kiểm tra email trùng
    const existingUser = await this.userModel.findOne({ email: data.email });
    if (existingUser) {
      throw new BadRequestException('Email này đã được sử dụng!');
    }

    // 2. Hash mật khẩu (QUAN TRỌNG)
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // 3. Tạo User với role cứng là TUTOR
    const newTutor = new this.userModel({
      ...data,
      password: hashedPassword,
      role: 'TUTOR', // 👈 Ép cứng role ở đây, không tin tưởng data từ client
      isActive: true,
      // Có thể thêm các chỉ số mặc định khác nếu cần
      stats: { level: 1, gold: 0 },
    });

    return newTutor.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async addXp(userId: string, xpAmount: number) {
    const user = await this.userModel.findById(userId);
    if (!user) return;
    user.stats.currentXP += xpAmount;

    // Logic lên cấp :XP hiện tại > XP cần thiết
    if (user.stats.currentXP > user.stats.nextLevelXP) {
      user.stats.level += 1;
      user.stats.currentXP = user.stats.currentXP - user.stats.nextLevelXP;
      user.stats.nextLevelXP = Math.floor(user.stats.nextLevelXP * 1.2); // Cấp sau khó hơn cấp trước 20%

      // Thưởng khi lên cấp
      user.stats.gold += 50;
      user.stats.diamond += 5;
    }

    return user.save();
  }

  // 1. Lấy danh sách học viên (Có phân trang, search, filter)
  async findAll(query: any) {
    const { search, role, page = 1, limit = 10 } = query;
    const filter: any = {};

    if (role) filter.role = role; // Lọc theo role (STUDENT, ADMIN...)

    // Tìm kiếm theo tên hoặc email
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }, // Mã học viên
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userModel
        .find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .exec(),
      this.userModel.countDocuments(filter),
    ]);

    return { data, total, page, limit };
  }

  // 2. Cập nhật trạng thái (Khóa/Mở khóa)
  async updateStatus(id: string, isActive: boolean) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isActive },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // 3. Tặng quà (Cộng vàng/kim cương)
  async addGift(id: string, rewards: { gold?: number; diamond?: number }) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (rewards.gold) user.stats.gold = (user.stats.gold || 0) + rewards.gold;
    if (rewards.diamond)
      user.stats.diamond = (user.stats.diamond || 0) + rewards.diamond;

    return user.save();
  }

  // 1. Tạo nhân viên mới (Chỉ Admin mới được gọi)
  async createStaff(dto: any) {
    // Kiểm tra email
    const exist = await this.userModel.findOne({ email: dto.email });
    if (exist) throw new BadRequestException('Email đã tồn tại');

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const staffId = 'S' + this.generateId();

    return new this.userModel({
      ...dto,
      password: hashedPassword,
      role: dto.roleId, // Lưu ObjectId của Role
      studentId: staffId,
      isActive: true,
      stats: { level: 99, gold: 99999 }, // Staff thì cho max chỉ số để test :D
    }).save();
  }

  // 2. Lấy danh sách nhân viên (Những user có Role)
  async getStaffs() {
    // Tìm user mà trường role KHÁC null
    return this.userModel
      .find({ role: { $ne: null } })
      .populate('role') // Join sang bảng Role để lấy tên role
      .sort({ createdAt: -1 })
      .exec();
  }

  // 3. Cập nhật Role cho user
  async updateRole(userId: string, roleId: string) {
    // 1. Lấy dữ liệu CŨ
    const oldData = await this.userModel.findById(userId).lean();

    // 2. Update và lấy dữ liệu MỚI
    const newData = await this.userModel
      .findByIdAndUpdate(userId, { role: roleId }, { new: true })
      .lean();

    // 3. Trả về gói dữ liệu đặc biệt
    return {
      oldData,
      newData,
      _isAuditWrapper: true,
    };
  }

  async deleteUser(userId: string) {
    return this.userModel.findByIdAndDelete(userId);
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  // 🔥 HÀM MỚI: Tự động Log điểm danh hôm nay
  async logAttendance(userId: string) {
    const today = new Date().toISOString().split('T')[0]; // "2024-01-15"

    const exists = await this.studyLogModel.findOne({ userId, date: today });
    if (!exists) {
      await new this.studyLogModel({ userId, date: today }).save();
      // Logic cộng chuỗi streak có thể làm ở đây
    }
  }

  // 🔥 HÀM GET PROFILE FULL DATABASE
  async getProfile(userId: string) {
    // 1. Tìm User
    const user = await this.userModel
      .findById(userId)
      .populate('inventory') // 🔥 Quan trọng: Lấy chi tiết đồ trong kho
      .populate('equippedPet') // 🔥 Quan trọng: Lấy chi tiết Pet đang mặc
      .exec();

    if (!user) throw new NotFoundException('User not found');

    await this.logAttendance(userId);
    if (!user) throw new NotFoundException('User not found');

    // Tự động điểm danh khi gọi profile (hoặc gọi ở Login)
    await this.logAttendance(userId);

    // 2. Tính toán Level
    const currentXP = user.stats?.currentXP || 0;
    const level = user.stats?.level || 1;
    const nextLevelXp = user.stats?.nextLevelXP || 100;

    // 3. Lấy Badge từ Database
    // (Nếu chưa có badge nào thì có thể trả về mảng rỗng hoặc list badge mặc định chưa unlock)
    const userBadges = await this.badgeModel.find({ userId }).exec();

    // Nếu muốn hiển thị cả Badge chưa đạt được, bạn cần 1 bảng MasterBadge để left join.
    // Ở đây mình trả về Badge user ĐÃ CÓ.
    const badges = userBadges.map((b) => ({
      id: b._id,
      name: b.name,
      icon: b.icon,
      unlocked: true,
    }));

    // 4. Lấy danh sách ngày đã học trong tháng này
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];

    const logs = await this.studyLogModel
      .find({
        userId,
        date: { $gte: startOfMonth, $lte: endOfMonth },
      })
      .exec();

    // Chuyển đổi thành mảng ngày: [1, 5, 12...]
    const attendance = logs.map((log) => new Date(log.date).getDate());

    // 5. Trả về kết quả
    return {
      id: user.studentId || user._id, // Ưu tiên mã học viên
      name: user.fullName,
      email: user.email,
      title: 'Nhà thám hiểm tí hon 🦁', // Có thể thêm trường title vào User Entity sau
      avatar: user.avatar || '👶',
      level,
      xp: currentXP,
      nextLevelXp,
      gold: user.stats?.gold || 0,
      diamond: user.stats?.diamond || 0,
      streak: user.stats?.streak || 0,
      inventory: user.inventory,
      equippedPet: user.equippedPet,
      joinDate: user.createdAt
        ? user.createdAt.toISOString()
        : new Date().toISOString(), // Fix lỗi TS ở đây
      badges,
      attendance,
    };
  }

  // Trong UsersService thêm hàm này:
  async getTopFriends(userId: string) {
    // Tìm các mối quan hệ đã ACCEPTED
    const friendships = await this.friendModel
      .find({
        $or: [{ requester: userId }, { recipient: userId }],
        status: FriendStatus.ACCEPTED,
      })
      .populate('requester recipient', 'fullName avatar stats'); // Lấy thông tin user

    // Map ra danh sách bạn bè
    const friends = friendships.map((f) => {
      // Nếu mình là requester thì bạn là recipient và ngược lại
      const friendInfo: any =
        (f.requester as any)._id.toString() === userId
          ? f.recipient
          : f.requester;

      return {
        id: friendInfo._id,
        name: friendInfo.fullName,
        avatar: friendInfo.avatar || '👶',
        level: friendInfo.stats?.level || 1,
      };
    });

    // Sắp xếp theo Level giảm dần và lấy Top 4
    return friends.sort((a, b) => b.level - a.level).slice(0, 4);
  }

  async getLeaderboard() {
    return this.userModel
      .find({ role: 'STUDENT' }) // Chỉ lấy học sinh, bỏ qua Admin/Teacher
      .sort({ 'stats.currentXP': -1 }) // Sắp xếp XP giảm dần (Cao nhất lên đầu)
      .limit(10) // Lấy top 10
      .select('fullName avatar stats studentId') // Chỉ lấy các trường cần thiết
      .exec();
  }

  // Hàm cộng tiền tệ (Gold/Diamond) an toàn
  async addCurrency(
    userId: string,
    amount: { gold?: number; diamond?: number },
  ) {
    const updateQuery: any = {};

    if (amount.gold) updateQuery['stats.gold'] = amount.gold;
    if (amount.diamond) updateQuery['stats.diamond'] = amount.diamond;

    // Sử dụng $inc để cộng dồn (atomically increment) tránh lỗi race condition
    return this.userModel.findByIdAndUpdate(
      userId,
      { $inc: updateQuery },
      { new: true },
    );
  }

  async addInventoryItems(userId: string, itemIds: string[]) {
    if (!itemIds || itemIds.length === 0) return [];

    // Thêm vào mảng inventory của User
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { inventory: { $each: itemIds } },
    });

    // Trả về thông tin chi tiết vật phẩm (Tên, Ảnh...) để hiện Popup
    return this.itemModel.find({ _id: { $in: itemIds } }).exec();
  }

  // 🔥 SỬA HÀM NÀY ĐỂ TRÁNH LỖI 400
  async equipItem(userId: string, itemId: string) {
    // 1. Tìm User
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // 2. Tìm Item để biết loại (Pet, Skin, Hat...)
    const item = await this.itemModel.findById(itemId);
    if (!item) throw new NotFoundException('Item not found');

    // 3. Kiểm tra sở hữu (Dùng .some() và .toString() để so sánh chính xác)
    // Lưu ý: inventory trong DB có thể là mảng ObjectId hoặc String, cách này cân được hết
    const isOwned = user.inventory.some((id) => id.toString() === itemId);

    if (!isOwned) {
      // ⚠️ ĐÂY LÀ NGUYÊN NHÂN GÂY LỖI 400 CỦA BẠN
      throw new BadRequestException(
        'Bạn chưa sở hữu vật phẩm này! Hãy mua trước.',
      );
    }

    // 4. Xác định slot và cập nhật
    const slot = item.type.toLowerCase(); // 'pet', 'skin', 'hat'...

    // Logic Toggle: Nếu đang mặc đúng món đó thì tháo ra, chưa thì mặc vào
    if (user.equipped && user.equipped[slot] === itemId) {
      if (user.equipped) user.equipped[slot] = null;
    } else {
      if (!user.equipped) user.equipped = {} as any;
      user.equipped[slot] = itemId;
    }

    // 5. Cập nhật trường equippedPet ở root (để tiện populate)
    if (item.type === 'PET') {
      const currentPetId = user.equippedPet
        ? user.equippedPet.toString()
        : null;

      if (currentPetId === itemId) {
        user.equippedPet = null as any; // Tháo Pet
      } else {
        user.equippedPet = new Types.ObjectId(itemId) as any; // Mặc Pet
      }
    }

    await user.save();

    // 6. Trả về kết quả đầy đủ (Populate để Frontend hiển thị ngay)
    const updatedUser = await this.userModel
      .findById(userId)
      .populate('equippedPet');

    return updatedUser ? updatedUser.equippedPet : ''; // Trả về object Pet mới để Frontend cập nhật State
  }

  async unequipPet(userId: string) {
    return this.userModel
      .findByIdAndUpdate(userId, { equippedPet: null }, { new: true })
      .exec();
  }

  async searchForAddStudent(email: string) {
    // Tìm user có email khớp (không phân biệt hoa thường)
    const user = await this.userModel
      .findOne({
        email: { $regex: `^${email}$`, $options: 'i' }, // Dùng Regex để tìm chính xác nhưng không phân biệt hoa thường
      })
      .select('_id fullName email avatar studentId role') // Chỉ lấy các trường cần thiết
      .exec();

    if (!user) {
      // Trả về null thay vì ném lỗi để Frontend dễ xử lý logic "Không tìm thấy"
      return null;
    }

    return user;
  }
}
