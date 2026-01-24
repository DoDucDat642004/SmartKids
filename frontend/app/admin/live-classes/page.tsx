"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Plus,
  Search,
  Video,
  Users,
  Trash2,
  Save,
  X,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { liveService } from "@/services/live.service";

export default function LiveClassManager() {
  // --- STATES ---
  const [classes, setClasses] = useState<any[]>([]);
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State: Create Class
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    tutorId: "",
    startTime: "",
    endTime: "",
  });

  // Modal State: Update Record
  const [recordModal, setRecordModal] = useState<{
    isOpen: boolean;
    classId: string;
    url: string;
  }>({
    isOpen: false,
    classId: "",
    url: "",
  });

  // Modal State: Add Student
  const [availableStudents, setAvailableStudents] = useState<any[]>([]);
  const [studentModal, setStudentModal] = useState<{
    isOpen: boolean;
    classId: string;
  }>({
    isOpen: false,
    classId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // --- 1. LOAD DATA ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resClasses, resTutors, resStudents] = await Promise.all([
        liveService.getClasses(),
        liveService.getTutors(),
        liveService.getStudents(),
      ]);

      // Handle Classes
      if (Array.isArray(resClasses)) setClasses(resClasses);
      else if ((resClasses as any)?.data) setClasses((resClasses as any).data);
      else setClasses([]);

      // Handle Tutors
      if (Array.isArray(resTutors)) setTutors(resTutors);
      else if ((resTutors as any)?.data) setTutors((resTutors as any).data);
      else setTutors([]);

      // Handle Students
      if (Array.isArray(resStudents)) setAvailableStudents(resStudents);
      else if ((resStudents as any)?.data)
        setAvailableStudents((resStudents as any).data);
      else setAvailableStudents([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. HANDLERS ---

  // Tạo lớp
  const handleCreateClass = async () => {
    if (!formData.title || !formData.tutorId || !formData.startTime)
      return alert("Thiếu thông tin!");
    try {
      await liveService.createClass({
        title: formData.title,
        tutor: formData.tutorId,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      });
      setIsModalOpen(false);
      fetchData();
      alert("Tạo lớp thành công!");
    } catch (e) {
      alert("Lỗi khi tạo lớp");
    }
  };

  // Xóa lớp
  const handleDeleteClass = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa lớp học này?")) {
      try {
        await liveService.deleteClass(id);
        fetchData();
      } catch (error) {
        alert("Lỗi khi xóa lớp");
      }
    }
  };

  // Lưu Record
  const handleSaveRecord = async () => {
    try {
      await liveService.updateRecord(recordModal.classId, recordModal.url);
      setRecordModal({ ...recordModal, isOpen: false });
      fetchData();
    } catch (e) {
      alert("Lỗi lưu record");
    }
  };

  // Thêm học sinh
  const handleAddStudentToClass = async (studentId: string) => {
    try {
      await liveService.addStudent(studentModal.classId, studentId);
      // Refresh lại danh sách lớp để thấy học sinh mới vào
      const resClasses: any = await liveService.getClasses();
      if (Array.isArray(resClasses)) setClasses(resClasses);
      else if (resClasses.data) setClasses(resClasses.data);

      alert("Đã thêm học sinh vào lớp!");
    } catch (error) {
      alert("Lỗi: Có thể học sinh này đã ở trong lớp rồi.");
    }
  };

  // Lọc danh sách học sinh theo từ khóa tìm kiếm
  const filteredStudents = availableStudents.filter(
    (s) =>
      s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // --- RENDER ---
  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Quản lý Lớp Trực tuyến 🎥
          </h1>
          <p className="text-slate-500 text-sm">
            Lên lịch và quản lý các buổi học.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition"
        >
          <Plus size={20} /> Lên Lịch Mới
        </button>
      </div>

      {/* CLASS LIST GRID */}
      {loading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {classes.map((cls) => {
            const isCompleted = cls.status === "COMPLETED";
            return (
              <div
                key={cls._id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition group relative"
              >
                {/* Status Badge */}
                <div
                  className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded uppercase ${isCompleted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {cls.status}
                </div>

                {/* Time & Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-xl text-center min-w-[70px]">
                    <div className="font-bold text-xl leading-none">
                      {format(new Date(cls.startTime), "HH:mm")}
                    </div>
                    <div className="text-[10px] uppercase font-bold mt-1">
                      {format(new Date(cls.startTime), "dd/MM")}
                    </div>
                  </div>
                  <div>
                    <h3
                      className="font-bold text-slate-800 line-clamp-1 text-lg"
                      title={cls.title}
                    >
                      {cls.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <User size={12} /> GV:{" "}
                      <span className="font-bold text-slate-700">
                        {cls.tutor?.fullName || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100 my-4" />

                {/* Students Section */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Users size={14} /> HỌC VIÊN ({cls.students?.length || 0})
                    </span>
                    <button
                      onClick={() =>
                        setStudentModal({ isOpen: true, classId: cls._id })
                      }
                      className="text-blue-600 text-xs font-bold hover:underline hover:bg-blue-50 px-2 py-1 rounded"
                    >
                      + Thêm
                    </button>
                  </div>

                  <div className="flex -space-x-2 overflow-hidden py-1 pl-1 h-8 items-center">
                    {cls.students?.length > 0 ? (
                      cls.students.map((st: any, i: number) => (
                        <img
                          key={i}
                          src={st.avatar || "https://i.pravatar.cc/150"}
                          className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 object-cover"
                          title={st.fullName}
                        />
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Chưa có học viên
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-2">
                  {cls.recordingUrl ? (
                    <a
                      href={cls.recordingUrl}
                      target="_blank"
                      className="flex-1 bg-green-50 text-green-600 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-green-100 border border-green-200"
                    >
                      <Video size={14} /> Xem Record
                    </a>
                  ) : (
                    <button
                      onClick={() =>
                        setRecordModal({
                          isOpen: true,
                          classId: cls._id,
                          url: "",
                        })
                      }
                      className="flex-1 bg-slate-100 text-slate-500 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 border border-slate-200"
                    >
                      <Save size={14} /> Lưu Record
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteClass(cls._id)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg ml-auto"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL TẠO LỚP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Tạo Lớp Học Mới
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Tên lớp học
                </label>
                <input
                  className="w-full border p-2 rounded-lg text-sm font-bold"
                  placeholder="VD: Tiếng Anh K12 - Buổi 1"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Chọn Gia sư
                </label>
                <select
                  className="w-full border p-2 rounded-lg text-sm"
                  onChange={(e) =>
                    setFormData({ ...formData, tutorId: e.target.value })
                  }
                >
                  <option value="">-- Chọn giáo viên --</option>
                  {Array.isArray(tutors) &&
                    tutors.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.fullName} ({t.email})
                      </option>
                    ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Bắt đầu
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full border p-2 rounded-lg text-xs"
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Kết thúc
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full border p-2 rounded-lg text-xs"
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-bold"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateClass}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg"
              >
                Tạo Lịch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL CẬP NHẬT RECORD --- */}
      {recordModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-lg mb-2">Cập nhật Video Record</h3>
            <p className="text-xs text-slate-500 mb-4">
              Dán link Google Drive hoặc Youtube của buổi học đã ghi hình vào
              đây.
            </p>
            <input
              className="w-full border p-2 rounded-lg text-sm mb-4"
              placeholder="https://drive.google.com/..."
              value={recordModal.url}
              onChange={(e) =>
                setRecordModal({ ...recordModal, url: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  setRecordModal({ ...recordModal, isOpen: false })
                }
                className="px-4 py-2 text-slate-500 font-bold text-sm"
              >
                Đóng
              </button>
              <button
                onClick={handleSaveRecord}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm"
              >
                Lưu Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL CHỌN HỌC SINH --- */}
      {studentModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">
                Thêm Học Sinh vào Lớp
              </h3>
              <button
                onClick={() => setStudentModal({ isOpen: false, classId: "" })}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 bg-slate-50 border-b">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
                  placeholder="Tìm tên hoặc email học sinh..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st) => {
                  const currentClass = classes.find(
                    (c) => c._id === studentModal.classId,
                  );
                  const isAdded = currentClass?.students?.some(
                    (s: any) => s._id === st._id,
                  );
                  return (
                    <div
                      key={st._id}
                      className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition group border-b border-slate-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={st.avatar || "https://i.pravatar.cc/150"}
                          className="w-10 h-10 rounded-full border bg-gray-200 object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-700 text-sm">
                            {st.fullName}
                          </div>
                          <div className="text-xs text-slate-400">
                            {st.email}
                          </div>
                        </div>
                      </div>
                      {isAdded ? (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                          <CheckCircle size={14} /> Đã thêm
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAddStudentToClass(st._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition active:scale-95"
                        >
                          + Chọn
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-slate-400 text-sm">
                  Không tìm thấy học sinh nào.
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-slate-50 rounded-b-2xl text-right">
              <button
                onClick={() => setStudentModal({ isOpen: false, classId: "" })}
                className="px-6 py-2 bg-white border border-slate-300 text-slate-600 font-bold rounded-lg text-sm hover:bg-slate-100"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
