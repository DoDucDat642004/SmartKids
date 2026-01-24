"use client";

import { useEffect, useState, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format, isPast, isWithinInterval, addMinutes } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Play,
  Video,
  FileText,
  CheckCircle,
  Clock,
  Calendar,
  ArrowLeft,
  ChevronDown,
  MonitorPlay,
  Gamepad2,
  ExternalLink,
  RefreshCw,
  Loader2,
  Layers,
  FileQuestion,
} from "lucide-react";
import { liveClassService } from "@/services/live-class.service";
import ExamRoom from "@/components/clients/lesson/ExamRoom";
import { motion, AnimatePresence } from "framer-motion";

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
};

const accordionVariants = {
  collapsed: { opacity: 0, height: 0 },
  expanded: { opacity: 1, height: "auto" },
};

// --- DEFINITIONS ---
interface LessonData {
  _id: string;
  title: string;
  type: "GAME" | "LIVE_SESSION" | "EXAM" | "VIDEO";
  description?: string;
  materials?: string[];
  thumbnail?: string;
  videoUrl?: string;
  unitId?: { _id: string; title: string; order?: number };
}

interface ScheduleItem {
  _id: string;
  lessonId: LessonData;
  startTime?: string;
  recordingUrl?: string;
  isCompleted?: boolean;
}

