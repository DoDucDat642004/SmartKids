"use client";

import { useState, useRef, useEffect } from "react";
import {
  Loader2,
  Search,
  MessageCircle,
  UserMinus,
  UserPlus,
  CheckCircle,
  XCircle,
  Send,
  Heart,
  Sparkles,
  Users,
  Mail,
} from "lucide-react";
import { friendService } from "@/services/friend.service";
import { motion, AnimatePresence } from "framer-motion";

// --- MOCK DATA ---
const MOCK_FRIENDS = [
  {
    id: "1",
    name: "Bé Nana",
    avatar: "https://i.pravatar.cc/150?img=5",
    level: 5,
    status: "online",
  },
  {
    id: "2",
    name: "Siêu Nhân",
    avatar: "https://i.pravatar.cc/150?img=11",
    level: 8,
    status: "offline",
  },
  { id: "3", name: "Mèo Kitty", avatar: "🐱", level: 3, status: "online" },
];

const MOCK_REQUESTS = [
  {
    id: "req_1",
    name: "Khủng Long T-Rex",
    avatar: "🦖",
    level: 10,
    time: new Date().toISOString(),
  },
  {
    id: "req_2",
    name: "Công Chúa Elsa",
    avatar: "https://i.pravatar.cc/150?img=9",
    level: 6,
    time: new Date().toISOString(),
  },
];

