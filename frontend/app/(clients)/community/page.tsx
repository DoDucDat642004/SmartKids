"use client";

import { useState, useEffect } from "react";
import { communityService } from "@/services/community.service";
import { userService } from "@/services/user.service";
import {
  Loader2,
  Heart,
  MessageCircle,
  Share2,
  Trophy,
  Crown,
  Sparkles,
  Image as ImageIcon,
  Smile,
  Send,
  X,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- 1. MOCK DATA ---
const MOCK_POSTS = [
  {
    _id: "mock_1",
    userId: "user_1",
    content:
      "Yeahh! Cuối cùng tớ cũng hoàn thành khóa 'Tiếng Anh Khởi Động' rồi nè các bạn ơi! 🥳 Cảm ơn cô giáo đã giúp đỡ em rất nhiều ạ.",
    images: [
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80",
    ],
    likes: 45,
    createdAt: new Date().toISOString(),
    isFeatured: true,
    commentsCount: 12,
    user: {
      name: "Bé Gia Hân",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GiaHan",
      level: 5,
    },
  },
  {
    _id: "mock_2",
    userId: "user_2",
    content:
      "Hôm nay mình học được từ mới là 'Astronaut' - Phi hành gia. Có bạn nào muốn làm phi hành gia giống tớ không? 🚀✨",
    images: [],
    likes: 8,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    isFeatured: false,
    commentsCount: 3,
    user: {
      name: "Tuấn Tú",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TuanTu",
      level: 2,
    },
  },
  {
    _id: "mock_3",
    userId: "user_3",
    content:
      "Khoe với cả nhà chú Rồng Lửa cấp 3 siêu ngầu của tớ! 🔥🐉 Phải làm chăm chỉ bài tập lắm mới đổi được đó nha.",
    images: [
      "https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?auto=format&fit=crop&w=800&q=80",
    ],
    likes: 128,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    isFeatured: true,
    commentsCount: 45,
    user: {
      name: "Hoàng Lâm",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HoangLam",
      level: 8,
    },
  },
];

// Helpers
const generateUserInfo = (userId: string) => ({
  name: "Bạn giấu tên",
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
  level: 1,
});

const timeAgo = (dateString: string) => {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
};

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", bounce: 0.4 },
  },
  exit: { opacity: 0, scale: 0.9 },
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  // --- 3. FETCH DATA ---
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const userRes = await userService.getProfile().catch(() => null);
        setCurrentUser(
          userRes || {
            fullName: "Bạn",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
          },
        );

        const realData: any = await communityService.getPublicFeed();
        let finalData = [];

        if (!realData || realData.length === 0) {
          finalData = MOCK_POSTS;
        } else {
          finalData = realData.map((post: any) => {
            const userInfo = post.author
              ? {
                  name: post.author.fullName,
                  avatar:
                    post.author.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}`,
                  level: post.author.stats?.level || 1,
                }
              : generateUserInfo(post.userId || "unknown");

            return {
              id: post._id,
              user: userInfo,
              content: post.content,
              image: post.images?.[0] || "",
              time: timeAgo(post.createdAt),
              likes: post.likes || 0,
              isLiked: false,
              isFeatured: post.isFeatured || false,
              commentsCount: post.comments?.length || 0,
            };
          });
        }
        setPosts(finalData);
      } catch (error) {
        console.error("Error:", error);
        setPosts(MOCK_POSTS);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // --- 4. HANDLERS ---
  const handleLike = async (id: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === id || post._id === id) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked,
          };
        }
        return post;
      }),
    );
    try {
      await communityService.likePost(id, true);
    } catch (e) {}
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setIsPosting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newPost = {
      id: `new_${Date.now()}`,
      user: {
        name: currentUser?.fullName || "Bạn",
        avatar:
          currentUser?.avatar ||
          "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
        level: currentUser?.stats?.level || 1,
      },
      content: newPostContent,
      time: "Vừa xong",
      likes: 0,
      isLiked: false,
      isFeatured: false,
      commentsCount: 0,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setShowCreateModal(false);
    setIsPosting(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 gap-3">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="font-medium animate-pulse">Đang tải bảng vàng...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F0F4F8] pb-24 font-sans text-slate-900">
      {/* HEADER HERO */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white pt-24 pb-20 rounded-b-[3rem] shadow-xl mb-8 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-yellow-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-3xl md:text-5xl font-black mb-3 flex items-center justify-center gap-3 drop-shadow-lg tracking-tight"
          >
            Bảng Vàng Thành Tích{" "}
            <Trophy className="text-yellow-300 fill-yellow-300 w-8 h-8 md:w-12 md:h-12 animate-bounce" />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-blue-100 text-sm md:text-lg max-w-2xl mx-auto font-medium opacity-90"
          >
            Nơi tỏa sáng của những ngôi sao nhỏ! Cùng chia sẻ niềm vui và kết
            bạn bốn phương nhé! 🌟
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 space-y-6 relative z-20 -mt-12">
        {/* === INPUT FORM === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-4 md:p-5 rounded-[2rem] shadow-lg border-2 border-white/50 backdrop-blur-sm flex flex-col gap-4 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
          onClick={() => setShowCreateModal(true)}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-purple-100 p-0.5 bg-white shrink-0">
              <img
                src={currentUser?.avatar}
                className="w-full h-full rounded-full object-cover bg-slate-100"
                alt="Me"
              />
            </div>
            <div className="flex-1 bg-slate-100 group-hover:bg-slate-50 transition rounded-full px-5 py-3 text-slate-500 text-sm font-medium border border-transparent group-hover:border-blue-200">
              {currentUser?.fullName ? `Hi ${currentUser.fullName}, ` : ""}hôm
              nay bạn học được gì thế?
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 px-2">
            <div className="flex gap-2 md:gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full hover:bg-green-50 hover:text-green-600 transition">
                <ImageIcon size={16} className="text-green-500" />{" "}
                <span>Ảnh/Video</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full hover:bg-yellow-50 hover:text-yellow-600 transition">
                <Smile size={16} className="text-yellow-500" />{" "}
                <span>Cảm xúc</span>
              </div>
            </div>
            <div className="bg-blue-600 text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-md shadow-blue-200 group-hover:bg-blue-700 transition">
              Đăng bài
            </div>
          </div>
        </motion.div>

        {/* FEED POSTS */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <motion.div
                key={post.id || post._id}
                layout // Tự động animate layout khi thêm bài mới
                variants={itemVariants}
                className="bg-white rounded-[2rem] p-5 md:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300"
              >
                {/* Header Post */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-2 border-slate-100 p-0.5 overflow-hidden">
                        <img
                          src={post.user.avatar}
                          className="w-full h-full rounded-full object-cover bg-slate-50"
                          alt={post.user.name}
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                        {post.user.level}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        {post.user.name}
                        {post.user.level >= 5 && (
                          <Crown
                            size={14}
                            className="text-yellow-500 fill-yellow-500"
                          />
                        )}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {post.time}
                        </span>
                        <span>•</span>
                        <span>🌏 Công khai</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.isFeatured && (
                      <div className="bg-red-50 text-red-500 px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide border border-red-100">
                        <Sparkles size={12} fill="currentColor" /> Hot
                      </div>
                    )}
                    <button className="text-slate-300 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="text-slate-700 mb-4 leading-relaxed whitespace-pre-wrap text-[15px]">
                  {post.content}
                </div>

                {/* Image Grid */}
                {post.image && (
                  <div className="w-full relative rounded-2xl overflow-hidden mb-5 border border-slate-100 bg-slate-50 group cursor-pointer">
                    <img
                      src={post.image}
                      className="w-full h-auto max-h-[500px] object-cover hover:scale-105 transition duration-700"
                      alt="Post content"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex gap-1 md:gap-4">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleLike(post.id || post._id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                        post.isLiked
                          ? "text-red-500 bg-red-50"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                      }`}
                    >
                      <Heart
                        size={20}
                        fill={post.isLiked ? "currentColor" : "none"}
                        className={post.isLiked ? "animate-bounce-short" : ""}
                      />
                      {post.likes > 0 && post.likes}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
                    >
                      <MessageCircle size={20} />
                      {post.commentsCount > 0 && post.commentsCount}
                    </motion.button>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                  >
                    <Share2 size={20} />
                    <span className="hidden sm:inline">Chia sẻ</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="text-center pt-8 pb-4 text-slate-400 text-sm font-medium">
          Đã hiển thị hết bài viết
        </div>
      </div>

      {/* === MODAL === */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-800">
                  Tạo bài viết mới
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                    <img
                      src={currentUser?.avatar}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">
                      {currentUser?.fullName || "Bạn"}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 font-bold">
                        🌏 Công khai
                      </span>
                    </div>
                  </div>
                </div>
                <textarea
                  className="w-full h-40 resize-none text-slate-700 text-lg placeholder:text-slate-300 focus:outline-none"
                  placeholder="Bạn đang nghĩ gì thế?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  autoFocus
                ></textarea>
                <div className="border border-slate-200 rounded-xl p-3 flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-slate-500 pl-2">
                    Thêm vào bài viết
                  </span>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-green-50 rounded-full text-green-500 transition">
                      <ImageIcon size={20} />
                    </button>
                    <button className="p-2 hover:bg-yellow-50 rounded-full text-yellow-500 transition">
                      <Smile size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 px-6 border-t border-slate-100 bg-slate-50">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim() || isPosting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                  {isPosting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Send size={18} /> Đăng ngay
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
