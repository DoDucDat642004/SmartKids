"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Package,
  RefreshCw,
  AlertTriangle,
  Search,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
} from "lucide-react";
import { financeService } from "@/services/finance.service";
import PackageEditorModal from "@/components/admin/finance/PackageEditorModal";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<
    "PACKAGES" | "TRANSACTIONS" | "SUBSCRIPTIONS"
  >("PACKAGES");
  const [loading, setLoading] = useState(false);

  // Data States
  const [packages, setPackages] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Helper format tiền
  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  // Helper format ngày
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN");

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "PACKAGES") {
        const res: any = await financeService.getPackages(false); // Lấy cả active & inactive
        setPackages(res);
      } else if (activeTab === "TRANSACTIONS") {
        const res: any = await financeService.getTransactions();
        setTransactions(res);
      } else if (activeTab === "SUBSCRIPTIONS") {
        const res: any = await financeService.getSubscriptions();
        setSubscriptions(res);
      }
    } catch (error) {
      console.error("Failed to fetch finance data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Actions
  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pkg: any) => {
    setEditingItem(pkg);
    setIsModalOpen(true);
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa gói cước này?")) return;
    try {
      await financeService.deletePackage(id);
      fetchData();
    } catch (e) {
      alert("Lỗi khi xóa!");
    }
  };

  const getSubStatusBadge = (status: string) => {
    const styles: any = {
      ACTIVE: "bg-green-100 text-green-700 border-green-200",
      EXPIRED: "bg-gray-100 text-gray-500 border-gray-200",
      CANCELED: "bg-red-100 text-red-700 border-red-200",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-bold border ${
          styles[status] || ""
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-6">
      {/* 1. HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-3xl font-bold">Finance</h3>
          <p className="text-xs">Quản lý doanh thu</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-3xl font-bold">₫ 45,200,000</h3>

          <p className="text-xs">Doanh thu tháng</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-800">1,240</h3>

          <p className="text-xs text-gray-400">Giao dịch thành công</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-blue-600">Gói 1 Năm 🏆</h3>

          <p className="text-xs text-gray-400">Best Seller</p>
        </div>
      </div>

      {/* 2. TABS */}
      <div className="flex justify-between items-center bg-white p-1 rounded-xl w-fit border border-gray-200 shadow-sm">
        <button
          onClick={() => setActiveTab("PACKAGES")}
          className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${
            activeTab === "PACKAGES"
              ? "bg-blue-600 text-white shadow"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <Package size={18} /> Sản phẩm
        </button>
        <button
          onClick={() => setActiveTab("SUBSCRIPTIONS")}
          className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${
            activeTab === "SUBSCRIPTIONS"
              ? "bg-purple-600 text-white shadow"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <RefreshCw size={18} /> Thuê bao
        </button>
        <button
          onClick={() => setActiveTab("TRANSACTIONS")}
          className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${
            activeTab === "TRANSACTIONS"
              ? "bg-green-600 text-white shadow"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <CreditCard size={18} /> Lịch sử Giao dịch
        </button>
      </div>

      {/* 3. CONTENT AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {/* TAB PACKAGES */}
            {activeTab === "PACKAGES" && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={handleCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow transition"
                  >
                    <Plus size={18} /> Thêm Gói Cước
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packages.map((pack) => (
                    <div
                      key={pack._id}
                      className={`bg-white p-6 rounded-xl border shadow-sm relative group ${
                        !pack.isActive
                          ? "opacity-70 bg-gray-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-slate-800">
                          {pack.name}
                        </h3>
                        {pack.badge && (
                          <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full">
                            {pack.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-blue-600 font-bold text-2xl mb-1">
                        {formatMoney(pack.price)}
                      </div>
                      {pack.originalPrice > 0 && (
                        <div className="text-gray-400 text-sm line-through mb-4">
                          {formatMoney(pack.originalPrice)}
                        </div>
                      )}

                      <div className="space-y-2 mb-6">
                        {pack.benefits?.map((b: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm text-gray-600"
                          >
                            <CheckCircle size={14} className="text-green-500" />{" "}
                            {b}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleEdit(pack)}
                          className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                        >
                          <Edit size={16} /> Sửa
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pack._id)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB SUBSCRIPTIONS */}
            {activeTab === "SUBSCRIPTIONS" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                    <tr>
                      <th className="p-4">User ID</th>
                      <th className="p-4">Gói cước</th>
                      <th className="p-4">Thời hạn</th>
                      <th className="p-4">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {subscriptions.map((sub) => (
                      <tr key={sub._id} className="hover:bg-gray-50">
                        <td className="p-4 font-mono text-xs">{sub.userId}</td>
                        <td className="p-4 font-bold text-blue-600">
                          {sub.packageId?.name || "Gói cũ"}
                        </td>
                        <td className="p-4 text-xs">
                          <div>Start: {formatDate(sub.startDate)}</div>
                          <div className="font-bold">
                            End: {formatDate(sub.endDate)}
                          </div>
                        </td>
                        <td className="p-4">{getSubStatusBadge(sub.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB TRANSACTIONS */}
            {activeTab === "TRANSACTIONS" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                    <tr>
                      <th className="p-4">Mã GD</th>
                      <th className="p-4">User ID</th>
                      <th className="p-4">Gói cước</th>
                      <th className="p-4">Số tiền</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4 text-right">Ngày giờ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map((trx) => (
                      <tr key={trx._id} className="hover:bg-gray-50">
                        <td className="p-4 font-mono text-xs text-gray-500">
                          {trx._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="p-4 font-mono text-xs">{trx.userId}</td>
                        <td className="p-4 font-bold">{trx.packageId?.name}</td>
                        <td className="p-4 font-bold text-slate-700">
                          {formatMoney(trx.amount)}
                        </td>
                        <td className="p-4">
                          {trx.status === "SUCCESS" ? (
                            <span className="text-green-600 font-bold text-xs flex items-center gap-1">
                              <CheckCircle size={14} /> Success
                            </span>
                          ) : (
                            <span className="text-red-500 font-bold text-xs">
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right text-xs text-gray-500">
                          {new Date(trx.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <PackageEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        initialData={editingItem}
      />
    </div>
  );
}