export default function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  // State
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>(
    {},
  );
  const [activeExam, setActiveExam] = useState<any>(null);
  const [loadingExam, setLoadingExam] = useState(false);

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      const res: any = await liveClassService.getClassDetail(resolvedParams.id);
      const data = res.data || res;
      setClassData(data);

      if (
        Object.keys(expandedUnits).length === 0 &&
        data.schedule?.length > 0
      ) {
        const firstUnitId = data.schedule[0].lessonId?.unitId?._id || "general";
        setExpandedUnits({ [firstUnitId]: true });
      }
    } catch (error) {
      console.error("Lỗi tải lớp học", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [resolvedParams.id]);

  // --- HANDLERS ---
  const handleSyncContent = async () => {
    if (
      !confirm(
        "Hành động này sẽ tải các Lesson mới nhất. Dữ liệu cũ vẫn giữ nguyên. Tiếp tục?",
      )
    )
      return;
    setIsSyncing(true);
    try {
      await liveClassService.syncContent(resolvedParams.id);
      alert("Đã cập nhật nội dung thành công!");
      fetchData();
    } catch (error) {
      alert("Lỗi khi cập nhật nội dung.");
    } finally {
      setIsSyncing(false);
    }
  };

  const groupedSchedule = useMemo(() => {
    if (!classData?.schedule) return [];
    const groups: Record<
      string,
      { id: string; title: string; order: number; lessons: ScheduleItem[] }
    > = {};

    classData.schedule.forEach((item: ScheduleItem) => {
      const u = item.lessonId.unitId;
      const unitId = u?._id || "general";
      const unitTitle = u?.title || "Nội dung chung";
      const unitOrder = u?.order ?? 9999;

      if (!groups[unitId]) {
        groups[unitId] = {
          id: unitId,
          title: unitTitle,
          order: unitOrder,
          lessons: [],
        };
      }
      groups[unitId].lessons.push(item);
    });

    return Object.values(groups).sort((a, b) => a.order - b.order);
  }, [classData]);

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const handleAction = async (session: ScheduleItem) => {
    const { type, _id } = session.lessonId;
    const { _id: classId } = classData;

    if (type === "LIVE_SESSION") {
      if (session.recordingUrl) window.open(session.recordingUrl, "_blank");
      else router.push(`/live-room/${classId}`);
      return;
    }

    if (type === "EXAM") {
      try {
        setLoadingExam(true);
        const res: any = await liveClassService.getLessonDetail(_id);
        const fullLesson = res.data || res;

        if (
          fullLesson.examConfig &&
          fullLesson.examConfig.questions?.length > 0
        ) {
          setActiveExam({
            _id: fullLesson._id,
            title: fullLesson.title,
            ...fullLesson.examConfig,
          });
        } else {
          alert("Bài kiểm tra này chưa có câu hỏi nào.");
        }
      } catch (error) {
        console.error(error);
        alert("Không thể tải đề thi.");
      } finally {
        setLoadingExam(false);
      }
      return;
    }

    router.push(`/learn/${_id}?classId=${classId}`);
  };

  // --- RENDER LOADING ---
  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            repeatType: "reverse",
          }}
          className="text-slate-500 font-medium"
        >
          Đang tải nội dung lớp học...
        </motion.p>
      </div>
    );

  if (!classData)
    return (
      <div className="p-20 text-center text-slate-500">
        Không tìm thấy lớp học.
      </div>
    );

  const totalLessons = classData.schedule?.length || 0;
  const completedCount =
    classData.schedule?.filter((s: any) => s.isCompleted || s.recordingUrl)
      .length || 0;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // --- RENDER EXAM ROOM ---
  if (activeExam) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 bg-white overflow-y-auto"
      >
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => {
              if (confirm("Bạn muốn thoát bài thi?")) setActiveExam(null);
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-bold transition"
          >
            Thoát
          </button>
        </div>
        <div className="pt-12 pb-20 px-4">
          <ExamRoom
            examData={activeExam}
            onComplete={async (score) => {
              alert(`Bạn đã hoàn thành bài thi với số điểm: ${score}`);
              setActiveExam(null);
            }}
          />
        </div>
      </motion.div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* Loading Exam Overlay */}
      <AnimatePresence>
        {loadingExam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
              <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
              <p className="font-bold text-slate-700">Đang tải đề thi...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HEADER HERO */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm"
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => router.push("/my-classes")}
              className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-bold transition"
            >
              <div className="bg-slate-100 p-1.5 rounded-full group-hover:bg-blue-50 transition">
                <ArrowLeft size={16} />
              </div>
              Quay lại danh sách
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSyncContent}
              disabled={isSyncing}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-xs text-slate-600 font-bold py-2 px-3 rounded-lg border border-slate-200 transition shadow-sm"
            >
              <RefreshCw
                size={14}
                className={isSyncing ? "animate-spin text-blue-600" : ""}
              />
              {isSyncing ? "Đang đồng bộ..." : "Cập nhật nội dung"}
            </motion.button>
          </div>

          {/* Info & Progress */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 leading-tight">
                {classData.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  <Calendar size={14} className="text-blue-500" />{" "}
                  {classData.baseCourseId?.title}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  <CheckCircle size={14} className="text-green-500" />{" "}
                  {classData.students?.length} Bạn học
                </span>
              </div>
            </div>

            <div className="w-full md:w-64">
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                <span>Tiến độ học tập</span>
                <span className="text-blue-600">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-blue-600 h-full rounded-full"
                ></motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. SYLLABUS CONTENT */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-6"
      >
        {groupedSchedule.map((group) => {
          const isExpanded = expandedUnits[group.id] ?? false;

          return (
            <motion.div
              variants={itemVariants}
              key={group.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* UNIT HEADER */}
              <div
                onClick={() => toggleUnit(group.id)}
                className={`px-6 py-5 flex justify-between items-center cursor-pointer select-none border-b transition-colors ${
                  isExpanded
                    ? "bg-slate-50 border-slate-200"
                    : "bg-white border-transparent hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isExpanded ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-400"}`}
                  >
                    <Layers size={20} />
                  </div>
                  <div>
                    <h3
                      className={`font-bold text-lg ${isExpanded ? "text-blue-700" : "text-slate-700"}`}
                    >
                      {group.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {group.lessons.length} bài học
                    </p>
                  </div>
                </div>

                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`text-slate-400 ${isExpanded ? "text-blue-600" : ""}`}
                >
                  <ChevronDown size={24} />
                </motion.div>
              </div>

              {/* LESSON LIST (ACCORDION) */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={accordionVariants}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="divide-y divide-slate-50">
                      {group.lessons.map((session, idx) => (
                        <LessonRow
                          key={idx}
                          session={session}
                          onAction={() => handleAction(session)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Empty State */}
        {groupedSchedule.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300"
          >
            <div className="text-4xl mb-3 grayscale opacity-50">📭</div>
            <p className="text-slate-500 font-medium">
              Lớp học chưa có nội dung nào.
            </p>
            <button
              onClick={handleSyncContent}
              className="text-blue-600 font-bold hover:underline text-sm mt-2 flex items-center justify-center gap-1 mx-auto"
            >
              <RefreshCw size={12} /> Thử cập nhật nội dung
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// --- SUB-COMPONENT: LESSON ROW ---
function LessonRow({
  session,
  onAction,
}: {
  session: ScheduleItem;
  onAction: () => void;
}) {
  const { lessonId, startTime, recordingUrl } = session;
  const type = lessonId.type;

  let statusLabel = "";
  let statusColor = "text-slate-400";
  let isLiveNow = false;

  if (type === "LIVE_SESSION" && startTime) {
    const start = new Date(startTime);
    const end = addMinutes(start, 90);
    const now = new Date();

    if (isWithinInterval(now, { start, end })) {
      statusLabel = "ĐANG DIỄN RA";
      statusColor = "text-red-600 font-black animate-pulse";
      isLiveNow = true;
    } else if (isPast(end)) {
      statusLabel = "Đã kết thúc";
      statusColor = "text-slate-400 font-medium";
    } else {
      statusLabel = format(start, "HH:mm - dd/MM", { locale: vi });
      statusColor = "text-blue-600 font-bold";
    }
  }

  let Icon = FileText;
  let iconStyle = "text-slate-500 bg-slate-50 border-slate-100";

  switch (type) {
    case "LIVE_SESSION":
      Icon = Video;
      iconStyle = "text-red-500 bg-red-50 border-red-100";
      break;
    case "GAME":
      Icon = Gamepad2;
      iconStyle = "text-purple-500 bg-purple-50 border-purple-100";
      break;
    case "VIDEO":
      Icon = MonitorPlay;
      iconStyle = "text-blue-500 bg-blue-50 border-blue-100";
      break;
    case "EXAM":
      Icon = FileQuestion;
      iconStyle = "text-orange-500 bg-orange-50 border-orange-100";
      break;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ backgroundColor: "#F8FAFC" }}
      className="group p-4 pl-6 flex flex-col md:flex-row gap-4 items-start md:items-center relative"
    >
      <div className="flex gap-4 items-start flex-1 min-w-0">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${iconStyle} mt-0.5 shadow-sm`}
        >
          <Icon size={20} strokeWidth={2.5} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                type === "LIVE_SESSION"
                  ? "bg-red-100 text-red-600 border-red-200"
                  : type === "EXAM"
                    ? "bg-orange-100 text-orange-600 border-orange-200"
                    : "bg-slate-100 text-slate-500 border-slate-200"
              }`}
            >
              {type?.replace("_", " ")}
            </span>
            {statusLabel && (
              <span
                className={`text-xs flex items-center gap-1 ${statusColor}`}
              >
                <Clock size={12} /> {statusLabel}
              </span>
            )}
          </div>

          <h4
            className="font-bold text-slate-800 text-base cursor-pointer hover:text-blue-600 transition truncate pr-4"
            onClick={onAction}
            title={lessonId.title}
          >
            {lessonId.title}
          </h4>

          {lessonId.materials && lessonId.materials.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {lessonId.materials.map((mat, i) => (
                <a
                  key={i}
                  href={mat}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs flex items-center gap-1 bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded hover:border-blue-300 hover:text-blue-600 transition shadow-sm"
                >
                  <FileText size={10} /> Tài liệu {i + 1}{" "}
                  <ExternalLink size={10} className="opacity-50" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full md:w-auto flex justify-end pl-14 md:pl-0">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className={`text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition w-full md:w-auto justify-center shadow-sm whitespace-nowrap
            ${
              isLiveNow
                ? "bg-red-600 text-white hover:bg-red-700 shadow-red-200 animate-pulse border border-transparent"
                : recordingUrl && type === "LIVE_SESSION"
                  ? "bg-white border border-green-500 text-green-600 hover:bg-green-50"
                  : type === "EXAM"
                    ? "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-200 border border-transparent"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600"
            }`}
        >
          {isLiveNow ? (
            <>
              <Video size={16} /> VÀO HỌC NGAY
            </>
          ) : recordingUrl && type === "LIVE_SESSION" ? (
            <>
              <Play size={14} /> XEM LẠI RECORD
            </>
          ) : type === "GAME" ? (
            <>
              <Gamepad2 size={14} /> CHƠI GAME
            </>
          ) : type === "EXAM" ? (
            <>
              <FileQuestion size={14} /> LÀM BÀI THI
            </>
          ) : (
            "BẮT ĐẦU"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
