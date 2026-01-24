"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postService } from "@/services/post.service";
import {
  Calendar,
  ArrowRight,
  BookOpen,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Hiệu ứng xuất hiện lần lượt
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50 },
  },
};

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [loading, setLoading] = useState(true); // Thêm state loading

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res: any = await postService.getAll(
          activeTab === "ALL" ? "" : activeTab,
        );
        setPosts(res.data || res);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      {/* HERO SECTION */}
      <div className="bg-slate-900 text-white py-20 px-6 text-center relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Góc Học Tập & Tin Tức
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Cập nhật những tin tức mới nhất và các bí quyết học tập hiệu quả từ
            đội ngũ giảng viên SmartKids.
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        {/* TABS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center flex-wrap gap-4 mb-12"
        >
          {[
            { id: "ALL", label: "Tất cả", icon: BookOpen },
            { id: "NEWS", label: "Tin tức", icon: Calendar },
            { id: "TIPS", label: "Bí quyết học", icon: Sparkles },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-colors border ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-white hover:bg-slate-50"
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* CONTENT AREA */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-20"
            >
              <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab} // Key thay đổi để trigger lại animation khi đổi tab
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {posts.length > 0 ? (
                posts.map((post: any) => (
                  <motion.div
                    key={post._id}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group flex flex-col h-full hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="h-52 overflow-hidden relative bg-slate-100">
                      <img
                        src={
                          post.thumbnail ||
                          "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className={`text-[10px] font-bold px-3 py-1 rounded-full shadow-md text-white uppercase tracking-wider ${
                            post.category === "TIPS"
                              ? "bg-purple-500"
                              : "bg-blue-600"
                          }`}
                        >
                          {post.category === "TIPS" ? "Bí Quyết" : "Tin Tức"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wide">
                        <Calendar size={12} />{" "}
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </div>

                      <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                        {post.excerpt || "Xem chi tiết nội dung bài viết..."}
                      </p>

                      <Link
                        href={`/blogs/${post.slug}`}
                        className="flex items-center gap-2 text-slate-700 font-bold text-sm group/link hover:text-blue-600 transition-colors mt-auto"
                      >
                        Đọc tiếp
                        <ArrowRight
                          size={16}
                          className="group-hover/link:translate-x-1 transition-transform"
                        />
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={32} className="text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">
                    Chưa có bài viết nào trong mục này.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
