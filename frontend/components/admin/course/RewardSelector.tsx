"use client";

import { useState, useEffect } from "react";
import { X, Search, CheckCircle, Loader2 } from "lucide-react";
import { handbookService } from "@/services/handbook.service";
import { shopService } from "@/services/shop.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: "HANDBOOK" | "ITEM"; // Chọn Thẻ hay Chọn Vật phẩm
  selectedIds: string[]; // Danh sách ID đang được chọn
  onConfirm: (ids: string[]) => void;
}

export default function RewardSelector({
  isOpen,
  onClose,
  type,
  selectedIds,
  onConfirm,
}: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSelected, setLocalSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load dữ liệu khi mở Modal
  useEffect(() => {
    if (isOpen) {
      setLocalSelected(selectedIds || []); // Copy ID cũ vào state tạm
      fetchData();
    }
  }, [isOpen, type]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let res: any[] = [];
      if (type === "HANDBOOK") {
        res = await handbookService.getItems();
      } else {
        res = await shopService.getItems();
      }
      setItems(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      alert("Lỗi tải danh sách vật phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Logic chọn / bỏ chọn
  const toggleSelect = (id: string) => {
    setLocalSelected((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id); // Bỏ chọn
      return [...prev, id]; // Chọn thêm
    });
  };

  // Lọc theo từ khóa tìm kiếm
  const filteredItems = items.filter((item) =>
    (item.word || item.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
          <h3 className="font-bold text-lg text-slate-800">
            {type === "HANDBOOK" ? "📚 Chọn Thẻ bài" : "🎒 Chọn Vật phẩm"}
          </h3>
          <button onClick={onClose}>
            <X size={20} className="text-gray-400 hover:text-red-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b">
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
            <input
              className="w-full border pl-9 pr-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Tìm kiếm theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* List Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filteredItems.map((item) => {
                const isSelected = localSelected.includes(item._id);
                return (
                  <div
                    key={item._id}
                    onClick={() => toggleSelect(item._id)}
                    className={`cursor-pointer rounded-xl border-2 p-2 flex flex-col items-center gap-2 transition-all relative
                                    ${isSelected ? "border-blue-500 bg-blue-50" : "border-white bg-white hover:border-gray-300 shadow-sm"}
                                `}
                  >
                    {/* Ảnh */}
                    <img
                      src={
                        item.imageUrl ||
                        item.thumbnail ||
                        "https://placehold.co/100"
                      }
                      className="w-16 h-16 object-contain"
                      alt="icon"
                    />
                    {/* Tên */}
                    <span className="text-xs font-bold text-center line-clamp-2 text-slate-700">
                      {item.word || item.name}
                    </span>

                    {/* Badge Check */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 text-blue-500 bg-white rounded-full">
                        <CheckCircle
                          size={18}
                          fill="white"
                          className="text-blue-600"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredItems.length === 0 && (
                <p className="col-span-4 text-center text-gray-400 text-sm">
                  Không tìm thấy kết quả.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white flex justify-between items-center rounded-b-xl">
          <span className="text-sm font-bold text-slate-500">
            Đã chọn: {localSelected.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              onClick={() => onConfirm(localSelected)}
              className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
