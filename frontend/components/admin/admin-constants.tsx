import {
  LayoutDashboard,
  PieChart, // Tổng quan
  Library,
  BookOpen,
  FileText,
  Film,
  Dumbbell,
  Book, // Content CMS
  MonitorPlay,
  CalendarDays, // Vận hành Lớp
  Users,
  GraduationCap,
  Contact,
  AlertTriangle, // Người dùng
  Gamepad2,
  ShoppingBag,
  MessageSquare, // Gamification
  TicketPercent,
  BellRing,
  Megaphone,
  DollarSign, // Marketing & Finance
  Bot,
  Shield,
  History,
  Settings, // Hệ thống
} from "lucide-react";

export const ADMIN_MENU = [
  // 1. DASHBOARD
  {
    group: "TỔNG QUAN",
    items: [
      {
        name: "Dashboard",
        icon: <LayoutDashboard size={20} />,
        href: "/admin",
      },
      {
        name: "Phân tích số liệu",
        icon: <PieChart size={20} />,
        href: "/admin/analytics",
      },
    ],
  },

  // 2. KHO NỘI DUNG (Content CMS - Nơi soạn bài)
  {
    group: "KHO GIÁO TRÌNH (CMS)",
    items: [
      {
        name: "Quản lý Khóa học", // Tạo Course, Unit, Lesson (Game/Video)
        icon: <Library size={20} />,
        href: "/admin/courses",
      },
      {
        name: "Ngân hàng Câu hỏi", // Soạn câu hỏi trắc nghiệm
        icon: <BookOpen size={20} />,
        href: "/admin/questions",
      },
      {
        name: "Thư viện Media", // Quản lý ảnh/video/audio upload
        icon: <FileText size={20} />,
        href: "/admin/media",
      },
      {
        name: "Từ điển & Sổ tay", // Flashcards
        icon: <Book size={20} />,
        href: "/admin/handbook",
      },
      {
        name: "Kho Luyện tập", // Bài tập tự luyện
        icon: <Dumbbell size={20} />,
        href: "/admin/practice",
      },
      {
        name: "Phim & Giải trí",
        icon: <Film size={20} />,
        href: "/admin/entertainment",
      },
    ],
  },

  // 3. VẬN HÀNH (Operation - Nơi tổ chức dạy)
  {
    group: "TỔ CHỨC LỚP HỌC (LIVE)",
    items: [
      {
        // Gộp manage-classes và live-classes vào đây
        name: "Quản lý Lớp Live",
        icon: <MonitorPlay size={20} />,
        href: "/admin/manage-classes", // Tạo lớp, xếp giáo viên, thêm học sinh
      },
      {
        name: "Lịch dạy toàn trường",
        icon: <CalendarDays size={20} />,
        href: "/admin/schedule",
      },

      {
        name: "Blogs",
        icon: <CalendarDays size={20} />,
        href: "/admin/manage-posts",
      },
    ],
  },

  // 4. CON NGƯỜI (HRM & CRM)
  {
    group: "NGƯỜI DÙNG",
    items: [
      {
        name: "Danh sách Học viên",
        icon: <Users size={20} />,
        href: "/admin/users",
      },
      {
        // Di chuyển Tutor về đây cho đúng nhóm người
        name: "Đội ngũ Giảng viên",
        icon: <GraduationCap size={20} />,
        href: "/admin/tutors", // Hoặc filter /admin/users?role=TUTOR
      },
      {
        name: "Báo cáo / Khiếu nại",
        icon: <AlertTriangle size={20} />,
        href: "/admin/reports",
      },
      {
        name: "Hỗ trợ khách hàng",
        icon: <Contact size={20} />,
        href: "/admin/support",
      },
    ],
  },

  // 5. GAMIFICATION
  {
    group: "GAMIFICATION",
    items: [
      {
        name: "Nhiệm vụ & Level",
        icon: <Gamepad2 size={20} />,
        href: "/admin/gamification",
      },
      {
        name: "Cửa hàng vật phẩm",
        icon: <ShoppingBag size={20} />,
        href: "/admin/shop",
      },
      {
        name: "Cộng đồng & Blog",
        icon: <MessageSquare size={20} />,
        href: "/admin/community",
      },
    ],
  },

  // 6. KINH DOANH (Business)
  {
    group: "KINH DOANH & MARKETING",
    items: [
      {
        name: "Doanh thu & Đơn hàng",
        icon: <DollarSign size={20} />,
        href: "/admin/finance",
      },
      {
        name: "Mã giảm giá (Voucher)",
        icon: <TicketPercent size={20} />,
        href: "/admin/vouchers",
      },
      {
        name: "Chiến dịch Thông báo",
        icon: <BellRing size={20} />,
        href: "/admin/notifications",
      },
      {
        name: "Banner Quảng cáo",
        icon: <Megaphone size={20} />,
        href: "/admin/banners",
      },
    ],
  },

  // 7. HỆ THỐNG (System)
  {
    group: "CẤU HÌNH HỆ THỐNG",
    items: [
      {
        name: "Cấu hình AI Teacher",
        icon: <Bot size={20} />,
        href: "/admin/ai-config",
      },
      {
        name: "Phân quyền (Roles)",
        icon: <Shield size={20} />,
        href: "/admin/roles",
      },
      {
        name: "Nhật ký hoạt động",
        icon: <History size={20} />,
        href: "/admin/audit-logs",
      },
      {
        name: "Cài đặt chung",
        icon: <Settings size={20} />,
        href: "/admin/settings",
      },
    ],
  },
];