// --- SUB-COMPONENT: CHAT MODAL ---
const ChatModal = ({ friend, onClose }: any) => {
  const [messages, setMessages] = useState<any[]>([
    { sender: "friend", text: `Hi! Tớ là ${friend.name}. Cùng học nhé! 👋` },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "me", text: input }]);
    setInput("");
    setTimeout(() => {
      const replies = [
        "Tuyệt quá! 🌟",
        "Cố lên nhé! 💪",
        "Tớ đang làm bài tập nè 📚",
        "Hihi 😂",
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setMessages((prev) => [...prev, { sender: "friend", text: reply }]);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[600px] border-4 border-white ring-4 ring-pink-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Chat */}
        <div className="bg-gradient-to-r from-pink-400 to-rose-400 p-4 flex justify-between items-center text-white shadow-md z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              {friend.avatar?.includes("http") ? (
                <img
                  src={friend.avatar}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-xl border-2 border-white/50">
                  {friend.avatar}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">{friend.name}</h3>
              <p className="text-xs text-pink-100 font-medium">Đang online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 w-8 h-8 rounded-full flex items-center justify-center transition"
          >
            &times;
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FFF5F8] custom-scrollbar">
          {messages.map((msg, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm relative ${
                  msg.sender === "me"
                    ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-br-sm"
                    : "bg-white text-slate-600 rounded-bl-sm border border-pink-100"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-slate-100 rounded-full px-5 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-pink-300 transition"
            placeholder="Nhập tin nhắn..."
          />
          <button
            onClick={handleSend}
            className="bg-pink-500 text-white w-11 h-11 rounded-full hover:bg-pink-600 transition flex items-center justify-center shadow-md active:scale-95"
          >
            <Send size={18} className="-ml-0.5 mt-0.5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- COMPONENT CHÍNH ---
export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<"list" | "requests" | "find">(
    "list",
  );
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeChatFriend, setActiveChatFriend] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [friendsRes, requestsRes] = await Promise.all([
        friendService.getFriends().catch(() => null),
        friendService.getRequests().catch(() => null),
      ]);
      setFriends(
        friendsRes && friendsRes.length > 0 ? friendsRes : MOCK_FRIENDS,
      );
      setRequests(
        requestsRes && requestsRes.length > 0 ? requestsRes : MOCK_REQUESTS,
      );
    } catch (e) {
      console.error("Lỗi fetch friends, dùng mock data");
      setFriends(MOCK_FRIENDS);
      setRequests(MOCK_REQUESTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUnfriend = async (id: string) => {
    if (confirm("Bé có chắc muốn nghỉ chơi với bạn này không? 😢")) {
      setFriends(friends.filter((f) => f.id !== id));
    }
  };

  const handleAccept = async (requestId: string) => {
    setRequests(requests.filter((r) => r.id !== requestId));
    alert("Đã thêm bạn mới! 🎉");
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setSearchResults([
        {
          _id: "new_1",
          fullName: "Bạn Mới Tí Hon",
          avatar: "🐨",
          stats: { level: 2 },
        },
        {
          _id: "new_2",
          fullName: "Siêu Nhân Nhện",
          avatar: "🕷️",
          stats: { level: 9 },
        },
      ]);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FDF2F8] font-sans pb-20 p-4 md:p-8 pt-24">
      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-block"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-2 drop-shadow-sm flex items-center justify-center gap-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
              Biệt Đội
            </span>{" "}
            Bạn Bè
            <span className="text-4xl animate-bounce">👫</span>
          </h1>
          <p className="text-slate-500 font-bold bg-white/60 backdrop-blur-sm inline-block px-6 py-2 rounded-full shadow-sm mt-2 border border-white">
            Kết nối, trò chuyện và cùng nhau tiến bộ!
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* TABS NAVIGATION */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-2 rounded-full shadow-lg border border-pink-100 flex gap-2">
            {[
              { id: "list", label: "Danh sách", icon: Users },
              {
                id: "requests",
                label: "Lời mời",
                icon: Mail,
                count: requests.length,
              },
              { id: "find", label: "Tìm bạn", icon: Search },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <tab.icon size={18} /> {tab.label}
                {tab.count ? (
                  <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1 font-black shadow-sm border border-white">
                    {tab.count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

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
              <Loader2 className="animate-spin text-pink-500" size={48} />
            </motion.div>
          ) : (
            <>
              {/* --- VIEW: FRIEND LIST --- */}
              {activeTab === "list" && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {friends.length === 0 ? (
                    <div className="col-span-full text-center text-slate-400 py-20 bg-white rounded-[2rem] border-dashed border-2 border-slate-200">
                      <div className="text-6xl mb-4 grayscale opacity-50">
                        😿
                      </div>
                      Chưa có bạn bè. Hãy đi tìm bạn mới nhé!
                    </div>
                  ) : (
                    friends.map((friend, i) => (
                      <motion.div
                        key={friend.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-pink-200 hover:-translate-y-1 transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-[2rem]"></div>

                        <div className="relative flex flex-col items-center mb-4 pt-4">
                          <div className="relative">
                            {friend.avatar?.includes("http") ? (
                              <img
                                src={friend.avatar}
                                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-white text-4xl flex items-center justify-center rounded-full border-4 border-white shadow-md">
                                {friend.avatar}
                              </div>
                            )}
                            <div
                              className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white ${friend.status === "online" ? "bg-green-400" : "bg-slate-300"}`}
                            ></div>
                          </div>

                          <h3 className="font-black text-slate-800 text-lg mt-3 truncate w-full text-center">
                            {friend.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-white bg-indigo-400 px-2 py-0.5 rounded-full shadow-sm">
                              Lv.{friend.level}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              Học sinh giỏi
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3 px-4 pb-2">
                          <button
                            onClick={() => setActiveChatFriend(friend)}
                            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition flex items-center justify-center gap-2 active:scale-95"
                          >
                            <MessageCircle size={18} /> Chat ngay
                          </button>
                          <button
                            onClick={() => handleUnfriend(friend.id)}
                            className="w-11 flex items-center justify-center bg-red-50 text-red-400 rounded-xl hover:bg-red-100 hover:text-red-500 transition border border-red-100"
                            title="Hủy kết bạn"
                          >
                            <UserMinus size={20} />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}

              {/* --- VIEW: REQUESTS --- */}
              {activeTab === "requests" && (
                <motion.div
                  key="requests"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 max-w-2xl mx-auto"
                >
                  {requests.length === 0 ? (
                    <div className="text-center text-slate-400 py-20 bg-white rounded-3xl border border-slate-100">
                      Không có lời mời kết bạn nào.
                    </div>
                  ) : (
                    requests.map((req) => (
                      <div
                        key={req.id}
                        className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between gap-4 hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center text-3xl border-2 border-white shadow-sm shrink-0">
                            {req.avatar.includes("http") ? (
                              <img
                                src={req.avatar}
                                className="w-full h-full rounded-2xl object-cover"
                              />
                            ) : (
                              req.avatar
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg">
                              {req.name}
                            </h3>
                            <p className="text-sm text-slate-500 font-medium">
                              Muốn kết bạn với bé
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(req.id)}
                            className="bg-green-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg hover:bg-green-600 transition hover:scale-105 active:scale-95"
                          >
                            <CheckCircle size={24} />
                          </button>
                          <button className="bg-slate-100 text-slate-400 w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition active:scale-95">
                            <XCircle size={24} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {/* --- VIEW: FIND --- */}
              {activeTab === "find" && (
                <motion.div
                  key="find"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="max-w-xl mx-auto"
                >
                  <div className="relative mb-8 group">
                    <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition"></div>
                    <input
                      type="text"
                      placeholder="Nhập tên hoặc ID bạn bè..."
                      className="relative w-full pl-14 pr-28 py-4 bg-white border-2 border-transparent focus:border-blue-300 rounded-full outline-none text-slate-700 font-bold placeholder:font-medium placeholder:text-slate-400 shadow-xl transition"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={24}
                    />
                    <button
                      onClick={handleSearch}
                      className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-full font-black hover:bg-blue-700 transition shadow-md active:scale-95"
                    >
                      Tìm kiếm
                    </button>
                  </div>

                  <div className="space-y-3">
                    {searchResults.map((user) => (
                      <div
                        key={user._id}
                        className="bg-white p-4 rounded-3xl border border-slate-100 hover:border-blue-200 flex items-center justify-between shadow-sm transition group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center text-2xl border-4 border-white shadow-sm ring-1 ring-slate-100">
                            {user.avatar}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-lg">
                              {user.fullName}
                            </h4>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                              Level {user.stats?.level}
                            </span>
                          </div>
                        </div>
                        <button className="text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-4 py-2.5 rounded-xl transition font-bold flex items-center gap-2 group-hover:shadow-md">
                          <UserPlus size={18} /> Kết bạn
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* CHAT MODAL POPUP */}
      <AnimatePresence>
        {activeChatFriend && (
          <ChatModal
            friend={activeChatFriend}
            onClose={() => setActiveChatFriend(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
