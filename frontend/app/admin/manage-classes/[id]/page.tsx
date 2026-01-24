"use client";
import { useEffect, useState, use } from "react";
import { format, isPast, isFuture, addMinutes } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Plus,
  Trash,
  Calendar,
  Video,
  Save,
  User,
  Clock,
  ArrowLeft,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import { liveClassService } from "@/services/live-class.service";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ClassManagementDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  // Data State
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"SCHEDULE" | "STUDENTS">(
    "SCHEDULE",
  );

  // Students Search
  const [searchEmail, setSearchEmail] = useState("");
  const [foundUser, setFoundUser] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Edit State
  const [editingRecord, setEditingRecord] = useState<{
    lessonId: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = () => {
    setLoading(true);
    liveClassService
      .getClassDetail(id)
      .then((res: any) => setClassData(res.data || res))
      .finally(() => setLoading(false));
  };

  // --- HANDLERS ---
  const handleSearchUser = async () => {
    if (!searchEmail) return;
    setIsSearching(true);
    setFoundUser(null);
    try {
      const res: any = await liveClassService.searchUserByEmail(searchEmail);
      const user = res.data || res;
      if (user) {
        const exists = classData.students.some((s: any) => s._id === user._id);
        if (exists) alert("Học viên này đã có trong lớp!");
        else setFoundUser(user);
      } else {
        alert("Không tìm thấy user.");
      }
    } catch (e) {
      alert("Lỗi khi tìm kiếm.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddStudent = async () => {
    if (!foundUser) return;
    try {
      await liveClassService.addStudent(id, foundUser._id);
      setSearchEmail("");
      setFoundUser(null);
      fetchData();
      alert(`Đã thêm ${foundUser.fullName}!`);
    } catch (e) {
      alert("Lỗi thêm học sinh.");
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!confirm("Xóa học viên khỏi lớp?")) return;
    alert("Tính năng đang phát triển");
  };

  const handleUpdateSchedule = async (
    lessonId: string,
    startTimeStr: string,
  ) => {
    if (!startTimeStr) return;
    const startTime = new Date(startTimeStr);
    const endTime = addMinutes(startTime, 90);
    await liveClassService.updateSchedule(id, lessonId, { startTime, endTime });
    fetchData();
  };

  const handleSaveRecord = async () => {
    if (!editingRecord) return;
    await liveClassService.updateSchedule(id, editingRecord.lessonId, {
      recordingUrl: editingRecord.url,
    });
    setEditingRecord(null);
    fetchData();
  };

  if (loading || !classData)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium">
          Đang tải dữ liệu lớp học...
        </p>
      </div>
    );

  const scheduledCount = classData.schedule.filter(
    (s: any) => s.startTime,
  ).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-800">
      {/* 1. HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-900">
                  {classData.name}
                </h1>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${classData.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}
                >
                  {classData.isActive ? "ĐANG MỞ" : "ĐÃ ĐÓNG"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                GV: {classData.tutorId?.fullName || "Chưa phân công"}
              </p>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-8 mt-6">
            {[
              {
                id: "SCHEDULE",
                label: "Lịch Trình & Nội Dung",
                icon: Calendar,
                count: `${scheduledCount}/${classData.schedule.length}`,
              },
              {
                id: "STUDENTS",
                label: "Danh Sách Học Viên",
                icon: User,
                count: classData.students.length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <tab.icon size={16} /> {tab.label}
                <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <AnimatePresence mode="wait">
          {/* --- TAB: SCHEDULE --- */}
          {activeTab === "SCHEDULE" && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Timeline List */}
              <div className="lg:col-span-2 space-y-6">
                {classData.schedule.map((session: any, index: number) => {
                  const isLive = session.lessonId.type === "LIVE_SESSION";
                  const hasTime = !!session.startTime;
                  const isDone = hasTime && isPast(new Date(session.startTime));
                  const isUpcoming =
                    hasTime && isFuture(new Date(session.startTime));

                  return (
                    <div key={index} className="group flex gap-4">
                      {/* Time Column */}
                      <div className="flex flex-col items-center pt-2 min-w-[60px]">
                        <span className="text-xs font-bold text-slate-400 mb-1">
                          Buổi {index + 1}
                        </span>
                        <div
                          className={`w-3 h-3 rounded-full border-2 z-10 ${isDone ? "bg-green-500 border-green-500" : hasTime ? "bg-blue-500 border-blue-500" : "bg-white border-slate-300"}`}
                        ></div>
                        {index !== classData.schedule.length - 1 && (
                          <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div
                        className={`flex-1 bg-white rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${isLive ? "border-l-4 border-l-red-500" : "border-l-4 border-l-purple-500"}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${isLive ? "bg-red-50 text-red-500" : "bg-purple-50 text-purple-500"}`}
                            >
                              {isLive ? (
                                <Video size={20} />
                              ) : (
                                <Save size={20} />
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-base">
                                {session.lessonId.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                {isLive && !hasTime && (
                                  <span className="text-[10px] bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200 font-bold flex items-center gap-1">
                                    <AlertCircle size={10} /> Chưa xếp lịch
                                  </span>
                                )}
                                {isDone && (
                                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold">
                                    Đã kết thúc
                                  </span>
                                )}
                                {isUpcoming && (
                                  <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200 font-bold">
                                    Sắp diễn ra
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* Menu (Optional) */}
                          <button className="text-slate-300 hover:text-slate-600">
                            <MoreVertical size={18} />
                          </button>
                        </div>

                        {/* Config Area */}
                        {isLive && (
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">
                                Thời gian bắt đầu
                              </label>
                              <input
                                type="datetime-local"
                                className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-slate-700"
                                defaultValue={
                                  session.startTime
                                    ? new Date(session.startTime)
                                        .toISOString()
                                        .slice(0, 16)
                                    : ""
                                }
                                onBlur={(e) =>
                                  handleUpdateSchedule(
                                    session.lessonId._id,
                                    e.target.value,
                                  )
                                }
                              />
                              {session.startTime && (
                                <p className="text-[10px] text-blue-600 mt-1.5 font-bold flex items-center gap-1">
                                  <Calendar size={10} />{" "}
                                  {format(
                                    new Date(session.startTime),
                                    "HH:mm - dd/MM/yyyy",
                                    { locale: vi },
                                  )}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">
                                Link Record (Youtube/Zoom)
                              </label>
                              <div className="flex gap-2">
                                <input
                                  className="flex-1 border border-slate-200 rounded-lg p-2 text-sm bg-white placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-green-500 transition"
                                  placeholder="Dán link vào đây..."
                                  defaultValue={session.recordingUrl || ""}
                                  onChange={(e) =>
                                    setEditingRecord({
                                      lessonId: session.lessonId._id,
                                      url: e.target.value,
                                    })
                                  }
                                />
                                {editingRecord?.lessonId ===
                                  session.lessonId._id && (
                                  <button
                                    onClick={handleSaveRecord}
                                    className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 shadow-sm transition"
                                  >
                                    <Save size={16} />
                                  </button>
                                )}
                              </div>
                              {session.recordingUrl && (
                                <p className="text-[10px] text-green-600 mt-1.5 font-bold flex items-center gap-1">
                                  <CheckCircle2 size={10} /> Đã có video
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
                  <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">
                    Tiến độ lớp học
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                        <span>Đã lên lịch</span>
                        <span>
                          {Math.round(
                            (scheduledCount / classData.schedule.length) * 100,
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(scheduledCount / classData.schedule.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <p className="text-xs text-blue-700 font-medium leading-relaxed">
                        💡 <strong>Mẹo:</strong> Hãy cập nhật link record ngay
                        sau buổi học để học viên có thể xem lại bài giảng.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- TAB: STUDENTS --- */}
          {activeTab === "STUDENTS" && (
            <motion.div
              key="students"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* Add Student Form */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase">
                  <Plus size={16} className="text-blue-600" /> Thêm học viên
                </h3>

                <div className="relative mb-4">
                  <Search
                    className="absolute left-3 top-3 text-slate-400"
                    size={18}
                  />
                  <input
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="Nhập email để tìm..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchUser()}
                  />
                  <button
                    onClick={handleSearchUser}
                    disabled={isSearching}
                    className="absolute right-2 top-2 bg-blue-600 text-white p-1 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isSearching ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <ArrowLeft size={14} className="rotate-180" />
                    )}
                  </button>
                </div>

                {foundUser && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={
                          foundUser.avatar ||
                          `https://ui-avatars.com/api/?name=${foundUser.fullName}`
                        }
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-800">
                          {foundUser.fullName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {foundUser.email}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleAddStudent}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-sm"
                    >
                      Xác nhận thêm vào lớp
                    </button>
                  </div>
                )}
              </div>

              {/* Student List */}
              <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-slate-700 text-sm uppercase">
                    Danh sách lớp
                  </h3>
                  <span className="bg-white text-slate-500 px-2 py-1 rounded text-xs font-bold border border-slate-200">
                    {classData.students.length} HV
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                  {classData.students.map((st: any, idx: number) => (
                    <div
                      key={st._id}
                      className="p-4 px-6 flex justify-between items-center hover:bg-slate-50 transition group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-slate-300 text-xs font-black w-6">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <img
                          src={
                            st.avatar ||
                            `https://ui-avatars.com/api/?name=${st.fullName}`
                          }
                          className="w-10 h-10 rounded-full bg-slate-100 object-cover border border-slate-100"
                        />
                        <div>
                          <div className="font-bold text-sm text-slate-800">
                            {st.fullName}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">
                            {st.email}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveStudent(st._id)}
                        className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition opacity-0 group-hover:opacity-100"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                  {classData.students.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                      <User size={48} className="mx-auto mb-3 opacity-20" />
                      <p className="font-medium">Lớp chưa có học viên nào.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
