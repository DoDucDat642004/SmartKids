"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Send,
  Paperclip,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  User,
  MoreVertical,
  Archive,
} from "lucide-react";

// Mock Data
const mockTickets = [
  {
    id: "T-1023",
    user: "Chị Lan (Mẹ bé Bi)",
    userId: "U-001",
    avatar: "👩",
    email: "lan.nguyen@gmail.com",
    phone: "0909 123 456",
    isVip: true,
    category: "BILLING",
    subject: "Lỗi thanh toán gói 1 năm",
    status: "OPEN",
    createdAt: "10 phút trước",
    messages: [
      {
        sender: "USER",
        content:
          "Chào ad, mình vừa thanh toán qua Momo nhưng tài khoản vẫn chưa lên VIP. Kiểm tra giúp mình với.",
        time: "10:30 AM",
      },
    ],
  },
  {
    id: "T-1022",
    user: "Anh Hùng",
    userId: "U-002",
    avatar: "👨",
    email: "hung.tran@gmail.com",
    phone: "0912 345 678",
    isVip: false,
    category: "TECHNICAL",
    subject: "Không vào được bài học số 5",
    status: "IN_PROGRESS",
    createdAt: "2 giờ trước",
    messages: [
      {
        sender: "USER",
        content: "Bài Unit 2 Lesson 5 bị màn hình đen ad ơi.",
        time: "08:00 AM",
      },
      {
        sender: "ADMIN",
        content:
          "Chào anh, kỹ thuật bên em đang kiểm tra ạ. Anh dùng máy tính hay điện thoại thế ạ?",
        time: "08:15 AM",
      },
      { sender: "USER", content: "Mình dùng iPad nhé.", time: "08:20 AM" },
    ],
  },
  {
    id: "T-1020",
    user: "Cô Giáo Thảo",
    userId: "U-005",
    avatar: "👩‍🏫",
    email: "thao.teacher@edu.vn",
    phone: "",
    isVip: true,
    category: "OTHER",
    subject: "Hợp tác nội dung",
    status: "RESOLVED",
    createdAt: "1 ngày trước",
    messages: [
      {
        sender: "USER",
        content: "Mình muốn liên hệ hợp tác...",
        time: "Yesterday",
      },
    ],
  },
];

export default function SupportPage() {
  const [selectedTicket, setSelectedTicket] = useState<any>(mockTickets[0]);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState("ALL");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold border border-red-200">
            MỚI
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-200">
            ĐANG XỬ LÝ
          </span>
        );
      case "RESOLVED":
        return (
          <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold border border-green-200">
            ĐÃ XONG
          </span>
        );
      default:
        return null;
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    alert(`Đã gửi mail phản hồi tới: ${selectedTicket.email}`);
    setReplyText("");
    // Logic: Call API POST /tickets/{id}/reply
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">
        Hỗ trợ & Phản hồi 💬
      </h1>

      <div className="flex flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* --- LEFT SIDEBAR: LIST TICKETS --- */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="relative mb-3">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm theo tên, email..."
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition"
              />
            </div>
            <div className="flex gap-2">
              {["ALL", "OPEN", "RESOLVED"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 text-xs font-bold py-1.5 rounded ${
                    filter === f
                      ? "bg-slate-800 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {f === "ALL"
                    ? "Tất cả"
                    : f === "OPEN"
                    ? "Chưa xử lý"
                    : "Đã xong"}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {mockTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition hover:bg-blue-50
                ${
                  selectedTicket.id === ticket.id
                    ? "bg-blue-50 border-l-4 border-l-blue-600"
                    : "bg-white border-l-4 border-l-transparent"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    {ticket.isVip && (
                      <span className="text-[10px] bg-yellow-400 text-white px-1 rounded font-bold">
                        VIP
                      </span>
                    )}
                    <span
                      className={`font-bold text-sm ${
                        selectedTicket.id === ticket.id
                          ? "text-blue-700"
                          : "text-slate-700"
                      }`}
                    >
                      {ticket.user}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {ticket.createdAt}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-600 mb-1 truncate">
                  {ticket.subject}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {ticket.messages[ticket.messages.length - 1].content}
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold">
                    {ticket.category}
                  </span>
                  {getStatusBadge(ticket.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT CONTENT: CHAT & DETAILS --- */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Header Ticket Info */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                {selectedTicket.avatar}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  {selectedTicket.subject}
                  <span className="text-xs font-normal text-gray-400">
                    #{selectedTicket.id}
                  </span>
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <User size={12} /> {selectedTicket.user}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail size={12} /> {selectedTicket.email}
                  </span>
                  {selectedTicket.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={12} /> {selectedTicket.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="border px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                <CheckCircle size={14} /> Đánh dấu Đã xong
              </button>
              <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                <Archive size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Chat History Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50">
            {selectedTicket.messages.map((msg: any, idx: number) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === "ADMIN" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-end gap-2 max-w-[80%]">
                  {msg.sender === "USER" && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                      {selectedTicket.avatar}
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-2xl text-sm shadow-sm
                      ${
                        msg.sender === "ADMIN"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-slate-700 border border-gray-200 rounded-bl-none"
                      }`}
                  >
                    {msg.content}
                  </div>

                  {msg.sender === "ADMIN" && (
                    <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-xs text-white">
                      Ad
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-12">
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* Reply Box */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2 mb-2">
              <button className="text-xs font-bold bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-600">
                + Mẫu: Hướng dẫn Reset Pass
              </button>
              <button className="text-xs font-bold bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-600">
                + Mẫu: Chính sách hoàn tiền
              </button>
            </div>
            <div className="relative">
              <textarea
                className="w-full border border-gray-300 rounded-xl p-4 pr-12 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                rows={3}
                placeholder="Nhập nội dung phản hồi... (Sẽ gửi qua Email cho phụ huynh)"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                  <Paperclip size={18} />
                </button>
                <button
                  onClick={handleSendReply}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
