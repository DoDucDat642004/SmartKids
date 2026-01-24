"use client";

import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  MoreVertical,
  Calendar,
  Download,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

// --- MOCK DATA ---
const CHART_DATA = [
  { name: "T2", revenue: 4000, active: 2400 },
  { name: "T3", revenue: 3000, active: 1398 },
  { name: "T4", revenue: 2000, active: 9800 },
  { name: "T5", revenue: 2780, active: 3908 },
  { name: "T6", revenue: 1890, active: 4800 },
  { name: "T7", revenue: 2390, active: 3800 },
  { name: "CN", revenue: 3490, active: 4300 },
];

const RECENT_ACTIVITY = [
  {
    user: "Bé Gia Hân",
    action: "đã hoàn thành Unit 3",
    course: "Tiếng Anh Lớp 1",
    time: "2 phút trước",
    avatar: "👧",
  },
  {
    user: "Tuấn Tú",
    action: "đạt điểm tuyệt đối",
    course: "Toán Tư Duy",
    time: "15 phút trước",
    avatar: "👦",
  },
  {
    user: "Minh Anh",
    action: "vừa đăng ký khóa",
    course: "Lập trình Scratch",
    time: "1 giờ trước",
    avatar: "🧑‍🚀",
  },
  {
    user: "Bảo Ngọc",
    action: "đã nộp bài tập",
    course: "Mỹ Thuật",
    time: "3 giờ trước",
    avatar: "🎨",
  },
];

const TOP_STUDENTS = [
  {
    id: "#SK001",
    name: "Nguyễn Văn A",
    course: "Tiếng Anh",
    progress: 85,
    status: "Active",
  },
  {
    id: "#SK002",
    name: "Trần Thị B",
    course: "Toán",
    progress: 40,
    status: "Pending",
  },
  {
    id: "#SK003",
    name: "Lê Văn C",
    course: "Lập trình",
    progress: 92,
    status: "Active",
  },
];

export default function AdminDashboard() {
  const stats = [
    {
      label: "Tổng Doanh thu",
      value: "125.4M",
      change: "+12.5%",
      isPositive: true,
      icon: <DollarSign size={22} />,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Học viên mới",
      value: "482",
      change: "+8.2%",
      isPositive: true,
      icon: <Users size={22} />,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Bài học hoàn thành",
      value: "15.3K",
      change: "-2.4%",
      isPositive: false,
      icon: <BookOpen size={22} />,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Tỉ lệ chuyển đổi",
      value: "86%",
      change: "+2%",
      isPositive: true,
      icon: <TrendingUp size={22} />,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans text-slate-800">
      {/* 1. HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Dashboard Tổng quan
          </h1>
          <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
            <Calendar size={16} /> Hôm nay,{" "}
            {new Date().toLocaleDateString("vi-VN")}
          </p>
        </div>

        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-600 p-2.5 rounded-xl hover:bg-slate-50 transition shadow-sm">
            <Bell size={20} />
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition flex items-center gap-2">
            <Download size={18} /> Tải báo cáo
          </button>
        </div>
      </motion.div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}
              >
                {stat.icon}
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
              >
                {stat.isPositive ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                {stat.change}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* CHART SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-xl text-slate-800">
                Phân tích hoạt động
              </h3>
              <p className="text-sm text-slate-400">
                Dữ liệu học tập & doanh thu 7 ngày qua
              </p>
            </div>
            <select className="bg-slate-50 border-none text-sm font-bold text-slate-600 rounded-lg p-2 focus:ring-0 cursor-pointer">
              <option>Tuần này</option>
              <option>Tháng này</option>
            </select>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={CHART_DATA}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <CartesianGrid
                  vertical={false}
                  stroke="#f1f5f9"
                  strokeDasharray="3 3"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="active"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorActive)"
                  name="Hoạt động"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                  name="Doanh thu"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* RECENT ACTIVITY */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-slate-800">Hoạt động mới</h3>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical size={20} />
            </button>
          </div>

          <div className="space-y-6 flex-1 relative">
            {/* Timeline Line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-slate-100 z-0"></div>

            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex gap-4 relative z-10 group">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-50 flex items-center justify-center text-lg shadow-sm shrink-0">
                  {item.avatar}
                </div>
                <div className="bg-slate-50/50 p-3 rounded-xl flex-1 group-hover:bg-blue-50 transition-colors">
                  <p className="text-sm text-slate-800 leading-snug">
                    <span className="font-bold">{item.user}</span> {item.action}
                    <br />
                    <span className="text-blue-600 font-bold text-xs">
                      {item.course}
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                    <Clock size={10} /> {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition">
            Xem tất cả
          </button>
        </motion.div>
      </div>

      {/* 4. TABLE SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100"
      >
        <h3 className="font-bold text-xl text-slate-800 mb-6">
          Top Học viên xuất sắc
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="pb-3 pl-4 font-bold">ID</th>
                <th className="pb-3 font-bold">Học viên</th>
                <th className="pb-3 font-bold">Khóa học</th>
                <th className="pb-3 font-bold">Tiến độ</th>
                <th className="pb-3 font-bold">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {TOP_STUDENTS.map((student, i) => (
                <tr
                  key={i}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="py-4 pl-4 text-slate-500 font-mono">
                    {student.id}
                  </td>
                  <td className="py-4 font-bold text-slate-800">
                    {student.name}
                  </td>
                  <td className="py-4 text-slate-600">{student.course}</td>
                  <td className="py-4 w-48">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-blue-600">
                        {student.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        student.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
