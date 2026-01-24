"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Image as ImageIcon,
  Video,
  Mic,
  FileText,
  Play,
  ExternalLink,
  Trash2,
  Edit,
  MoreVertical,
  LayoutGrid,
  List,
} from "lucide-react";
import MediaUploadModal from "@/components/admin/media/MediaUploadModal";
import { mediaService } from "@/services/media.service";
import { motion, AnimatePresence } from "framer-motion";

export default function MediaLibraryPage() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"GRID" | "LIST">("GRID");

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const data: any = await mediaService.getAll({
        type: activeTab,
        search: searchTerm,
      });
      setMediaList(data || []);
    } catch (error) {
      console.error("Lỗi tải media:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchMedia(), 300); // Debounce search
    return () => clearTimeout(timeout);
  }, [activeTab, searchTerm]);

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa file này?")) {
      try {
        await mediaService.delete(id);
        fetchMedia();
      } catch (error) {
        alert("Lỗi khi xóa file");
      }
    }
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <Video size={14} />;
      case "AUDIO":
        return <Mic size={14} />;
      case "IMAGE":
        return <ImageIcon size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col p-6 bg-slate-50/50">
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Kho Tài Nguyên Media
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Quản lý tất cả file hình ảnh, video và âm thanh của hệ thống.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition transform hover:-translate-y-1"
        >
          <Plus size={20} /> Upload File
        </button>
      </div>

      {/* 2. TOOLBAR */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl w-full md:w-auto">
          {["ALL", "IMAGE", "VIDEO", "AUDIO"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              {tab === "ALL" ? "Tất cả" : tab}
            </button>
          ))}
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, tag..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-200 rounded-xl text-sm font-medium outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode("GRID")}
              className={`p-2 rounded-md transition ${viewMode === "GRID" ? "bg-white shadow text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("LIST")}
              className={`p-2 rounded-md transition ${viewMode === "LIST" ? "bg-white shadow text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. MEDIA CONTENT */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] bg-slate-200 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : mediaList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <ImageIcon size={32} className="opacity-50" />
            </div>
            <p className="font-bold">Không tìm thấy file nào.</p>
          </div>
        ) : (
          <div
            className={`
            ${
              viewMode === "GRID"
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6"
                : "flex flex-col gap-3"
            }
          `}
          >
            <AnimatePresence>
              {mediaList.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  key={item._id}
                  className={`
                    group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 relative
                    ${viewMode === "LIST" ? "flex items-center p-3 gap-4" : "flex flex-col"}
                  `}
                >
                  {/* Thumbnail Area */}
                  <div
                    className={`
                    relative overflow-hidden bg-slate-100 flex items-center justify-center
                    ${viewMode === "GRID" ? "aspect-[4/3] w-full" : "w-24 h-24 rounded-xl shrink-0"}
                  `}
                  >
                    {item.type === "VIDEO" || item.type === "IMAGE" ? (
                      <img
                        src={item.thumbnail || item.url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="text-slate-300 flex flex-col items-center">
                        <Mic size={viewMode === "GRID" ? 48 : 24} />
                      </div>
                    )}

                    {/* Play Button Overlay */}
                    {(item.type === "VIDEO" || item.type === "AUDIO") && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition">
                        <div className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-800 shadow-lg scale-90 group-hover:scale-110 transition-transform">
                          <Play
                            size={18}
                            fill="currentColor"
                            className="ml-0.5"
                          />
                        </div>
                      </div>
                    )}

                    {/* Type Badge */}
                    {viewMode === "GRID" && (
                      <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {getIconByType(item.type)} {item.provider}
                      </div>
                    )}
                  </div>

                  {/* Info Area */}
                  <div
                    className={`flex-1 min-w-0 ${viewMode === "GRID" ? "p-4" : "py-1 pr-4"}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-2">
                        <h3
                          className="font-bold text-slate-700 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors"
                          title={item.title}
                        >
                          {item.title}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono truncate">
                          {item.fileName || "File name"} •{" "}
                          {(item.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      {/* Action Buttons (Always visible in List, Hover in Grid) */}
                      <div
                        className={`flex gap-1 ${viewMode === "GRID" ? "opacity-0 group-hover:opacity-100 transition-opacity" : ""}`}
                      >
                        <button
                          onClick={() => window.open(item.url, "_blank")}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Xem"
                        >
                          <ExternalLink size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                          title="Sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.tags?.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium border border-slate-200"
                        >
                          #{tag}
                        </span>
                      ))}
                      {item.tags?.length > 3 && (
                        <span className="text-[10px] text-slate-400 px-1 py-0.5">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* UPLOAD MODAL */}
      {isModalOpen && (
        <MediaUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchMedia();
          }} // Refresh sau khi upload xong
          initialData={editingItem}
        />
      )}
    </div>
  );
}
