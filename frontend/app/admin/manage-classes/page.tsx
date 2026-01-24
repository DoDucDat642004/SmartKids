"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Users,
  Search,
  BookOpen,
  X,
  Filter,
  Trash2,
  Edit,
  MonitorPlay,
  Save,
  Loader2,
  LayoutGrid,
  List,
  MoreVertical,
  GraduationCap,
  Clock,
} from "lucide-react";
import { liveClassService } from "@/services/live-class.service";

export default function ManageClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [viewMode, setViewMode] = useState<"GRID" | "TABLE">("GRID"); // Chế độ xem

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [courses, setCourses] = useState<any[]>([]);
  const [tutors, setTutors] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    baseCourseId: "",
    tutorId: "",
    isActive: true,
  });

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [classRes, courseRes, tutorRes] = await Promise.all([
        liveClassService.getAllClasses(),
        liveClassService.getAllCourses(),
        liveClassService.getAllTutors(),
      ]);
      setClasses(classRes.data || classRes);
      setCourses(courseRes.data || courseRes);
      setTutors(tutorRes.data || tutorRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS ---
  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: "", baseCourseId: "", tutorId: "", isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (cls: any) => {
    setEditingId(cls._id);
    setFormData({
      name: cls.name,
      baseCourseId: cls.baseCourseId?._id || "",
      tutorId: cls.tutorId?._id || "",
      isActive: cls.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (editingId) {
        await liveClassService.updateClass(editingId, {
          name: formData.name,
          tutorId: formData.tutorId,
          isActive: formData.isActive,
        });
      } else {
        await liveClassService.createClass(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert("Đã có lỗi xảy ra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa lớp này?")) return;
    try {
      await liveClassService.deleteClass(id);
      setClasses((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      alert("Lỗi khi xóa lớp.");
    }
  };

  // --- FILTERING ---
  const filteredClasses = classes.filter((cls) => {
    const matchSearch =
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.tutorId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "ALL"
        ? true
        : filterStatus === "ACTIVE"
          ? cls.isActive
          : !cls.isActive;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: classes.length,
    active: classes.filter((c) => c.isActive).length,
    students: classes.reduce(
      (acc, curr) => acc + (curr.students?.length || 0),
      0,
    ),
  };

  return (
    <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen font-sans text-slate-800">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Quản Lý Lớp Học
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Điều phối và vận hành các lớp học trực tuyến.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition active:scale-95"
        >
          <Plus size={20} strokeWidth={3} /> Mở Lớp Mới
        </button>
      </div>

      {/* 2. STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Tổng số lớp",
            value: stats.total,
            icon: MonitorPlay,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Đang hoạt động",
            value: stats.active,
            icon: BookOpen,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Tổng học viên",
            value: stats.students,
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition"
          >
            <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                {item.label}
              </p>
              <p className="text-2xl font-black text-slate-800">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-10">
        {/* Search */}
        <div className="relative w-full md:w-96 group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition"
            size={18}
          />
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition"
            placeholder="Tìm theo tên lớp, giáo viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Filter size={16} className="text-slate-500" />
            <select
              className="bg-transparent text-slate-600 text-sm font-bold outline-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">Tất cả</option>
              <option value="ACTIVE">Đang mở</option>
              <option value="INACTIVE">Đã đóng</option>
            </select>
          </div>

          {/* View Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("GRID")}
              className={`p-2 rounded-lg transition-all ${viewMode === "GRID" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("TABLE")}
              className={`p-2 rounded-lg transition-all ${viewMode === "TABLE" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. CONTENT DISPLAY */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-400 font-medium">Đang tải dữ liệu...</p>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <MonitorPlay className="text-slate-300" size={40} />
          </div>
          <p className="text-slate-500 font-medium">
            Không tìm thấy lớp học nào.
          </p>
        </div>
      ) : (
        <>
          {/* === GRID VIEW === */}
          {viewMode === "GRID" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredClasses.map((cls) => (
                <div
                  key={cls._id}
                  className="group bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Card Header */}
                  <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900 relative p-6 flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                      <MonitorPlay size={100} className="text-white" />
                    </div>

                    <div className="flex justify-between items-start relative z-10">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${cls.isActive ? "bg-green-500 text-white border-green-400" : "bg-slate-500 text-slate-200 border-slate-400"}`}
                      >
                        {cls.isActive ? "Đang mở" : "Đã đóng"}
                      </span>
                      {/* Menu 3 chấm (nếu cần) */}
                      <button className="text-white/50 hover:text-white">
                        <MoreVertical size={20} />
                      </button>
                    </div>

                    <h3 className="text-white font-bold text-lg line-clamp-1 relative z-10 group-hover:text-blue-300 transition">
                      {cls.name}
                    </h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col gap-4">
                    {/* Tutor Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                        {cls.tutorId?.avatar ? (
                          <img src={cls.tutorId.avatar} alt="" />
                        ) : (
                          "GV"
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">
                          Giảng viên
                        </p>
                        <p className="text-sm font-bold text-slate-700">
                          {cls.tutorId?.fullName || "Chưa phân công"}
                        </p>
                      </div>
                    </div>

                    <div className="w-full h-px bg-slate-100"></div>

                    {/* Course Info */}
                    <div className="flex justify-between items-center text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={16} className="text-purple-500" />
                        <span
                          className="font-medium truncate max-w-[120px]"
                          title={cls.baseCourseId?.title}
                        >
                          {cls.baseCourseId?.title || "Course"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-orange-500" />
                        <span className="font-bold">
                          {cls.students?.length || 0}
                        </span>{" "}
                        HV
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/manage-classes/${cls._id}`)
                      }
                      className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 transition"
                    >
                      <BookOpen size={14} /> Chi tiết
                    </button>
                    <button
                      onClick={() => openEditModal(cls)}
                      className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-200 transition"
                    >
                      <Edit size={14} /> Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteClass(cls._id)}
                      className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 transition"
                    >
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* === TABLE VIEW === */}
          {viewMode === "TABLE" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-5 pl-6">Lớp học</th>
                    <th className="p-5">Giảng viên</th>
                    <th className="p-5">Giáo trình gốc</th>
                    <th className="p-5 text-center">Sĩ số</th>
                    <th className="p-5 text-center">Trạng thái</th>
                    <th className="p-5 text-right pr-6">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredClasses.map((cls) => (
                    <tr
                      key={cls._id}
                      className="hover:bg-blue-50/30 transition group"
                    >
                      <td className="p-5 pl-6 font-bold text-slate-700">
                        {cls.name}
                      </td>
                      <td className="p-5 text-slate-600">
                        {cls.tutorId?.fullName || "-"}
                      </td>
                      <td className="p-5 text-slate-600 max-w-[200px] truncate">
                        {cls.baseCourseId?.title || "-"}
                      </td>
                      <td className="p-5 text-center font-bold">
                        {cls.students?.length}
                      </td>
                      <td className="p-5 text-center">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${cls.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
                        >
                          {cls.isActive ? "Active" : "Closed"}
                        </span>
                      </td>
                      <td className="p-5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition">
                          <button
                            onClick={() =>
                              router.push(`/admin/manage-classes/${cls._id}`)
                            }
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg"
                          >
                            <BookOpen size={16} />
                          </button>
                          <button
                            onClick={() => openEditModal(cls)}
                            className="p-2 hover:bg-orange-100 text-orange-500 rounded-lg"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClass(cls._id)}
                            className="p-2 hover:bg-red-100 text-red-500 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                {editingId ? (
                  <Edit className="text-orange-500" />
                ) : (
                  <MonitorPlay className="text-blue-600" />
                )}
                {editingId ? "Cập nhật lớp học" : "Tạo Lớp Học Mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white rounded-full transition text-slate-400 hover:text-red-500 shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-6 overflow-y-auto"
            >
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Tên lớp học
                </label>
                <input
                  className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none font-bold text-slate-700 transition"
                  placeholder="VD: Tiếng Anh K12 - Sáng T2/T4"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Giáo trình gốc
                  </label>
                  <select
                    className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium disabled:opacity-60"
                    value={formData.baseCourseId}
                    onChange={(e) =>
                      setFormData({ ...formData, baseCourseId: e.target.value })
                    }
                    required
                    disabled={!!editingId}
                  >
                    <option value="">-- Chọn giáo trình --</option>
                    {courses.map((c: any) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Giảng viên
                  </label>
                  <select
                    className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-sm font-medium"
                    value={formData.tutorId}
                    onChange={(e) =>
                      setFormData({ ...formData, tutorId: e.target.value })
                    }
                    required
                  >
                    <option value="">-- Chọn GV --</option>
                    {tutors.map((t: any) => (
                      <option key={t._id} value={t._id}>
                        {t.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {editingId && (
                <div className="flex items-center gap-3 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                  <label className="text-sm font-bold text-yellow-800">
                    Trạng thái:
                  </label>
                  <select
                    className="bg-white border border-yellow-200 rounded-lg text-sm px-4 py-1.5 outline-none font-bold text-yellow-700 cursor-pointer hover:border-yellow-400 transition"
                    value={formData.isActive ? "true" : "false"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: e.target.value === "true",
                      })
                    }
                  >
                    <option value="true">Đang mở (Active)</option>
                    <option value="false">Đã đóng (Inactive)</option>
                  </select>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-white font-bold py-4 rounded-xl transition shadow-lg hover:shadow-xl transform active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70 ${
                    editingId
                      ? "bg-gradient-to-r from-orange-500 to-red-500 shadow-orange-200"
                      : "bg-slate-900 hover:bg-slate-800 shadow-slate-300"
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : editingId ? (
                    <>
                      <Save size={20} /> Lưu Thay Đổi
                    </>
                  ) : (
                    <>
                      <Plus size={20} /> Xác Nhận Tạo
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
